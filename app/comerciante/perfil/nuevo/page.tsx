"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Función para generar usuario aleatorio
function generarUsuarioAleatorio(nombreNegocio: string): string {
  const base = nombreNegocio.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10);
  const random = Math.random().toString(36).substring(2, 6);
  return `${base}${random}`;
}

// Categorías predefinidas
const CATEGORIAS = [
  "Manicurista",
  "Peluquería",
  "Barbería",
  "Restaurante",
  "Cafetería",
  "Kiosko",
  "Reposteria",
  "Carnicería",
  "Panadería",
  "Lavandería",
  "Electricista",
  "Plomería",
  "Carpintería",
  "Jardinería",
  "Molderia",
  "Indumentaria",
  "Servicio Tecnico",
  "Maquillaje",
  "Pasteleria",
  "Otros"
];

export default function NuevoPerfilComerciantePage() {
  const router = useRouter();
  const [usuarioGenerado, setUsuarioGenerado] = useState('');

  const [formData, setFormData] = useState({
    nombreNegocio: '',
    categoria: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Generar usuario cuando cambie el nombre del negocio
  useEffect(() => {
    if (formData.nombreNegocio) {
      const usuario = generarUsuarioAleatorio(formData.nombreNegocio);
      setUsuarioGenerado(usuario);
    }
  }, [formData.nombreNegocio]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones
    const { nombreNegocio, categoria, descripcion, direccion, telefono, password, confirmPassword } = formData;

    if (!nombreNegocio || !categoria || !descripcion || !direccion || !telefono || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/comerciante/perfil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          usuario: usuarioGenerado
        }),
      });

      if (response.ok) {
        router.push('/login?message=Perfil creado exitosamente. Ahora puedes iniciar sesión.');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al crear el perfil');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '50px auto', 
      padding: '30px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px' }}>
        Crear Perfil de Comerciante
      </h1>

      {error && (
        <div style={{ 
          color: 'white', 
          backgroundColor: '#dc3545', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
        
        {/* Nombre del Negocio */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nombre del Negocio/Marca *
          </label>
          <input
            type="text"
            name="nombreNegocio"
            placeholder="Ej: Nails Valen"
            value={formData.nombreNegocio}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Usuario Generado */}
        {usuarioGenerado && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Tu usuario (generado automáticamente):
            </label>
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#e9ecef', 
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontWeight: 'bold',
              color: '#495057'
            }}>
              {usuarioGenerado}
            </div>
            <small style={{ color: '#6c757d' }}>
              Este es tu nombre de usuario para iniciar sesión
            </small>
          </div>
        )}

        {/* Categoría */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Tipo de Servicio/Categoría *
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }}
          >
            <option value="">Selecciona una categoría</option>
            {CATEGORIAS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Descripción del Negocio *
          </label>
          <textarea
            name="descripcion"
            placeholder="Describe tu negocio o servicio..."
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows={4}
            style={{ 
              width: '100%',
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Dirección */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Dirección *
          </label>
          <input
            type="text"
            name="direccion"
            placeholder="Dirección completa de tu negocio"
            value={formData.direccion}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Teléfono */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Teléfono de Contacto *
          </label>
          <input
            type="tel"
            name="telefono"
            placeholder="Ej: +34 123 456 789"
            value={formData.telefono}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Contraseña */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Contraseña *
          </label>
          <input
            type="password"
            name="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repite tu contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Botón de Guardar */}
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%',
            padding: '12px', 
            backgroundColor: loading ? '#6c757d' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Creando Perfil...' : 'Guardar Perfil'}
        </button>
      </form>
    </div>
  );
}