// app/registro/page.tsx

"use client"; // Marca este archivo como un componente de cliente para usar Hooks

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Hook para la redirección

// Helper para una validación de seguridad simple en el frontend
const isPasswordSecure = (password: string): boolean => {
    // Debe coincidir con la lógica del backend: 8 caracteres, mayúscula, minúscula, número, símbolo.
    return password.length >= 8; 
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
        role: 'VECINO', // Valor por defecto
    });
    
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Maneja los cambios en los campos de input y select
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        const { nombre, apellido, email, password, confirmPassword, role } = formData;
        if (!nombre || !apellido || !email || !password || !confirmPassword || !role) {
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

        // 3. Validación de seguridad de contraseña
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
                
                // 🛑 CRÍTICO: LOG DE DEPURACIÓN (Busca esto en la Consola del navegador)
                console.log('✅ Registro Exitoso.');
                console.log('Rol enviado al BE:', role);
                console.log('➡️ Redirección recibida del BE:', data.redirectPath); 
                
                // Usa la ruta de redirección que viene del backend (data.redirectPath)
                router.push(data.redirectPath || '/login'); 
                
            } else {
                // Manejar errores
                const errorData = await response.text();
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
        <div style={{ 
            maxWidth: '400px', 
            margin: '50px auto', 
            padding: '20px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: '#f9f9f9' // Estilo simple
        }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>Registro en Conecta Barrio</h1>
            
            {/* Muestra mensajes de error del backend/frontend */}
            {error && <p style={{ color: 'white', backgroundColor: '#dc3545', padding: '10px', borderRadius: '4px' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                
                {/* Nombre y Apellido */}
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                
                {/* Selector de Rol */}
                <label htmlFor="role" style={{ display: 'block', marginBottom: '-10px', marginTop: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    ¿Cómo deseas registrarte?
                </label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange} 
                    required
                    style={{ padding: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                    <option value="VECINO">Vecino/a</option>
                    <option value="COMERCIANTE">Comerciante</option>
                    <option value="PROFESIONAL">Profesional</option>
                </select>

                {/* Contraseña */}
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña (Mín. 8, Mayús, Núm, Símbolo)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />

                {/* Confirmar Contraseña */}
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar Contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />

                {/* Botón de Registrarse */}
                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ 
                        padding: '10px', 
                        backgroundColor: loading ? '#6c757d' : '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
        </div>
    );
}