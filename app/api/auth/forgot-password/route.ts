import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configuración mejorada para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || "maytagabi765@gmail.com",
    pass: process.env.EMAIL_PASS || "iiae aylz sqoq bglo",
  },
});

// Verificar la configuración del email al iniciar
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Error configurando email:', error);
  } else {
    console.log('✅ Servidor de email listo para enviar mensajes');
  }
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    console.log('📧 Buscando usuario con email:', email);

    // Verificar que las variables de entorno estén cargadas
    const emailUser = process.env.EMAIL_USER || "maytagabi765@gmail.com";
    const emailPass = process.env.EMAIL_PASS || "iiae aylz sqoq bglo";

    if (!emailUser || !emailPass) {
      console.error('❌ Variables de email no configuradas');
      return NextResponse.json({ 
        message: 'Error de configuración del servidor.' 
      }, { status: 500 });
    }

    // Buscar usuario (case insensitive)
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase().trim() 
      },
      select: { 
        id: true, 
        email: true, 
        nombre: true,
        apellido: true 
      }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      // Respuesta de seguridad (siempre éxito)
      return NextResponse.json({ 
        message: 'Si la cuenta existe, hemos enviado un enlace a tu correo.' 
      }, { status: 200 });
    }

    console.log('✅ Usuario encontrado:', user.id);

    // 1. Generar Token y Expiración
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = new Date(Date.now() + 3600000); // 1 hora

    // 2. CREAR el token en la tabla PasswordResetToken
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id, // Esto ahora es String (UUID)
        token: resetToken,
        expiresAt: tokenExpiration,
      },
    });

    // 3. Enviar el Correo
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Conecta Barrio" <${emailUser}>`,
      to: user.email,
      subject: 'Recuperación de Contraseña - Conecta-Barrio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hola ${user.nombre} ${user.apellido},</h2>
          <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta Conecta-Barrio.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
               Restablecer mi Contraseña
            </a>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Este enlace expirará en 1 hora.
          </p>
          <p style="color: #999; font-size: 12px;">
            Si no solicitaste este cambio, puedes ignorar este email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            Equipo de Conecta Barrio
          </p>
        </div>
      `,
    };

    console.log('📤 Enviando email a:', user.email);
    await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente');

    return NextResponse.json({ 
      message: 'Si la cuenta existe, hemos enviado un enlace a tu correo.' 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('❌ Error durante la recuperación de contraseña:', error);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        message: 'Ya existe una solicitud pendiente para este usuario.' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      message: 'Error interno del servidor.' 
    }, { status: 500 });
  }
}