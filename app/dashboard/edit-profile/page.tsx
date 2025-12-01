'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Tipo para el perfil del comerciante
interface MerchantProfile {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  contact: string;
  email: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<MerchantProfile>({
    id: '1',
    name: 'Mi Negocio Ejemplo',
    category: 'Restaurante',
    description: 'Descripción actual de mi negocio. Servimos comida tradicional con ingredientes frescos.',
    address: 'Calle Principal #123, Colonia Centro',
    contact: '1234-5678',
    email: 'comerciante@ejemplo.com'
  });

  // Categorías disponibles
  const categories = [
    'Restaurante',
    'Cafetería',
    'Tienda de Abarrotes',
    'Farmacia',
    'Taller Mecánico',
    'Peluquería',
    'Consultorio Médico',
    'Gimnasio',
    'Escuela',
    'Otros'
  ];

  // Simular carga de datos del perfil (en producción, esto vendría de una API)
  useEffect(() => {
    // Aquí iría la llamada a la API para obtener los datos del perfil
    // Ejemplo: fetchProfileData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular llamada a la API
      console.log('Guardando perfil:', profile);
      
      // Aquí iría la llamada real a tu API
      // await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profile)
      // });

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('✅ Perfil actualizado correctamente! Los cambios son visibles para los vecinos.');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('❌ Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8E0E8] to-[#D4EEF3] text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-serif text-[#1F535D]">Conecta Barrio - Editar Perfil</h1>
        <div>
          <Link 
            href="/dashboard" 
            className="text-[#3498DB] hover:underline mr-4"
          >
            ← Volver al Dashboard
          </Link>
          <Link 
            href="/" 
            className="text-[#3498DB] hover:underline"
          >
            Ver Página Principal
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Encabezado */}
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-[#1F535D] mb-2">
              ✏️ Editar Información del Perfil
            </h2>
            <p className="text-gray-600">
              Actualiza los datos de tu negocio para mantenerlos relevantes para los vecinos.
              Los cambios se reflejarán instantáneamente en tu perfil público.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del Negocio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Negocio *
              </label>
              <Input
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Ej: Restaurante La Tradición"
                required
                className="focus:ring-[#3498DB] focus:border-[#3498DB]"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="category"
                value={profile.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#3498DB] focus:border-[#3498DB] bg-white"
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Negocio *
              </label>
              <textarea
                name="description"
                value={profile.description}
                onChange={handleChange}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#3498DB] focus:border-[#3498DB]"
                placeholder="Describe tus productos, servicios, horarios, especialidades..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Esta descripción será visible para todos los vecinos
              </p>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección Completa *
              </label>
              <Input
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Ej: Calle Principal #123, Colonia, Ciudad"
                required
                className="focus:ring-[#3498DB] focus:border-[#3498DB]"
              />
            </div>

            {/* Teléfono de Contacto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de Contacto *
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-gray-500">📱</span>
                <Input
                  name="contact"
                  value={profile.contact}
                  onChange={handleChange}
                  placeholder="1234-5678"
                  pattern="[0-9]{4}-[0-9]{4}"
                  required
                  className="flex-1 focus:ring-[#3498DB] focus:border-[#3498DB]"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Formato: 1234-5678
              </p>
            </div>

            {/* Email (solo lectura probablemente) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Contacto
              </label>
              <Input
                name="email"
                value={profile.email}
                onChange={handleChange}
                type="email"
                className="focus:ring-[#3498DB] focus:border-[#3498DB] bg-gray-50"
                readOnly
              />
              <p className="text-sm text-gray-500 mt-1">
                Para cambiar el email, contacta al administrador
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#3498DB] hover:bg-[#2980B9] text-white px-8 py-3"
              >
                {isLoading ? 'Guardando...' : '💾 Guardar Cambios'}
              </Button>
              
              <Button
                type="button"
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="border-[#3498DB] text-[#3498DB] hover:bg-[#E0F7FA] px-8 py-3"
              >
                Cancelar
              </Button>
            </div>
          </form>

          {/* Vista Previa */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-serif text-[#1F535D] mb-4">
              👁️ Vista Previa de tu Perfil
            </h3>
            <div className="bg-[#F0F8FF] rounded-lg p-6 border border-[#B8E0E8]">
              <h4 className="text-2xl font-serif text-[#2980B9] mb-2">{profile.name}</h4>
              <p className="text-gray-600 mb-1">
                <strong>Categoría:</strong> {profile.category}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>📞 Contacto:</strong> {profile.contact}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>📍 Dirección:</strong> {profile.address}
              </p>
              <p className="text-gray-600 mb-3">
                <strong>📧 Email:</strong> {profile.email}
              </p>
              <p className="text-gray-700">
                <strong>Descripción:</strong> {profile.description}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-3 italic">
              Así es como verán los vecinos tu perfil después de guardar los cambios
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 text-gray-600 mt-10">
        © {new Date().getFullYear()} Conecta Barrio. Todos los derechos reservados.
      </footer>
    </div>
  );
}