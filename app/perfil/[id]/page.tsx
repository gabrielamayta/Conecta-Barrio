import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function PerfilPublico({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Buscamos en ambas tablas
    let perfil = await prisma.comercianteProfile.findUnique({
      where: { id },
      include: { imagenes: true }
    }) as any;

    if (!perfil) {
      perfil = await prisma.profesionalProfile.findUnique({
        where: { id },
        include: { imagenes: true }
      });
    }

    // Si después de buscar en los dos lados no hay nada
    if (!perfil) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Perfil no encontrado</h1>
          <p className="text-gray-500">El ID {id} no existe en nuestra base de datos.</p>
          <Link href="/" className="mt-4 text-blue-500 underline">Volver al inicio</Link>
        </div>
      );
    }

    const nombre = perfil.nombreNegocio || perfil.nombreServicio;
    const whatsappLink = `https://wa.me/${perfil.telefono.replace(/[^0-9]/g, '')}`;

    return (
      <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
        {/* Nav minimalista */}
        <nav className="p-6">
          <Link href="/" className="text-gray-400 hover:text-black transition-colors text-sm font-bold uppercase tracking-widest">
            ← Volver a Conecta Barrio
          </Link>
        </nav>

        <main className="max-w-4xl mx-auto px-6 pb-24">
          
          {/* 1. CABECERA CENTRADA */}
          <header className="flex flex-col items-center text-center mb-16">
            <h1 className="text-2xl md:text-4xl font-serif font-black italic uppercase tracking-tighter text-black leading-none mb-6">
              {nombre}
            </h1>
            <span className="bg-black text-white px-6 py-1 text-xs font-bold uppercase tracking-[0.3em]">
              {perfil.categoria}
            </span>
          </header>

          {/* 2. DESCRIPCIÓN Y CONTACTO (Tamaños equilibrados) */}
<div className="flex flex-col items-center text-center space-y-6 mb-16">
  {/* Descripción más tranqui */}
  <p className="text-gray-500 max-w-lg text-sm md:text-base leading-relaxed italic font-serif">
    "{perfil.descripcion}"
  </p>
  
  {/* Datos de contacto más discretos */}
  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] md:text-[11px] uppercase font-bold tracking-[0.2em] text-gray-400">
    <p className="flex items-center gap-1.5">
      📍 {perfil.direccion || perfil.zonaCobertura || 'Sin dirección'}
    </p>
    <p className="flex items-center gap-1.5">
      📞 {perfil.telefono}
    </p>
    {perfil.instagram && (
      <p className="flex items-center gap-1.5">
        📸 @{perfil.instagram}
      </p>
    )}
  </div>

  {/* Botón de WhatsApp más elegante y menos invasivo */}
  <a 
    href={whatsappLink}
    target="_blank"
    className="inline-block bg-[#00D95F] text-white px-8 py-4 rounded-full text-sm md:text-base font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-105 transition-all active:scale-95"
  >
    Hablar por WhatsApp
  </a>
</div>

          {/* 3. SEPARADOR DE GALERÍA */}
          <div className="relative py-16">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-8 text-black font-black tracking-[0.5em]">Galería</span>
            </div>
          </div>

          {/* 4. GRID DE FOTOS UNIFORME */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {perfil.imagenes?.map((img: any) => (
                <div key={img.id} className="relative aspect-square overflow-hidden bg-gray-50 border border-gray-100 group">
                  <Image 
                    src={img.url} 
                    alt={`Trabajo de ${nombre}`} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>
              ))}
            </div>
            
            {(!perfil.imagenes || perfil.imagenes.length === 0) && (
              <p className="text-center text-gray-400 italic py-10">Este perfil aún no ha subido fotos.</p>
            )}
          </section>

        </main>

        <footer className="py-12 text-center border-t border-gray-50 text-gray-300 text-[10px] uppercase tracking-[0.4em]">
          Conecta Barrio • Buenos Aires 2026
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Error cargando perfil:", error);
    return <div className="p-20 text-center font-serif italic text-gray-400">Hubo un error al conectar con la base de datos.</div>;
  }
}