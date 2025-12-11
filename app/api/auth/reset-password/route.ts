import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// El tiempo de expiración del token debe ser el mismo que usaste en forgot-password (ej: 1 hora)
const TOKEN_EXPIRATION_HOURS = 1; 

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json({ message: "Faltan datos requeridos." }, { status: 400 });
        }

        // 1. Buscar el token en la base de datos
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true }, // Incluye la información del usuario
        });

        if (!resetToken || !resetToken.user) {
            return NextResponse.json({ message: "Token inválido o ya ha sido usado." }, { status: 404 });
        }

        // 2. Verificar si el token ha expirado
        const tokenExpiry = new Date(resetToken.createdAt.getTime() + TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000);
        if (new Date() > tokenExpiry) {
            // Eliminar el token expirado
            await prisma.passwordResetToken.delete({ where: { token } });
            return NextResponse.json({ message: "El token ha expirado. Por favor, solicita un nuevo enlace." }, { status: 400 });
        }

        // 3. Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Actualizar la contraseña del usuario y eliminar el token
        await prisma.$transaction([
            // a) Actualizar el passwordHash del usuario
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { passwordHash: hashedPassword },
            }),
            // b) Eliminar el token de restablecimiento (para que no pueda ser reutilizado)
            prisma.passwordResetToken.delete({
                where: { token },
            }),
        ]);

        return NextResponse.json({ message: "Contraseña restablecida con éxito." }, { status: 200 });

    } catch (error) {
        console.error("Error en POST /api/auth/reset-password:", error);
        return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
    }
}
