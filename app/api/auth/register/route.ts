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
        
        // DEBUG COMPLETO: Ver TODOS los datos
        console.log('🔍 TODOS los datos recibidos:', body);
        
        const { 
            nombre, 
            apellido, 
            email, 
            password, 
            confirmPassword, 
            role,
            userType,
            telefono,
            nombreServicio,
            categoria,
            descripcion,
            usuario,
            experiencia,
            zonaCobertura,
            disponibilidad,
            nombreNegocio,
            direccion
        } = body;
        
        // DEBUG: Ver el estado de cada campo
        console.log('📊 Estado de campos obligatorios:', {
            nombre: nombre || 'FALTANTE',
            apellido: apellido || 'FALTANTE', 
            email: email || 'FALTANTE',
            password: password ? '✅' : 'FALTANTE',
            confirmPassword: confirmPassword ? '✅' : 'FALTANTE',
            telefono: telefono || 'FALTANTE',
            userType: userType || 'FALTANTE'
        });
        
        const userRole = (userType || role || 'VECINO').toUpperCase();

        // 1. Validación de campos obligatorios
        if (!nombre) {
            console.log('❌ Falta nombre');
            return new NextResponse("Falta el nombre.", { status: 400 });
        }
        if (!apellido) {
            console.log('❌ Falta apellido');
            return new NextResponse("Falta el apellido.", { status: 400 });
        }
        if (!email) {
            console.log('❌ Falta email');
            return new NextResponse("Falta el email.", { status: 400 });
        }
        if (!password) {
            console.log('❌ Falta password');
            return new NextResponse("Falta la contraseña.", { status: 400 });
        }
        
        if (!confirmPassword) {
            console.log('⚠️  ConfirmPassword no recibido, continuando sin validación de confirmación');
            // No bloquear el registro por ahora
        }
        if (!telefono) {
            console.log('❌ Falta teléfono');
            return new NextResponse("Falta el teléfono.", { status: 400 });
        }
        
        // 2. Validar que el rol sea uno de los valores permitidos del ENUM
        const validRoles: UserRole[] = ['VECINO', 'COMERCIANTE', 'PROFESIONAL'];
        if (!validRoles.includes(userRole as UserRole)) {
            return new NextResponse("Rol de usuario inválido.", { status: 400 });
        }
        
        // 3. Validaciones de Contraseña
        if (confirmPassword && password !== confirmPassword) {
            return new NextResponse("La contraseña y la confirmación no coinciden.", { status: 400 });
        }
        
        console.log('🔐 Validando contraseña...');
        if (!isPasswordSecure(password)) {
            console.log('❌ Contraseña no cumple requisitos');
            return new NextResponse("La contraseña no cumple con los requisitos de seguridad.", { status: 400 });
        }
        console.log('✅ Contraseña válida');

        // 4. Email no registrado
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return new NextResponse("Este email ya está registrado.", { status: 409 }); 
        }

        // 5. Hashing de contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        console.log('👤 Creando usuario en la base de datos...');
        
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

        console.log('✅ Usuario creado:', newUser.email);

        // 7. Crear perfiles específicos según el tipo de usuario
        if (userRole === 'COMERCIANTE') {
            console.log('🏪 Creando perfil de comerciante...');
            await prisma.comercianteProfile.create({
                data: {
                    userId: newUser.id,
                    usuario: usuario || '',
                    nombreNegocio: nombreNegocio || '',
                    categoria: categoria || 'Otros',
                    descripcion: descripcion || '',
                    direccion: direccion || '',
                    telefono: telefono,
                    aprobado: true,
                },
            });
        }

        if (userRole === 'PROFESIONAL') {
            console.log('🔧 Creando perfil de profesional...');
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
                    aprobado: true,
                },
            });
        }

        // 8. Redirección - SIEMPRE AL LOGIN
        const redirectPath = '/login';

        console.log('🎉 Registro completado exitosamente');

        return NextResponse.json(
            { 
                message: "Usuario registrado exitosamente",
                redirectPath: redirectPath,
                user: newUser
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("💥 Error en POST /api/auth/register:", error);
        return new NextResponse("Error interno del servidor al procesar el registro.", { status: 500 });
    }
}