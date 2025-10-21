'use client'; // Necesario para usar useState y otros hooks

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import Link from 'next/link'; // Para enlaces de navegación

// Simulación de un tipo de producto/servicio
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]); // Estado para manejar productos
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const [isAddingProduct, setIsAddingProduct] = useState(false); // Para mostrar/ocultar el formulario

  // Función para manejar el cambio en los inputs del nuevo producto
  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  // Función para añadir un nuevo producto (simulado)
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.description && newProduct.price && newProduct.imageUrl) {
      setProducts(prev => [...prev, { ...newProduct, id: Date.now() }]);
      setNewProduct({ name: '', description: '', price: '', imageUrl: '' });
      setIsAddingProduct(false); // Ocultar formulario después de añadir
    } else {
      alert('Por favor, rellena todos los campos del producto.');
    }
  };

  return (
    // CAMBIO DE COLOR PRINCIPAL DEL FONDO
    <div className="min-h-screen bg-gradient-to-b from-[#B8E0E8] to-[#D4EEF3] text-gray-800 font-sans">
      
      {/* Navbar o Header simple (puedes reemplazarlo con tu componente Header) */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-serif text-[#1F535D]">Conecta Barrio - Dashboard</h1> {/* Ajuste de color */}
        <div>
          <Link href="/" className="text-[#3498DB] hover:underline mr-4"> {/* Ajuste de color */}
            Volver a Inicio
          </Link>
          <Button 
            variant="outline" 
            className="text-[#3498DB] border-[#3498DB] hover:bg-[#E0F7FA]" // Ajuste de color
          >
            Cerrar Sesión
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-serif text-center text-[#1F535D] mb-10"> {/* Ajuste de color */}
          Bienvenido a tu Panel de Control, Comerciante/Profesional
        </h2>

        {/* Sección de Gestión de Productos/Servicios */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-serif text-[#2980B9]">Tus Productos o Servicios</h3> {/* Ajuste de color */}
            <Button 
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="bg-[#3498DB] hover:bg-[#2980B9] text-white" // Ajuste de color
            >
              {isAddingProduct ? 'Cancelar' : 'Añadir Nuevo Producto'}
            </Button>
          </div>

          {isAddingProduct && (
            <form onSubmit={handleAddProduct} className="space-y-4 p-4 bg-[#F0F8FF] rounded-md mb-6 border border-[#B8E0E8]"> {/* Fondo y borde más suaves */}
              <h4 className="text-xl font-serif text-[#2980B9]">Formulario de Nuevo Producto</h4> {/* Ajuste de color */}
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <Input 
                  id="productName"
                  name="name" 
                  value={newProduct.name} 
                  onChange={handleNewProductChange} 
                  placeholder="Nombre del Producto/Servicio" 
                  required 
                  className="focus:ring-[#3498DB] focus:border-[#3498DB]" // Ajuste de focus color
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3498DB] focus:border-[#3498DB]" // Ajuste de focus color
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
                  className="focus:ring-[#3498DB] focus:border-[#3498DB]" // Ajuste de focus color
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
                  className="focus:ring-[#3498DB] focus:border-[#3498DB]" // Ajuste de focus color
                />
              </div>
              <Button type="submit" className="w-full bg-[#3498DB] hover:bg-[#2980B9] text-white"> {/* Ajuste de color */}
                Guardar Producto
              </Button>
            </form>
          )}

          {products.length === 0 ? (
            <p className="text-center text-gray-500 italic mt-4">Aún no tienes productos o servicios registrados.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {products.map(product => (
                <div key={product.id} className="bg-[#F0F8FF] rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 border border-[#B8E0E8]"> {/* Fondo y borde más suaves */}
                  <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover"/>
                  <div className="p-4">
                    <h4 className="text-xl font-serif text-[#2980B9] mb-2">{product.name}</h4> {/* Ajuste de color */}
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <p className="text-lg font-bold text-[#1F535D]">{product.price}</p> {/* Ajuste de color */}
                    <div className="mt-4 flex space-x-2">
                        <Button variant="outline" className="flex-1 border-[#3498DB] text-[#3498DB] hover:bg-[#E0F7FA]">Editar</Button> {/* Ajuste de color */}
                        <Button variant="destructive" className="flex-1 bg-red-500 hover:bg-red-600">Eliminar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sección de Gestión de Perfil (Opcional) */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-serif text-[#2980B9] mb-6">Gestionar Perfil</h3> {/* Ajuste de color */}
          <p className="text-gray-700">Aquí podrás editar la información de tu negocio, horarios, contacto, etc.</p>
          <Button className="mt-4 bg-[#3498DB] hover:bg-[#2980B9] text-white">Editar Perfil</Button> {/* Ajuste de color */}
        </section>
      </main>

      {/* Footer simple */}
      <footer className="text-center p-4 text-gray-600 mt-10">
        © {new Date().getFullYear()} Conecta Barrio. Todos los derechos reservados.
      </footer>
    </div>
  );
}