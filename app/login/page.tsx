// app/login/page.tsx
'use client'

import type React from "react"
import { useState } from "react"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input" 
// Asegúrate de importar cualquier otro componente que uses (ej. Header, Card)
// import Header from "@/components/header"; 

// Define la estructura de la respuesta del backend
interface ApiResponse {
    message: string;
    redirectPath?: string;
    userId?: string;
    role?: string;
}

export default function LoginPage() {
    const router = useRouter(); 
    
    const [formData, setFormData] = useState({
        // CORRECCIÓN: Usamos 'password' para coincidir con el backend
        email: "",
        password: "", 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // ENVIAMOS email y password, que es lo que el backend espera
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password, 
                }), 
            });

            const data: ApiResponse = await response.json();

            if (response.ok) {
                // Criterio 2: Login Exitoso. Redirección.
                router.push(data.redirectPath || '/');
                
            } else {
                // Criterio 3: Credenciales Incorrectas o error de validación
                // El backend devuelve el mensaje, como "Email o contraseña incorrectos."
                setError(data.message || 'Error desconocido. Inténtalo de nuevo.'); 
            }

        } catch (err) {
            console.error('Error de red/servidor:', err);
            setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };
    
    // Asumo que tienes una función para la navegación (ej. si usas un Header)
    // <Header /> 

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#B8E0E8] to-[#D4EEF3]">
            {/* Si usas un Header, insértalo aquí */}

            <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-serif text-center mb-6">Iniciar Sesión</h1>
                        
                        {/* Criterio 3: Mostrar Mensaje de Error */}
                        {error && (
                            // La clase text-red-700 es crucial para que Playwright lo localice
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Input de Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <Input
                                    id="email"
                                    name="email" // Usar 'email' para el name
                                    type="email"
                                    placeholder="tucorreo@ejemplo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Input de Contraseña */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                                <Input
                                    id="password"
                                    name="password" // Usar 'password' para el name
                                    type="password"
                                    placeholder="********"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        
                            <Button 
                                type="submit" 
                                className="w-full bg-black hover:bg-gray-800 text-white font-serif text-lg py-6"
                                disabled={loading}
                            >
                                {loading ? 'Verificando...' : 'Iniciar Sesión'}
                            </Button>
                        </form>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            ¿Aún no tienes cuenta? <a href="/registro" className="font-medium text-black hover:underline">Regístrate aquí</a>
                        </p>
                    </div>
                </div>
            </main>

        </div>
    )
}