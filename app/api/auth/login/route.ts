// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt'; 

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body; 

        // 1. Validación básica de campos
        if (!email || !password) {
            // CORRECCIÓN: Usamos NextResponse.json() para devolver JSON (Estado 400)
            return NextResponse.json(
                { message: "Faltan credenciales (email y contraseña)." }, 
                { status: 400 }
            );
        }
        
        // 2. Buscar el usuario
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, nombre: true, role: true, passwordHash: true } 
        });

        // 3. Verificar si el usuario existe o si tiene passwordHash
        if (!user || !user.passwordHash) {
            // CORRECCIÓN: Usamos NextResponse.json() (Estado 401)
            return NextResponse.json(
                { message: "Email o contraseña incorrectos." }, 
                { status: 401 }
            ); 
        }

        // 4. Comparar la contraseña ingresada con el hash
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            // CORRECCIÓN: Usamos NextResponse.json() (Estado 401)
            return NextResponse.json(
                { message: "Email o contraseña incorrectos." }, 
                { status: 401 }
            );
        }
        
        // 5. Inicio de Sesión Exitoso (Criterio 2)
        let redirectPath = '/'; // Por defecto para VECINO
        
        if (user.role === 'COMERCIANTE' || user.role === 'PROFESIONAL') {
            redirectPath = '/dashboard'; // O la ruta de tu panel de control
        }

        // 6. Devolver el éxito y la ruta de redirección
        return NextResponse.json({ 
            message: "Login exitoso.", 
            userId: user.id,
            role: user.role,
            redirectPath: redirectPath 
        }, { status: 200 }); 

    } catch (error) {
        console.error("Error en POST /api/auth/login:", error);
        // CORRECCIÓN: Usamos NextResponse.json() para el error interno (Estado 500)
        return NextResponse.json(
            { message: "Error interno del servidor. Por favor, inténtelo más tarde." }, 
            { status: 500 }
        );
    }
}