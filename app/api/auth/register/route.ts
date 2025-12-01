import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

// Función para generar username aleatorio
function generarUsernameAleatorio(tipo: string): string {
  const prefix = tipo === 'COMERCIANTE' ? 'comercio' : 'servicio';
  const random = Math.random().toString(36).substring(2, 8).toLowerCase();
  return `${prefix}_${random}`;
}

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

// Función para guardar el logo
const saveLogoFile = async (file: File): Promise<string | null> => {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Crear directorio de uploads si no existe
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        // Generar nombre único para el archivo
        const fileExtension = file.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExtension}`;
        const filePath = path.join(uploadsDir, fileName);
        
        // Guardar archivo
        fs.writeFileSync(filePath, buffer);
        
        return `/uploads/${fileName}`;
    } catch (error) {
        console.error('Error guardando logo:', error);
        return null;
    }
};

export async function POST(request: Request) {
    try {
        // Leer como FormData en lugar de JSON
        const formData = await request.formData();
        
        // Extraer todos los campos
        const nombre = formData.get('nombre') as string;
        const apellido = formData.get('apellido') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const telefono = formData.get('telefono') as string;
        const userType = (formData.get('userType') as string)?.toUpperCase() || 'VECINO';
        
        // Campos específicos
        const nombreNegocio = formData.get('nombreNegocio') as string;
        const nombreServicio = formData.get('nombreServicio') as string;
        const categoria = formData.get('categoria') as string;
        const descripcion = formData.get('descripcion') as string;
        const direccion = formData.get('direccion') as string;
        const usuario = formData.get('usuario') as string; // Instagram (opcional)
        const experiencia = formData.get('experiencia') as string;
        const zonaCobertura = formData.get('zonaCobertura') as string;
        const disponibilidad = formData.get('disponibilidad') as string;
        
        // Procesar el logo
        const logoFile = formData.get('logo') as File;
        let logoUrl: string | null = null;
        
        if (logoFile && logoFile.size > 0) {
            console.log('📸 Procesando logo...');
            logoUrl = await saveLogoFile(logoFile);
            console.log('✅ Logo guardado:', logoUrl);
        }
        
        // DEBUG COMPLETO
        console.log('🔍 TODOS los datos recibidos:', {
            nombre, apellido, email, telefono, userType,
            nombreNegocio, categoria, descripcion, direccion,
            instagram: usuario || 'NO INGRESADO',
            logoUrl: logoUrl || 'NO SUBIDO'
        });
        
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
        if (!telefono) {
            console.log('❌ Falta teléfono');
            return new NextResponse("Falta el teléfono.", { status: 400 });
        }
        
        // Validaciones específicas por tipo de usuario
        if (userType === 'COMERCIANTE') {
            if (!nombreNegocio) return new NextResponse("Falta el nombre del comercio.", { status: 400 });
            if (!categoria) return new NextResponse("Falta la categoría.", { status: 400 });
            if (!direccion) return new NextResponse("Falta la dirección.", { status: 400 });
        }
        
        if (userType === 'PROFESIONAL') {
            if (!nombreServicio) return new NextResponse("Falta el nombre del servicio.", { status: 400 });
            if (!categoria) return new NextResponse("Falta la categoría.", { status: 400 });
            if (!experiencia) return new NextResponse("Falta la experiencia.", { status: 400 });
            if (!zonaCobertura) return new NextResponse("Falta la zona de cobertura.", { status: 400 });
        }
        
        // 2. Validar que el rol sea válido
        const validRoles: UserRole[] = ['VECINO', 'COMERCIANTE', 'PROFESIONAL'];
        if (!validRoles.includes(userType as UserRole)) {
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
                role: userType as UserRole,
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                role: true,
            }
        });

        console.log('✅ Usuario creado:', newUser.email);

        // 7. Crear perfiles específicos según el tipo de usuario CON USERNAME ALEATORIO
        if (userType === 'COMERCIANTE') {
            console.log('🏪 Creando perfil de comerciante...');
            
            // ✅ GENERAR USERNAME ALEATORIO
            const usernameAleatorio = generarUsernameAleatorio(userType);
            console.log('🔐 Username aleatorio generado:', usernameAleatorio);
            
            await prisma.comercianteProfile.create({
                data: {
                    userId: newUser.id,
                    usuario: usernameAleatorio, // ✅ USERNAME ALEATORIO
                    instagram: usuario || null, // ✅ INSTAGRAM OPCIONAL
                    nombreNegocio: nombreNegocio || '',
                    categoria: categoria || 'Otros',
                    descripcion: descripcion || '',
                    direccion: direccion || '',
                    telefono: telefono,
                    aprobado: true,
                    logoUrl: logoUrl,
                },
            });
        }

        if (userType === 'PROFESIONAL') {
            console.log('🔧 Creando perfil de profesional...');
            
            // ✅ GENERAR USERNAME ALEATORIO
            const usernameAleatorio = generarUsernameAleatorio(userType);
            console.log('🔐 Username aleatorio generado:', usernameAleatorio);
            
            await prisma.profesionalProfile.create({
                data: {
                    userId: newUser.id,
                    usuario: usernameAleatorio, // ✅ USERNAME ALEATORIO
                    instagram: usuario || null, // ✅ INSTAGRAM OPCIONAL
                    nombreServicio: nombreServicio || '',
                    categoria: categoria || 'OTROS',
                    descripcion: descripcion || '',
                    experiencia: experiencia || '',
                    zonaCobertura: zonaCobertura || '',
                    telefono: telefono,
                    disponibilidad: disponibilidad || '',
                    aprobado: true,
                    logoUrl: logoUrl,
                },
            });
        }

        console.log('🎉 Registro completado exitosamente');

        return NextResponse.json(
            { 
                message: "Usuario registrado exitosamente",
                redirectPath: '/login',
                user: newUser
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("💥 Error en POST /api/auth/register:", error);
        return new NextResponse("Error interno del servidor al procesar el registro.", { status: 500 });
    }
}