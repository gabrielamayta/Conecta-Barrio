'use client'
import { useState } from "react"
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input" 
import { saveUserToLocalStorage } from '@/lib/session';

// Define la estructura CORRECTA basada en tu API
interface ApiResponse {
    message: string;
    user?: {  // ✅ user es opcional porque la API podría no devolverlo en caso de error
        id: string;
        email: string;
        nombre: string;
        role: string;
    };
}

export default function LoginPage() {
    const router = useRouter(); 
    
    const [formData, setFormData] = useState({
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
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password, 
                }), 
            });

            const data: ApiResponse = await response.json();

            if (response.ok && data.user) {
                // ✅ GUARDA EL USUARIO COMPLETO EN LOCALSTORAGE
                saveUserToLocalStorage(data.user);
                
                // ✅ GUARDA EN SESSIONSTORAGE SOLO SI LOS VALORES EXISTEN
                if (data.user.role && data.user.id) {
                    sessionStorage.setItem('userRole', data.user.role);
                    sessionStorage.setItem('userId', data.user.id);
                }
                
                // ✅ REDIRIGE SEGÚN EL ROL
                if (data.user.role === 'COMERCIANTE' || data.user.role === 'PROFESIONAL') {
                    router.push('/dashboard');
                } else {
                    router.push('/');
                }
                
            } else {
                // Maneja errores de la API
                setError(data.message || 'Credenciales incorrectas.'); 
            }

        } catch (err) {
            console.error('Error de red/servidor:', err);
            setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#B8E0E8] to-[#D4EEF3] flex items-center justify-center">
            <main className="container mx-auto px-4 py-12">
                <div className="w-full max-w-md mx-auto"> 
                    <div className="bg-white rounded-xl shadow-2xl p-8 transform transition-all hover:shadow-xl duration-300">
                        
                        <h1 className="text-3xl font-serif text-center mb-8 text-gray-800">Iniciar Sesión</h1>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="tucorreo@ejemplo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="rounded-lg h-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="********"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="rounded-lg h-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            
                            <div className="flex justify-end text-sm">
                                <Link 
                                    href="/forgot-password" 
                                    className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        
                            <Button 
                                type="submit" 
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg py-3 rounded-lg transition-colors duration-200"
                                disabled={loading}
                            >
                                {loading ? 'Verificando...' : 'Iniciar Sesión'}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            ¿Aún no tienes cuenta? <Link href="/registro" className="font-medium text-indigo-600 hover:text-indigo-800">Regístrate aquí</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}