import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      nombreNegocio, 
      categoria, 
      descripcion, 
      direccion, 
      telefono, 
      password,
      usuario 
    } = body;

    // Validaciones básicas
    if (!nombreNegocio || !categoria || !descripcion || !direccion || !telefono || !password || !usuario) {
      return NextResponse.json(
        { message: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const emailComerciante = `${usuario}@conectabarrio.com`;
    const usuarioExistente = await prisma.user.findUnique({
      where: { email: emailComerciante }
    });

    let userId: string;

    if (usuarioExistente) {
      userId = usuarioExistente.id;
      
      // Si el usuario ya existe, verificar si ya tiene perfil de comerciante
      const perfilExistente = await prisma.comercianteProfile.findUnique({
        where: { userId }
      });
      
      if (perfilExistente) {
        return NextResponse.json(
          { message: 'Este usuario ya tiene un perfil de comerciante' },
          { status: 400 }
        );
      }
    } else {
      // Crear nuevo usuario
      const hashedPassword = await bcrypt.hash(password, 12);

      const nuevoUser = await prisma.user.create({
        data: {
          nombre: nombreNegocio,
          apellido: 'Comerciante',
          email: emailComerciante,
          passwordHash: hashedPassword,
          role: 'COMERCIANTE',
        },
      });

      userId = nuevoUser.id;
    }

    // Crear perfil de comerciante
    const perfilComerciante = await prisma.comercianteProfile.create({
      data: {
        userId,
        usuario,
        nombreNegocio,
        categoria,
        descripcion,
        direccion,
        telefono,
        aprobado: true,
      },
    });

    return NextResponse.json(
      { 
        message: 'Perfil creado exitosamente', 
        perfil: perfilComerciante,
        redirectPath: '/login?message=Perfil+creado+exitosamente'
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error creando perfil de comerciante:', error);
    
    // Manejar errores de duplicados
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'El nombre de usuario ya existe. Por favor, intenta con otro nombre de negocio.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}