// app/registro/page.tsx

"use client"; // Marca este archivo como un componente de cliente para usar Hooks

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Hook para la redirección

// Helper para una validación de seguridad simple en el frontend (¡puedes hacerlo más robusto!)
const isPasswordSecure = (password: string): boolean => {
    // Debe coincidir con la lógica del backend: 8 caracteres, mayúscula, minúscula, número, símbolo.
    return password.length >= 8; // Validación básica por ahora
};


export default function RegistroComerciantePage() {
    const router = useRouter();

    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Maneja los cambios en los campos del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(null); // Limpia errores al escribir
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 1. Validación de campos obligatorios (local)
        const { nombre, apellido, email, password, confirmPassword } = formData;
        if (!nombre || !apellido || !email || !password || !confirmPassword) {
            setError('Por favor, completa todos los campos obligatorios.');
            setLoading(false);
            return;
        }

        // 2. Validación de coincidencia de contraseña
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        // 3. Validación de seguridad de contraseña (ajusta la función isPasswordSecure)
        if (!isPasswordSecure(password)) {
            setError('La contraseña debe tener al menos 8 caracteres (y otros requisitos de seguridad).');
            setLoading(false);
            return;
        }

        try {
            // Llama a la ruta API que creaste: /api/auth/register
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            // Procesa la respuesta de la API
            if (response.ok) {
                // Criterio de Aceptación: Registro Exitoso y Redirección
                const data = await response.json();
                console.log('Registro exitoso:', data.userId);
                
                // Redirige al inicio de sesión o a la creación del perfil de negocio.
                // Usamos la ruta sugerida en el backend: /perfil/crear
                router.push(data.redirectPath || '/perfil/crear'); 
                
            } else {
                // Criterio de Aceptación: Manejar errores (ej. Email ya registrado)
                const errorData = await response.text();
                // El backend devuelve el mensaje de error directamente
                setError(errorData || 'Ocurrió un error en el registro.');
            }

        } catch (err) {
            console.error('Error de red/servidor:', err);
            setError('No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>Registro Comerciante/Profesional</h1>
            
            {/* Muestra mensajes de error del backend/frontend */}
            {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                
                {/* Nombre y Apellido */}
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                />

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                {/* Contraseña */}
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {/* Confirmar Contraseña */}
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar Contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                {/* Botón de Registrarse */}
                <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: loading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
        </div>
    );
}