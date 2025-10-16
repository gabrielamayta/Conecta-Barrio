import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 
import bcrypt from 'bcrypt';

const isPasswordSecure = (password: string): boolean => {
    // Criterio: 8 caracteres, mayúscula, minúscula, número, símbolo.
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    // Verificar si tiene al menos un carácter especial (símbolo)
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
        const { nombre, apellido, email, password, confirmPassword } = body;

        // 1. Criterio: Validación de campos obligatorios
        if (!nombre || !apellido || !email || !password || !confirmPassword) {
            return new NextResponse("Faltan campos obligatorios (Nombre, Apellido, Email, Contraseña).", { status: 400 });
        }
        
        // 2. Criterio: Las contraseñas deben coincidir
        if (password !== confirmPassword) {
            return new NextResponse("La contraseña y la confirmación no coinciden.", { status: 400 });
        }

        // 3. Criterio: La contraseña debe cumplir requisitos mínimos de seguridad
        if (!isPasswordSecure(password)) {
             return new NextResponse("La contraseña no cumple con los requisitos de seguridad (mínimo 8 caracteres, mayúscula, minúscula, número, símbolo).", { status: 400 });
        }

        // 4. Criterio: El sistema debe validar que el email no esté previamente registrado.
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return new NextResponse("Este email ya está registrado.", { status: 409 }); // 409 Conflict
        }

        // 5. Hashing de contraseña antes de guardar
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // 6. Crear el usuario en la base de datos
        const newUser = await prisma.user.create({
            data: {
                nombre,
                apellido,
                email,
                passwordHash,
                role: 'COMERCIANTE', // Se registra con el perfil de la User Story
            },
            // Solo devolvemos campos seguros, nunca el passwordHash
            select: {
                id: true,
                email: true,
                nombre: true,
                role: true,
            }
        });

        // 7. Criterio: Registro exitoso y se asume la redirección en el frontend
        return NextResponse.json({ 
            message: "Registro exitoso. Redirigiendo a perfil de negocio.", 
            userId: newUser.id,
            redirectPath: "/perfil/crear" // Ruta sugerida
        }, { status: 201 }); // 201 Created

    } catch (error) {
        console.error("Error en POST /api/auth/register:", error);
        return new NextResponse("Error interno del servidor al procesar el registro.", { status: 500 });
    }
}