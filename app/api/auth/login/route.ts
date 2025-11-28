import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma'; // ✅ IMPORT CORREGIDO

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // 1. Validaciones básicas
        if (!email || !password) {
            return new NextResponse("Email y contraseña son obligatorios.", { status: 400 });
        }

        // 2. Buscar el usuario
        const user = await prisma.user.findUnique({
            where: { email },
            select: { 
                id: true, 
                email: true, 
                nombre: true, 
                role: true, 
                passwordHash: true 
            }
        });

        // 3. Verificar si el usuario existe
        if (!user) {
            return new NextResponse("Credenciales inválidas.", { status: 401 });
        }

        // 4. Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return new NextResponse("Credenciales inválidas.", { status: 401 });
        }

        // 5. Login exitoso
        return NextResponse.json({
            message: "Login exitoso",
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                role: user.role
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Error en POST /api/auth/login:", error);
        return new NextResponse("Error interno del servidor", { status: 500 });
    }
}