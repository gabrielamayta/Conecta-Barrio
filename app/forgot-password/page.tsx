'use client'; 

import { useState, FormEvent } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Se ha enviado un correo electrónico con instrucciones si tu cuenta existe.');
        setEmail('');
      } else {
        setError(data.message || 'Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error de conexión o servidor:', err);
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-serif font-bold text-center text-gray-900">
          ¿Olvidaste tu Contraseña?
        </h2>
        <p className="text-center text-gray-600">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu acceso.
        </p>

        {message && (
          <div className="p-3 text-sm font-medium text-green-700 bg-green-100 border border-green-400 rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 text-sm font-medium text-red-700 bg-red-100 border border-red-400 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@dominio.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition duration-150"
            >
              {isLoading ? 'Enviando Solicitud...' : 'Solicitar Restablecimiento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}