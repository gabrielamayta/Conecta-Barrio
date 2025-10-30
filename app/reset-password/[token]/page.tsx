'use client' // ⬅️ DEBE SER LA PRIMERA LÍNEA (después de comentarios, si hay)

import { useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Necesario para obtener el token
import Link from 'next/link';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useParams(); // Hook para obtener parámetros dinámicos de la URL
    const token = params.token as string | undefined; // Captura el token de la URL

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!token) {
            setError('Error: Token de restablecimiento no encontrado en la URL.');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
            // ... (resto de tu lógica de envío)
        }
        
        setIsLoading(true);

        try {
            // 💡 Esta llamada irá a la nueva API: /api/auth/reset-password
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('✅ ¡Contraseña restablecida con éxito! Serás redirigido en 3 segundos.');
                setTimeout(() => {
                    router.push('/login'); // Redirige al login después de un éxito
                }, 3000);
            } else {
                setError(data.message || 'El enlace es inválido o ha expirado. Por favor, solicita uno nuevo.');
            }
        } catch (err) {
            console.error('Error de conexión:', err);
            setError('No se pudo conectar con el servidor.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <h2 className="text-3xl font-serif font-bold text-center text-gray-900">
                    Restablecer Contraseña
                </h2>

                {/* Muestra mensajes de éxito o error */}
                {message && (
                    <div className="p-3 text-sm font-medium text-green-700 bg-green-100 border border-green-400 rounded-lg">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-3 text-sm font-medium text-red-700 bg-red-100 border border-red-400 rounded-lg">
                        {error}
                        <div className="mt-2 text-center">
                            <Link href="/forgot-password" passHref>
                                <span className="font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer">
                                    Solicitar un nuevo enlace
                                
                                </span>
                            </Link>
                        </div>
                    </div>
                )}

                {!message && (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Input Nueva Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nueva Contraseña
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Input Confirmar Contraseña */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmar Contraseña
                            </label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirma la nueva contraseña"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Cambiando Contraseña...' : 'Restablecer Contraseña'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}