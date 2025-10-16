
"use client"

import type React from "react"
import { useState } from "react"
// ... (resto de tus importaciones)
import { useRouter } from 'next/navigation'; // 🛑 NECESARIO PARA REDIRECCIÓN
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input" 
// ...

export default function LoginPage() {
  const router = useRouter(); // Inicializar router
  
  const [formData, setFormData] = useState({
    email: "",
    contrasena: "", // 🛑 CAMBIAR a 'password' para consistencia con el backend
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Para Criterio 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        // Llamar a la nueva API de Login
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 🛑 Asegúrate de que las claves coincidan con el backend: email y password
            body: JSON.stringify({
                email: formData.email,
                password: formData.contrasena, // Usamos contrasena por tu estado, pero el BE usa 'password'
            }), 
        });

        const data = await response.json();

        if (response.ok) {
            // Criterio 2: Login Exitoso. Redirección usando la ruta del backend.
            router.push(data.redirectPath || '/');
            
        } else {
            // Criterio 3: Credenciales Incorrectas o error del servidor
            // El backend devuelve el mensaje, o usamos un fallback
            setError(data.message || 'Email o contraseña incorrectos.'); 
        }

    } catch (err) {
        console.error('Error de red/servidor:', err);
        setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
    } finally {
        setLoading(false);
    }
  };

  // ... (resto del JSX)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8E0E8] to-[#D4EEF3]">
      {/* ... */}
      <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* ... */}
            
            {/* 🛑 Mostrar Mensaje de Error (Criterio 3) */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ... */}

              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white font-serif text-lg py-6"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Iniciar Sesión'}
              </Button>
            </form>
            {/* ... */}
          </div>
        </div>
      </main>

      {/* ... */}
    </div>
  )
}