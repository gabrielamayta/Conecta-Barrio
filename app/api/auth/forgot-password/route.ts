import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// --- CONFIGURACIÓN SEGURA DE EMAIL (solo variables de entorno) ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // ← SOLO VARIABLES DE ENTORNO
    pass: process.env.EMAIL_PASS,
  },
});

// Verificar configuración al iniciar
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Error configurando email:", error);
  } else {
    console.log("✅ Servidor de email listo para enviar mensajes");
  }
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log("📧 Buscando usuario con email:", email);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ Variables de entorno de email faltantes");
      return NextResponse.json(
        { message: "Error de configuración del servidor." },
        { status: 500 }
      );
    }

    // Buscar usuario (case insensitive)
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
      select: { id: true, email: true, nombre: true, apellido: true },
    });

    if (!user) {
      console.log("❌ Usuario no encontrado");
      return NextResponse.json(
        { message: "Si la cuenta existe, hemos enviado un enlace a tu correo." },
        { status: 200 }
      );
    }

    console.log("✅ Usuario encontrado:", user.id);

    // Generar token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: tokenExpiration,
      },
    });

    // URL de recuperación
    const resetUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;

    // Configuración del email
    const mailOptions = {
      from: `"Conecta Barrio" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Recuperación de Contraseña - Conecta-Barrio",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hola ${user.nombre} ${user.apellido},</h2>
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
               Restablecer mi Contraseña
            </a>
          </div>
          <p>Este enlace expirará en 1 hora.</p>
          <hr />
          <small>Si no solicitaste este cambio, ignora este email.</small>
        </div>
      `,
    };

    console.log("📤 Enviando email a:", user.email);
    await transporter.sendMail(mailOptions);
    console.log("✅ Email enviado exitosamente");

    return NextResponse.json(
      { message: "Si la cuenta existe, hemos enviado un enlace a tu correo." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error durante la recuperación:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Ya existe una solicitud pendiente para este usuario." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
