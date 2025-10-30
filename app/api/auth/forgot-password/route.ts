import prisma from '@/lib/prisma';
import { generateSecureToken, calculateExpirationDate } from '@/lib/auth.utils'; 
import { NextResponse } from 'next/server';

const TOKEN_EXPIRATION_MINUTES = 60; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'El correo electrónico es requerido.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`Intento de recuperación para email no registrado: ${email}`);
      return NextResponse.json(
        { message: 'Se ha enviado un correo electrónico con instrucciones si tu cuenta existe.' },
        { status: 200 }
      );
    }

    const token = await generateSecureToken();
    const expiresAt = calculateExpirationDate(TOKEN_EXPIRATION_MINUTES);

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password/${token}`;
    
    console.log(`\n======================================================`);
    console.log(`💡 ENLACE DE RECUPERACIÓN (SOLO PARA DESARROLLO)`);
    console.log(`Usuario: ${user.email}`);
    console.log(`URL de Restablecimiento: ${resetUrl}`);
    console.log(`======================================================\n`);

    return NextResponse.json(
      { message: 'Se ha enviado un correo electrónico con instrucciones si tu cuenta existe.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en forgot-password API:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al procesar la solicitud.' },
      { status: 500 }
    );
  }
}