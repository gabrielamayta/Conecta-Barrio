// components/LoginForm.tsx
'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Llamamos a tu API de login
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // ÉXITO: Guardamos el rol (o cualquier dato necesario) para el frontend.
                // Aunque no estás usando un JWT aquí, guardar el rol es útil.
                // En un proyecto real, aquí guardarías un JWT o una cookie de sesión.
                sessionStorage.setItem('userRole', data.role);
                sessionStorage.setItem('userId', data.userId);

                // REDIRECCIÓN: Usamos la ruta devuelta por el backend
                console.log(`Redirigiendo a: ${data.redirectPath}`);
                router.push(data.redirectPath);
            } else {
                // ERROR: Credenciales inválidas u otro error de backend
                setError(data.message || 'Error al iniciar sesión. Verifica tus datos.');
            }
        } catch (err) {
            setError('Ocurrió un error de red. Inténtalo más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-900">
                Iniciar Sesión
            </h2>

            {/* Campo Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>

            {/* Campo Contraseña */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>

            {/* Enlace Olvidaste Contraseña */}
            <div className="text-sm text-right">
                <a 
                    href="/forgot-password" 
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    ¿Olvidaste tu contraseña?
                </a>
            </div>

            {/* Botón de Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
            >
                {isLoading ? 'Iniciando...' : 'Entrar'}
            </button>

            {/* Mensaje de Error */}
            {error && (
                <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
            )}
        </form>
    );
}