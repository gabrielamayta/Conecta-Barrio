// app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUserId, isAuthenticated, getUserFromLocalStorage } from '@/lib/session';

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [hasProfile, setHasProfile] = useState(false);
  const [profileType, setProfileType] = useState<'comerciante' | 'profesional' | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (userId) {
      loadProfileStatus();
    }
  }, [userId]);

  const checkAuthentication = () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      setUserId(currentUserId);
    }
    
    const user = getUserFromLocalStorage();
    if (user?.role) {
      setUserRole(user.role);
    }
  };

  const loadProfileStatus = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/profile?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setHasProfile(data.hasProfile);
        
        if (data.comercianteProfile) {
          setProfileType('comerciante');
          setProfileData(data.comercianteProfile);
        } else if (data.profesionalProfile) {
          setProfileType('profesional');
          setProfileData(data.profesionalProfile);
        }
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleEditProfile = () => {
    if (!userId) {
      alert('Por favor, inicia sesión primero');
      router.push('/login');
      return;
    }
    router.push('/dashboard/edit-profile');
  };

  const handleViewPublicProfile = () => {
    if (profileData) {
      router.push(`/perfil/${profileData.id}`);
    } else {
      alert('Primero debes crear tu perfil');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8E0E8] to-[#D4EEF3] text-gray-800 font-sans">
      
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-serif text-[#1F535D]">Conecta Barrio - Dashboard</h1>
        <div>
          <Link href="/" className="text-[#3498DB] hover:underline mr-4">
            Volver a Inicio
          </Link>
          <Button 
            variant="outline" 
            className="text-[#3498DB] border-[#3498DB] hover:bg-[#E0F7FA]"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-4xl font-serif text-center text-[#1F535D] mb-10">
          Bienvenido, {userRole === 'COMERCIANTE' ? 'Comerciante' : 'Profesional'}
        </h2>

        {/* Sección única: Gestión de Perfil y Galería */}
        <section className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-[#3498DB]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-serif text-[#2980B9]">
              Mi Perfil {userRole === 'COMERCIANTE' ? 'Comerciante' : 'Profesional'}
            </h3>
            
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${hasProfile ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {hasProfile ? 'PERFIL ACTIVO' : 'PERFIL PENDIENTE'}
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 mb-4">
                Desde acá podés gestionar toda tu información pública, incluyendo tu Galería de Fotos, datos de contacto y la descripción de tu {userRole === 'COMERCIANTE' ? 'negocio' : 'servicio'}.
              </p>
              
              <div className="bg-[#F0F8FF] rounded-md p-4 mb-6 border border-[#B8E0E8]">
                <h4 className="font-semibold text-[#1F535D] mb-2 text-sm uppercase tracking-wider">📋 Lo que verán los vecinos:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-center">✅ Nombre y Categoría</li>
                  <li className="flex items-center">✅ Tu Galería de Imágenes</li>
                  <li className="flex items-center">✅ Teléfono y Redes Sociales</li>
                  <li className="flex items-center">✅ Ubicación y Horarios</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <Button 
                onClick={handleEditProfile}
                className="bg-[#3498DB] hover:bg-[#2980B9] text-white py-6 text-lg shadow-md transition-all hover:shadow-lg"
                disabled={!userId}
              >
                {hasProfile ? '✏️ Editar Perfil y Galería' : '📝 Crear mi Perfil ahora'}
              </Button>
              
              <Button 
                variant="outline" 
                className="border-[#3498DB] text-[#3498DB] hover:bg-[#E0F7FA] py-6"
                onClick={handleViewPublicProfile}
                disabled={!hasProfile}
              >
                📊 Ver mi Perfil Público
              </Button>
            </div>
          </div>

          {/* Vista previa rápida si hay datos */}
          {profileData && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h4 className="font-bold text-[#1F535D]">{profileData.nombreNegocio || profileData.nombreServicio}</h4>
                  <p className="text-sm text-gray-500">{profileData.categoria} • {profileData.telefono}</p>
                </div>
                {profileData.aprobado !== undefined && (
                  <p className={`text-xs font-medium ${profileData.aprobado ? 'text-green-600' : 'text-amber-600'}`}>
                    {profileData.aprobado ? '● Perfil Aprobado' : '● Pendiente de revisión'}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="text-center p-4 text-gray-600 mt-10">
        © {new Date().getFullYear()} Conecta Barrio. Todos los derechos reservados.
      </footer>
    </div>
  );
}