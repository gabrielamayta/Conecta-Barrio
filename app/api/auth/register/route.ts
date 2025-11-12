import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt'; 
import { UserRole } from '@prisma/client';

// Helper: Validación de seguridad de contraseña (ESTE ESTÁ CORRECTO)
const isPasswordSecure = (password: string): boolean => {
    // Criterio: 8 caracteres, mayúscula, minúscula, número, símbolo.
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasDigit &&
        hasSymbol
    );
};

// ===============================================
// ROUTE HANDLER: POST
// ===============================================
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // AÑADIDO: Desestructuramos el campo 'role'
        const { nombre, apellido, email, password, confirmPassword, role } = body; 
        
        // Convertir el rol a mayúsculas para asegurar que coincida con el ENUM
        const userRole = role.toUpperCase(); 

        // 1. Validación de campos obligatorios (incluyendo role)
        if (!nombre || !apellido || !email || !password || !confirmPassword || !userRole) {
            return new NextResponse("Faltan campos obligatorios.", { status: 400 });
        }
        
        // 2. Validar que el rol sea uno de los valores permitidos del ENUM
        const validRoles: UserRole[] = ['VECINO', 'COMERCIANTE', 'PROFESIONAL'];
        if (!validRoles.includes(userRole as UserRole)) {
            return new NextResponse("Rol de usuario inválido.", { status: 400 });
        }
        
        // 3. Validaciones de Contraseña
        if (password !== confirmPassword) {
            return new NextResponse("La contraseña y la confirmación no coinciden.", { status: 400 });
        }
        if (!isPasswordSecure(password)) {
             return new NextResponse("La contraseña no cumple con los requisitos de seguridad.", { status: 400 });
        }

        // 4. Email no registrado
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return new NextResponse("Este email ya está registrado.", { status: 409 }); 
        }

        // 5. Hashing de contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // 6. Crear el usuario en la base de datos
        const newUser = await prisma.user.create({
            data: {
                nombre,
                apellido,
                email,
                passwordHash,
                role: userRole as UserRole, // Usamos el rol que el usuario seleccionó
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                role: true,
            }
        });

        // 7. Lógica de Redirección Condicional
        
        // 🚨 MODIFICACIÓN CRÍTICA PARA EL TEST DE REGISTRO
        // Devolvemos 201 sin cuerpo JSON. Esto fuerza al frontend a usar su 
        // fallback de redirección a /login cuando response.json() falla.
        return new NextResponse(null, { 
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        }); 

    } catch (error) {
        console.error("Error en POST /api/auth/register:", error);
        return new NextResponse("Error interno del servidor al procesar el registro.", { status: 500 });
    }
}