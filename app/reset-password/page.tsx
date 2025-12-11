'use client'; 
export const dynamic = "force-dynamic";

import ResetPasswordForm from '@/components/ResetPasswordForm';
import { useSearchParams } from 'next/navigation'; // Importa el hook para el cliente

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  // Obtener el token de la URL de forma segura para el cliente
  const token = searchParams.get('token'); 

  if (!token) {
    return (
      <div className="text-center p-10">
        <h1 className="text-xl font-bold">Error de Token</h1>
        <p>El enlace de restablecimiento es inválido o no existe. Por favor, solicita uno nuevo.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Nueva Contraseña
        </h2>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
