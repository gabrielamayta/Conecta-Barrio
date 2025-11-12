import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  const { email } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, nombre: true } // Solo necesitamos el ID, email y nombre
  });

  if (!user) {
    // Respuesta de seguridad (siempre éxito)
    return NextResponse.json({ message: 'Si la cuenta existe, hemos enviado un enlace a tu correo.' }, { status: 200 });
  }

  // 1. Generar Token y Expiración
  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiration = new Date(Date.now() + 3600000); // 1 hora

  try {
    // 2. CREAR el token en la tabla PasswordResetToken
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: tokenExpiration,
      },
    });

    // 3. Enviar el Correo
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Recuperación de Contraseña - Conecta-Barrio',
      html: `
        <h2>Hola ${user.nombre},</h2>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta Conecta-Barrio.</p>
        <a href="${resetUrl}" 
           style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
           Restablecer mi Contraseña
        </a>
        <p style="margin-top: 20px;">Este enlace expirará en 1 hora.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error('Error durante la recuperación de contraseña:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
  
  return NextResponse.json({ message: 'Si la cuenta existe, hemos enviado un enlace a tu correo.' }, { status: 200 });
}