// app/dashboard/edit-profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUserId, isAuthenticated, getUserFromLocalStorage } from '@/lib/session';

interface ProfileFormData {
  userId: string;
  profileType: 'comerciante' | 'profesional';
  categoria: string;
  descripcion: string;
  telefono: string;
  instagram?: string;
  logoUrl?: string;
  
  // Campos específicos de comerciante
  nombreNegocio?: string;
  direccion?: string;
  
  // Campos específicos de profesional
  nombreServicio?: string;
  experiencia?: string;
  zonaCobertura?: string;
  disponibilidad?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [formData, setFormData] = useState<ProfileFormData>({
    userId: '',
    profileType: 'comerciante',
    categoria: 'Restaurante',
    descripcion: '',
    telefono: '',
    nombreNegocio: '',
    direccion: '',
    instagram: ''
  });

  const categories = [
    'Restaurante',
    'Cafetería',
    'Tienda de Abarrotes',
    'Farmacia',
    'Supermercado',
    'Panadería',
    'Carnicería',
    'Verdulería',
    'Taller Mecánico',
    'Peluquería',
    'Estética',
    'Ferretería',
    'Librería',
    'Ropa',
    'Calzado',
    'Electrodomésticos',
    'Tecnología',
    'Mueblería',
    'Florería',
    'Juguetería',
    'Deportes',
    'Mascotas',
    'Fotografía',
    'Imprenta',
    'Otros'
  ];

  // Cargar datos iniciales
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    const currentUserId = getCurrentUserId();
    const user = getUserFromLocalStorage();
    
    if (currentUserId) {
      setUserId(currentUserId);
      setFormData(prev => ({ ...prev, userId: currentUserId }));
    }
    
    if (user?.role) {
      setUserRole(user.role);
      const profileType = user.role === 'COMERCIANTE' ? 'comerciante' : 'profesional';
      setFormData(prev => ({ ...prev, profileType }));
    }
    
    if (user?.email) {
      setUserEmail(user.email);
    }
    
    // Cargar perfil existente
    if (currentUserId) {
      loadProfile(currentUserId);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      setIsLoadingProfile(true);
      
      const response = await fetch(`/api/profile?userId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.comercianteProfile) {
          const profile = data.comercianteProfile;
          setFormData({
            userId,
            profileType: 'comerciante',
            categoria: profile.categoria || '',
            descripcion: profile.descripcion || '',
            telefono: profile.telefono || '',
            instagram: profile.instagram || '',
            nombreNegocio: profile.nombreNegocio || '',
            direccion: profile.direccion || '',
          });
        } else if (data.profesionalProfile) {
          const profile = data.profesionalProfile;
          setFormData({
            userId,
            profileType: 'profesional',
            categoria: profile.categoria || '',
            descripcion: profile.descripcion || '',
            telefono: profile.telefono || '',
            instagram: profile.instagram || '',
            nombreServicio: profile.nombreServicio || '',
            experiencia: profile.experiencia || '',
            zonaCobertura: profile.zonaCobertura || '',
            disponibilidad: profile.disponibilidad || '',
          });
        }
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      alert('Por favor, inicia sesión primero');
      router.push('/login');
      return;
    }

    // Validación básica según tipo de perfil
    if (formData.profileType === 'comerciante') {
      if (!formData.nombreNegocio?.trim() || !formData.telefono.trim() || 
          !formData.direccion?.trim() || !formData.descripcion.trim()) {
        alert('Por favor, completa todos los campos obligatorios (*)');
        return;
      }
    } else {
      if (!formData.nombreServicio?.trim() || !formData.telefono.trim() || 
          !formData.zonaCobertura?.trim() || !formData.descripcion.trim() ||
          !formData.experiencia?.trim() || !formData.disponibilidad?.trim()) {
        alert('Por favor, completa todos los campos obligatorios (*)');
        return;
      }
    }

    // Validar formato de teléfono
    const phoneRegex = /^[0-9]{4}-[0-9]{4}$/;
    if (!phoneRegex.test(formData.telefono)) {
      alert('Formato de teléfono inválido. Use: 1234-5678');
      return;
    }

    setIsLoading(true);

    try {
      // Preparar datos según el tipo de perfil
      const requestData = {
        userId: formData.userId,
        profileType: formData.profileType,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        telefono: formData.telefono,
        instagram: formData.instagram || undefined,
        
        // Campos específicos
        ...(formData.profileType === 'comerciante' ? {
          nombreNegocio: formData.nombreNegocio,
          direccion: formData.direccion
        } : {
          nombreServicio: formData.nombreServicio,
          experiencia: formData.experiencia,
          zonaCobertura: formData.zonaCobertura,
          disponibilidad: formData.disponibilidad
        })
      };

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ ${result.message}\n\n` +
              `Estado: ${result.requiresApproval ? 'Pendiente de aprobación' : 'Aprobado'}`);
        
        // Redirigir al dashboard
        router.push('/dashboard');
      } else {
        alert(`❌ Error: ${result.error || 'No se pudo actualizar el perfil'}`);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('❌ Error de conexión. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSpecificFields = () => {
    if (formData.profileType === 'comerciante') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Negocio *
            </label>
            <Input
              name="nombreNegocio"
              value={formData.nombreNegocio || ''}
              onChange={handleChange}
              placeholder="Ej: Restaurante La Tradición"
              required
              className="focus:ring-[#3498DB] focus:border-[#3498DB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección del Local *
            </label>
            <Input
              name="direccion"
              value={formData.direccion || ''}
              onChange={handleChange}
              placeholder="Ej: Calle Principal #123, Colonia Centro, Ciudad"
              required
              className="focus:ring-[#3498DB] focus:border-[#3498DB]"
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Servicio *
            </label>
            <Input
              name="nombreServicio"
              value={formData.nombreServicio || ''}
              onChange={handleChange}
              placeholder="Ej: Servicio de Plomería"
              required
              className="focus:ring-[#3498DB] focus:border-[#3498DB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experiencia *
            </label>
            <textarea
              name="experiencia"
              value={formData.experiencia || ''}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#3498DB] focus:border-[#3498DB]"
              placeholder="Años de experiencia, especializaciones, formación..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona de Cobertura *
            </label>
            <Input
              name="zonaCobertura"
              value={formData.zonaCobertura || ''}
              onChange={handleChange}
              placeholder="Ej: Norte de la ciudad, Zona Centro"
              required
              className="focus:ring-[#3498DB] focus:border-[#3498DB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disponibilidad *
            </label>
            <Input
              name="disponibilidad"
              value={formData.disponibilidad || ''}
              onChange={handleChange}
              placeholder="Ej: Lunes a Viernes 9am-6pm, Emergencias 24/7"
              required
              className="focus:ring-[#3498DB] focus:border-[#3498DB]"
            />
          </div>
        </>
      );
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#B8E0E8] to-[#D4EEF3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3498DB] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del perfil...</p>
        </div>
      </div>
    );
  }

  const isEditMode = formData.nombreNegocio || formData.nombreServicio;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8E0E8] to-[#D4EEF3] text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link 
            href="/dashboard" 
            className="text-[#3498DB] hover:underline mr-4 flex items-center"
          >
            ← Volver al Dashboard
          </Link>
          <h1 className="text-2xl font-serif text-[#1F535D]">
            Conecta Barrio - {isEditMode ? 'Editar Perfil' : 'Crear Perfil'}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {userRole === 'COMERCIANTE' ? '🏪 Comerciante' : '👨‍💼 Profesional'}
          </span>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Encabezado */}
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-[#1F535D] mb-2">
              {isEditMode ? '✏️ Editar Perfil' : '📝 Crear Perfil'}
            </h2>
            <p className="text-gray-600 mb-3">
              {userRole === 'COMERCIANTE' 
                ? 'Completa la información de tu negocio para que los vecinos puedan encontrarte.'
                : 'Completa la información de tu servicio profesional.'}
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-blue-700 text-sm">
                <strong>Tipo de cuenta:</strong> {userRole === 'COMERCIANTE' ? 'Comerciante' : 'Profesional'}<br/>
                <strong>Email registrado:</strong> {userEmail}<br/>
                <strong>ID de usuario:</strong> {userId?.substring(0, 8)}...
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderSpecificFields()}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#3498DB] focus:border-[#3498DB]"
                placeholder={
                  userRole === 'COMERCIANTE' 
                    ? "Describe tus productos, servicios, horarios, especialidades, historia del negocio..."
                    : "Describe tus servicios, metodología de trabajo, garantías, casos de éxito..."
                }
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Esta descripción será visible para todos los vecinos en tu perfil público
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de Contacto *
                <span className="text-xs text-gray-500 ml-2">(Formato: 1234-5678)</span>
              </label>
              <div className="flex items-center">
                <span className="mr-3 text-gray-500">📱</span>
                <Input
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="1234-5678"
                  pattern="[0-9]{4}-[0-9]{4}"
                  required
                  className="flex-1 focus:ring-[#3498DB] focus:border-[#3498DB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram (opcional)
              </label>
              <div className="flex items-center">
                <span className="mr-3 text-gray-500">📸</span>
                <Input
                  name="instagram"
                  value={formData.instagram || ''}
                  onChange={handleChange}
                  placeholder="@tuusuario"
                  className="flex-1 focus:ring-[#3498DB] focus:border-[#3498DB]"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Añade tu Instagram para que los vecinos puedan seguirte
              </p>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#3498DB] hover:bg-[#2980B9] text-white px-8 py-3"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Guardando...
                  </>
                ) : (
                  `💾 ${isEditMode ? 'Actualizar Perfil' : 'Crear Perfil'}`
                )}
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
              👁️ Vista Previa de tu Perfil Público
            </h3>
            <div className="bg-[#F0F8FF] rounded-lg p-6 border border-[#B8E0E8]">
              {formData.profileType === 'comerciante' ? (
                <>
                  <h4 className="text-2xl font-serif text-[#2980B9] mb-2">
                    {formData.nombreNegocio || 'Nombre del Negocio'}
                  </h4>
                  <p className="text-gray-600 mb-1">
                    <strong>📞 Contacto:</strong> {formData.telefono || 'Sin teléfono'}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>📍 Dirección:</strong> {formData.direccion || 'Sin dirección'}
                  </p>
                </>
              ) : (
                <>
                  <h4 className="text-2xl font-serif text-[#2980B9] mb-2">
                    {formData.nombreServicio || 'Nombre del Servicio'}
                  </h4>
                  <p className="text-gray-600 mb-1">
                    <strong>📞 Contacto:</strong> {formData.telefono || 'Sin teléfono'}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>📍 Zona de cobertura:</strong> {formData.zonaCobertura || 'Sin zona'}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>⏰ Disponibilidad:</strong> {formData.disponibilidad || 'Sin horario'}
                  </p>
                </>
              )}
              
              <p className="text-gray-600 mb-1">
                <strong>Categoría:</strong> {formData.categoria || 'Sin categoría'}
              </p>
              
              {formData.instagram && (
                <p className="text-gray-600 mb-3">
                  <strong>📸 Instagram:</strong> {formData.instagram}
                </p>
              )}
              
              <p className="text-gray-700 mt-3 border-t pt-3">
                <strong>Descripción:</strong><br/>
                {formData.descripcion || 'Sin descripción'}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-3 italic">
              Así verán los vecinos tu perfil. Los cambios pueden tardar hasta 24 horas en ser visibles.
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center p-4 text-gray-600 mt-10">
        <p>© {new Date().getFullYear()} Conecta Barrio. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}