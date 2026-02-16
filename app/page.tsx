import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BusinessCard } from "@/components/business-card"
import { Header } from "@/components/header"
import { prisma } from "@/lib/prisma"

async function getTodosLosNegocios() {
  try {
    const comerciantes = await prisma.comercianteProfile.findMany({
      where: { aprobado: true },
      orderBy: { createdAt: 'desc' }
    });

    const profesionales = await prisma.profesionalProfile.findMany({
      where: { aprobado: true },
      orderBy: { createdAt: 'desc' }
    });

    const comerciantesFormateados = comerciantes.map((c, i) => ({
      id: 1000 + i,
      nombre: c.nombreNegocio,
      descripcion: c.descripcion,
      telefono: c.telefono,
      instagram: c.usuario,
      logo: c.logoUrl || "/default-business.png",
      tipo: c.categoria,
      esNuevo: true,
      esServicio: false,
      nombreNegocio: c.nombreNegocio,
      categoria: c.categoria,
      logoUrl: c.logoUrl
    }));

    const profesionalesFormateados = profesionales.map((p, i) => ({
      id: 2000 + i,
      nombre: p.nombreServicio,
      descripcion: p.descripcion,
      telefono: p.telefono,
      instagram: p.usuario,
      logo: p.logoUrl || "/default-service.png",
      tipo: p.categoria,
      esNuevo: true,
      esServicio: true,
      nombreNegocio: p.nombreServicio,
      categoria: p.categoria,
      logoUrl: p.logoUrl
    }));

    return [...comerciantesFormateados, ...profesionalesFormateados];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export default async function HomePage() {
  const negociosRegistrados = await getTodosLosNegocios();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8E0E8] to-[#D4EEF3]">
      <Header />
      <nav className="bg-[#8FCDD6] border-b border-[#7AB8C4]">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 py-4">
            <li><Link href="/" className="font-serif text-lg text-gray-800 hover:text-gray-900">Inicio</Link></li>
            <li><Link href="/registro" className="font-serif text-lg text-gray-800 hover:text-gray-900">Registrarse</Link></li>
            <li><Link href="/login" className="font-serif text-lg text-gray-800 hover:text-gray-900">Ingresar</Link></li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-serif text-center mb-8 text-gray-800">Comercios y Servicios del Barrio</h2>
        
        {negociosRegistrados.length === 0 ? (
          <div className="text-center py-12 text-gray-600">Aún no hay registros. ¡Sé el primero en registrarte!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {negociosRegistrados.map((negocio) => (
              <div key={negocio.id} className="relative">
                <BusinessCard negocio={negocio} />
                {negocio.esNuevo && <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">NUEVO</div>}
                {negocio.esServicio && <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">SERVICIO</div>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}