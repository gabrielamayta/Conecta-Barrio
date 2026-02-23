'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUserId, isAuthenticated, getUserFromLocalStorage } from '@/lib/session';
// --- IMPORTACIÓN NUEVA ---
import SeccionGaleria from "@/components/SeccionGaleria"; 

interface ProfileFormData {
  userId: string;
  profileType: 'comerciante' | 'profesional';
  categoria: string;
  descripcion: string;
  telefono: string;
  instagram?: string;
  logoUrl?: string;
  nombreNegocio?: string;
  direccion?: string;
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
  
  // --- ESTADO PARA NOTIFICACIONES PERSONALIZADAS ---
  const [notificacion, setNotificacion] = useState<string | null>(null);

  // --- ESTADOS NUEVOS PARA LA GALERÍA ---
  const [profileId, setProfileId] = useState<string | null>(null);
  const [imagenesExistentes, setImagenesExistentes] = useState<any[]>([]);

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

  const categories = ['Restaurante', 'Cafetería', 'Tienda de Abarrotes', 'Farmacia', 'Supermercado', 'Panadería', 'Carnicería', 'Verdulería', 'Taller Mecánico', 'Peluquería', 'Estética', 'Ferretería', 'Librería', 'Ropa', 'Calzado', 'Electrodomésticos', 'Tecnología', 'Mueblería', 'Florería', 'Juguetería', 'Deportes', 'Mascotas', 'Fotografía', 'Imprenta', 'Otros'];

  useEffect(() => {
    checkAuthentication();
  }, []);

  // Función para mostrar mensajes que se auto-eliminan
  const mostrarMensaje = (msj: string) => {
    setNotificacion(msj);
    setTimeout(() => setNotificacion(null), 3000);
  };

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
      loadProfile(currentUserId);
    }
    if (user?.role) {
      setUserRole(user.role);
      const profileType = user.role === 'COMERCIANTE' ? 'comerciante' : 'profesional';
      setFormData(prev => ({ ...prev, profileType }));
    }
    if (user?.email) setUserEmail(user.email);
  };

  const loadProfile = async (userId: string) => {
    try {
      setIsLoadingProfile(true);
      const response = await fetch(`/api/profile?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        
        if (data.comercianteProfile) {
          const profile = data.comercianteProfile;
          setProfileId(profile.id);
          setImagenesExistentes(profile.imagenes || []);
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
          setProfileId(profile.id);
          setImagenesExistentes(profile.imagenes || []);
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) { router.push('/login'); return; }

    setIsLoading(true);
    try {
      const requestData = {
        userId: formData.userId,
        profileType: formData.profileType,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        telefono: formData.telefono,
        instagram: formData.instagram || undefined,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        // --- AQUÍ CAMBIAMOS EL ALERT POR LA NOTIFICACIÓN ---
        mostrarMensaje("✅ Perfil guardado correctamente");
        router.refresh(); 
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      mostrarMensaje("❌ Error al guardar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSpecificFields = () => {
    if (formData.profileType === 'comerciante') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Negocio *</label>
            <Input name="nombreNegocio" value={formData.nombreNegocio || ''} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección del Local *</label>
            <Input name="direccion" value={formData.direccion || ''} onChange={handleChange} required />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Servicio *</label>
            <Input name="nombreServicio" value={formData.nombreServicio || ''} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia *</label>
            <textarea name="experiencia" value={formData.experiencia || ''} onChange={handleChange} rows={3} className="w-full p-3 border rounded-md" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zona Cobertura *</label>
                <Input name="zonaCobertura" value={formData.zonaCobertura || ''} onChange={handleChange} required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidad *</label>
                <Input name="disponibilidad" value={formData.disponibilidad || ''} onChange={handleChange} required />
            </div>
          </div>
        </>
      );
    }
  };

  if (isLoadingProfile) return <div className="text-center p-20">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8E0E8] to-[#D4EEF3] text-gray-800 relative">
      
      {/* --- COMPONENTE VISUAL DE NOTIFICACIÓN --- */}
      {notificacion && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-[100] animate-in fade-in slide-in-from-top-4 duration-300 font-medium">
          {notificacion}
        </div>
      )}

      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-[#3498DB] hover:underline">← Volver</Link>
        <h1 className="text-xl font-bold text-[#1F535D]">Conecta Barrio</h1>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderSpecificFields()}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full p-3 border rounded-md bg-white">
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4} className="w-full p-3 border rounded-md" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono 1234-5678" required />
                <Input name="instagram" value={formData.instagram || ''} onChange={handleChange} placeholder="Instagram @usuario" />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-[#3498DB] hover:bg-[#2980B9]">
              {isLoading ? "Guardando..." : "💾 Guardar Perfil"}
            </Button>
          </form>

          {profileId && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-[#1F535D] mb-4">📸 Galería de Trabajos</h3>
              <SeccionGaleria 
                profileId={profileId} 
                type={formData.profileType === 'comerciante' ? 'comercio' : 'profesional'} 
                imagenesIniciales={imagenesExistentes} 
              />
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-[#1F535D] mb-4">👁️ Vista Previa Pública</h3>
            <div className="bg-[#F0F8FF] rounded-lg p-6 border border-[#B8E0E8]">
                <h4 className="text-2xl font-bold text-[#2980B9]">{formData.nombreNegocio || formData.nombreServicio || 'Tu Nombre'}</h4>
                <p className="mt-2 text-gray-600">{formData.descripcion || 'Sin descripción aún...'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}