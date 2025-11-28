import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const isPasswordSecure = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasDigit &&
        hasSymbol
    );
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const { 
            nombre, 
            apellido, 
            email, 
            password, 
            confirmPassword, 
            role,
            userType,
            telefono,
            // Campos específicos de profesionales
            nombreServicio,
            categoria,
            descripcion,
            usuario,
            experiencia,
            zonaCobertura,
            disponibilidad,
            // Campos específicos de comerciantes
            nombreNegocio,
            direccion
        } = body; 
        
        const userRole = (userType || role || 'VECINO').toUpperCase();

        console.log('Datos recibidos para registro:', { 
            userType, 
            role, 
            userRole, 
            email,
            nombreServicio,
            nombreNegocio
        });

        // 1. Validación de campos obligatorios
        if (!nombre || !apellido || !email || !password || !confirmPassword || !telefono) {
            return new NextResponse("Faltan campos obligatorios.", { status: 400 });
        }
        
        // 2. Validar que el rol sea uno de los valores permitidos del ENUM
        const validRoles: UserRole[] = ['VECINO', 'COMERCIANTE', 'PROFESIONAL'];
        if (!validRoles.includes(userRole as UserRole)) {
            return new NextResponse("Rol de usuario inválido.", { status: 400 });
        }
        
        // 3. Validaciones de Contraseña
        if (password !== confirmPassword) {
            return new NextResponse("La contraseña y la confirmación no coinciden.", { status: 400 });
        }
        if (!isPasswordSecure(password)) {
             return new NextResponse("La contraseña no cumple con los requisitos de seguridad.", { status: 400 });
        }

        // 4. Email no registrado
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return new NextResponse("Este email ya está registrado.", { status: 409 }); 
        }

        // 5. Hashing de contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // 6. Crear el usuario en la base de datos
        const newUser = await prisma.user.create({
            data: {
                nombre,
                apellido,
                email,
                passwordHash,
                role: userRole as UserRole,
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                role: true,
            }
        });

        // 7. Crear perfiles específicos según el tipo de usuario
        if (userRole === 'COMERCIANTE') {
            await prisma.comercianteProfile.create({
                data: {
                    userId: newUser.id,
                    usuario: usuario || '',
                    nombreNegocio: nombreNegocio || '',
                    categoria: categoria || 'Otros',
                    descripcion: descripcion || '',
                    direccion: direccion || '',
                    telefono: telefono,
                    aprobado: false,
                },
            });
            console.log('Perfil de comerciante creado para:', newUser.email);
        }

        if (userRole === 'PROFESIONAL') {
            await prisma.profesionalProfile.create({
                data: {
                    userId: newUser.id,
                    usuario: usuario || '',
                    nombreServicio: nombreServicio || '',
                    categoria: categoria || 'OTROS',
                    descripcion: descripcion || '',
                    experiencia: experiencia || '',
                    zonaCobertura: zonaCobertura || '',
                    telefono: telefono,
                    disponibilidad: disponibilidad || '',
                    aprobado: false,
                },
            });
            console.log('Perfil de profesional creado para:', newUser.email);
        }

        // 8. Lógica de Redirección
        let redirectPath = '/login';
        if (userRole === 'COMERCIANTE' || userRole === 'PROFESIONAL') {
            redirectPath = '/registro-exitoso';
        }

        return NextResponse.json(
            { 
                message: "Usuario registrado exitosamente",
                redirectPath: redirectPath,
                user: newUser
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error en POST /api/auth/register:", error);
        return new NextResponse("Error interno del servidor al procesar el registro.", { status: 500 });
    }
}