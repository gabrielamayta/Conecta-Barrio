import prisma from '@/lib/prisma';
// Asegúrate de que esta ruta a tus utilidades sea correcta.
// Necesitas la función hashPassword, que probablemente está en auth.utils.ts.
import { hashPassword } from '@/lib/auth.utils'; 
import { NextResponse } from 'next/server';

// Maneja la petición POST del formulario de restablecimiento
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // 1. Validación de entrada
    if (!token || !password || password.length < 8) {
      return NextResponse.json(
        { message: 'Token o contraseña inválida.' },
        { status: 400 }
      );
    }

    // 2. Buscar el token en la base de datos
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        // La fecha de expiración debe ser mayor a la fecha actual
        expiresAt: {
          gt: new Date(), 
        },
      },
    });

    // 3. Verificar si el token es válido o ha expirado
    if (!resetToken) {
      // Usamos 400 para indicar un error de datos/token
      return NextResponse.json(
        { message: 'El enlace de restablecimiento es inválido o ha expirado.' },
        { status: 400 }
      );
    }

    // --- Proceso de Restablecimiento ---

    // 4. Generar el hash de la nueva contraseña
    // 🚨 Asegúrate de que 'hashPassword' esté implementado en auth.utils.ts y use bcrypt
    const passwordHash = await hashPassword(password); 

    // 5. Actualizar la contraseña del usuario
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        passwordHash: passwordHash,
        updatedAt: new Date(),
      },
    });

    // 6. Eliminar el token de restablecimiento para que no pueda ser reutilizado
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    // 7. Respuesta de éxito
    return NextResponse.json(
      { message: 'Contraseña restablecida con éxito.' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error en reset-password API:', error);
    // Error 500 para fallas de servidor, base de datos o lógica interna
    return NextResponse.json(
      { message: 'Error interno del servidor al procesar el restablecimiento.' },
      { status: 500 }
    );
  }
}