'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import Link from 'next/link';

// Simulación de un tipo de producto/servicio
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.description && newProduct.price && newProduct.imageUrl) {
      setProducts(prev => [...prev, { ...newProduct, id: Date.now() }]);
      setNewProduct({ name: '', description: '', price: '', imageUrl: '' });
      setIsAddingProduct(false);
    } else {
      alert('Por favor, rellena todos los campos del producto.');
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
          >
            Cerrar Sesión
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-serif text-center text-[#1F535D] mb-10">
          Bienvenido a tu Panel de Control, Comerciante/Profesional
        </h2>

        {/* Sección de Gestión de Productos/Servicios */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-serif text-[#2980B9]">Tus Productos o Servicios</h3>
            <Button 
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="bg-[#3498DB] hover:bg-[#2980B9] text-white"
            >
              {isAddingProduct ? 'Cancelar' : 'Añadir Nuevo Producto'}
            </Button>
          </div>

          {isAddingProduct && (
            <form onSubmit={handleAddProduct} className="space-y-4 p-4 bg-[#F0F8FF] rounded-md mb-6 border border-[#B8E0E8]">
              <h4 className="text-xl font-serif text-[#2980B9]">Formulario de Nuevo Producto</h4>
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <Input 
                  id="productName"
                  name="name" 
                  value={newProduct.name} 
                  onChange={handleNewProductChange} 
                  placeholder="Nombre del Producto/Servicio" 
                  required 
                  className="focus:ring-[#3498DB] focus:border-[#3498DB]"
                />
              </div>
              <div>
                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  id="productDescription"
                  name="description" 
                  value={newProduct.description} 
                  onChange={handleNewProductChange} 
                  placeholder="Una breve descripción..." 
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3498DB] focus:border-[#3498DB]"
                  required
                />
              </div>
              <div>
                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <Input 
                  id="productPrice"
                  name="price" 
                  value={newProduct.price} 
                  onChange={handleNewProductChange} 
                  placeholder="$XX.XX" 
                  required 
                  className="focus:ring-[#3498DB] focus:border-[#3498DB]"
                />
              </div>
              <div>
                <label htmlFor="productImage" className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                <Input 
                  id="productImage"
                  name="imageUrl" 
                  value={newProduct.imageUrl} 
                  onChange={handleNewProductChange} 
                  placeholder="https://ejemplo.com/imagen.jpg" 
                  required 
                  className="focus:ring-[#3498DB] focus:border-[#3498DB]"
                />
              </div>
              <Button type="submit" className="w-full bg-[#3498DB] hover:bg-[#2980B9] text-white">
                Guardar Producto
              </Button>
            </form>
          )}

          {products.length === 0 ? (
            <p className="text-center text-gray-500 italic mt-4">Aún no tienes productos o servicios registrados.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {products.map(product => (
                <div key={product.id} className="bg-[#F0F8FF] rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 border border-[#B8E0E8]">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover"/>
                  <div className="p-4">
                    <h4 className="text-xl font-serif text-[#2980B9] mb-2">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <p className="text-lg font-bold text-[#1F535D]">{product.price}</p>
                    <div className="mt-4 flex space-x-2">
                        <Button variant="outline" className="flex-1 border-[#3498DB] text-[#3498DB] hover:bg-[#E0F7FA]">Editar</Button>
                        <Button variant="destructive" className="flex-1 bg-red-500 hover:bg-red-600">Eliminar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sección de Gestión de Perfil - ACTUALIZADA */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-serif text-[#2980B9] mb-6">Gestionar Perfil</h3>
          <p className="text-gray-700 mb-4">
            Administra la información pública de tu negocio que ven los vecinos en el directorio.
          </p>
          <div className="bg-[#F0F8FF] rounded-md p-4 mb-6 border border-[#B8E0E8]">
            <h4 className="font-semibold text-[#1F535D] mb-2">📋 Información que puedes editar:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
              <li>Nombre del negocio</li>
              <li>Categoría y tipo de negocio</li>
              <li>Descripción detallada de servicios</li>
              <li>Dirección y ubicación exacta</li>
              <li>Teléfono de contacto actualizado</li>
              <li>Horarios de atención</li>
            </ul>
          </div>
          
          <div className="flex gap-4">
            <Link href="/dashboard/edit-profile">
              <Button className="bg-[#3498DB] hover:bg-[#2980B9] text-white px-6">
                ✏️ Editar Perfil
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="border-[#3498DB] text-[#3498DB] hover:bg-[#E0F7FA]"
            >
              📊 Ver Perfil Público
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 text-gray-600 mt-10">
        © {new Date().getFullYear()} Conecta Barrio. Todos los derechos reservados.
      </footer>
    </div>
  );
}