// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Asegúrate de que esta ruta es correcta
import bcrypt from 'bcrypt'; 

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body; 

        // 1. Validación básica de campos
        if (!email || !password) {
            return new NextResponse("Faltan credenciales (email y contraseña).", { status: 400 });
        }
        
        // 2. Buscar el usuario
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, nombre: true, role: true, passwordHash: true } 
        });

        // 3. Verificar si el usuario existe y si tiene passwordHash
        if (!user || !user.passwordHash) {
            // Criterio 3 (Fallo): Devuelve error genérico
            return new NextResponse("Email o contraseña incorrectos.", { status: 401 }); 
        }

        // 4. Comparar la contraseña ingresada con el hash
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            // Criterio 3 (Fallo): Devuelve error genérico
            return new NextResponse("Email o contraseña incorrectos.", { status: 401 });
        }
        
        // 5. Inicio de Sesión Exitoso (Criterio 2)
        // Definir la ruta de redirección según el rol (Criterio 4)
        let redirectPath = '/'; // Por defecto para VECINO
        
        if (user.role === 'COMERCIANTE' || user.role === 'PROFESIONAL') {
            redirectPath = '/dashboard'; // O la ruta de tu panel de control
        }

        // 6. Devolver el éxito y la ruta de redirección
        // NOTA: Para un sistema REAL, aquí se establecería un JWT o una cookie de sesión.
        // Por ahora, solo devolvemos la ruta que el frontend usará para redirigir.
        return NextResponse.json({ 
            message: "Login exitoso.", 
            userId: user.id,
            role: user.role,
            redirectPath: redirectPath 
        }, { status: 200 }); 

    } catch (error) {
        console.error("Error en POST /api/auth/login:", error);
        return new NextResponse("Error interno del servidor.", { status: 500 });
    }
}