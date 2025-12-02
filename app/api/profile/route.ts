import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Buscar ambos perfiles
    const [comercianteProfile, profesionalProfile] = await Promise.all([
      prisma.comercianteProfile.findUnique({
        where: { userId },
      }),
      prisma.profesionalProfile.findUnique({
        where: { userId },
      }),
    ]);

    return NextResponse.json({
      comercianteProfile,
      profesionalProfile,
      hasProfile: !!(comercianteProfile || profesionalProfile)
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return NextResponse.json(
      { error: 'Error al obtener el perfil' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      profileType, 
      categoria, 
      descripcion, 
      telefono, 
      instagram,
      logoUrl,
      // Campos específicos
      nombreNegocio,
      direccion,
      nombreServicio,
      experiencia,
      zonaCobertura,
      disponibilidad
    } = body;

    if (!userId || !profileType) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    let updatedProfile;

    if (profileType === 'comerciante') {
      // Verificar que el usuario tenga rol COMERCIANTE
      if (user.role !== 'COMERCIANTE') {
        return NextResponse.json(
          { error: 'El usuario no tiene rol de comerciante' },
          { status: 403 }
        );
      }

      updatedProfile = await prisma.comercianteProfile.upsert({
        where: { userId },
        update: {
          nombreNegocio,
          categoria,
          descripcion,
          direccion,
          telefono,
          instagram: instagram || null,
          logoUrl: logoUrl || null,
        },
        create: {
          userId,
          usuario: `comercio_${Date.now()}`,
          nombreNegocio,
          categoria,
          descripcion,
          direccion,
          telefono,
          instagram: instagram || null,
          logoUrl: logoUrl || null,
          aprobado: false,
        },
      });
    } else {
      // Verificar que el usuario tenga rol PROFESIONAL
      if (user.role !== 'PROFESIONAL') {
        return NextResponse.json(
          { error: 'El usuario no tiene rol de profesional' },
          { status: 403 }
        );
      }

      updatedProfile = await prisma.profesionalProfile.upsert({
        where: { userId },
        update: {
          nombreServicio,
          categoria,
          descripcion,
          experiencia,
          zonaCobertura,
          telefono,
          disponibilidad,
          instagram: instagram || null,
          logoUrl: logoUrl || null,
        },
        create: {
          userId,
          usuario: `prof_${Date.now()}`,
          nombreServicio,
          categoria,
          descripcion,
          experiencia,
          zonaCobertura,
          telefono,
          disponibilidad,
          instagram: instagram || null,
          logoUrl: logoUrl || null,
          aprobado: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      data: updatedProfile,
      profileType,
      requiresApproval: !updatedProfile.aprobado
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar el perfil',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}