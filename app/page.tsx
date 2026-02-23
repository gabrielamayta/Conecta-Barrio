import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BusinessCard } from "@/components/business-card"
import { Header } from "@/components/header"
import { prisma } from "@/lib/prisma"

async function getTodosLosNegocios() {
  try {
    // 1. Obtener comerciantes y profesionales aprobados
    const [comerciantes, profesionales] = await Promise.all([
      prisma.comercianteProfile.findMany({
        where: { aprobado: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.profesionalProfile.findMany({
        where: { aprobado: true },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // 2. Formatear comerciantes
    const comerciantesFormateados = comerciantes.map((c) => ({
      id: c.id, // Usamos el ID real de la DB para que el link funcione
      nombre: c.nombreNegocio,
      descripcion: c.descripcion,
      telefono: c.telefono,
      instagram: c.usuario || "",
      logo: c.logoUrl || "/default-business.png",
      tipo: c.categoria,
      esNuevo: true,
      esServicio: false,
      nombreNegocio: c.nombreNegocio,
      categoria: c.categoria,
      logoUrl: c.logoUrl
    }));

    // 3. Formatear profesionales
    const profesionalesFormateados = profesionales.map((p) => ({
      id: p.id, // Usamos el ID real de la DB
      nombre: p.nombreServicio,
      descripcion: p.descripcion,
      telefono: p.telefono,
      instagram: p.usuario || "",
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
            <li><Link href="/" className="font-serif text-lg text-gray-800 hover:text-gray-900 transition-colors">Inicio</Link></li>
            <li><Link href="/registro" className="font-serif text-lg text-gray-800 hover:text-gray-900 transition-colors">Registrarse</Link></li>
            <li><Link href="/login" className="font-serif text-lg text-gray-800 hover:text-gray-900 transition-colors">Ingresar</Link></li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-serif text-center mb-8 text-gray-800">
          Comercios y Servicios del Barrio
        </h2>
        
        {negociosRegistrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Aún no hay registros. ¡Sé el primero en registrarte!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {negociosRegistrados.map((negocio) => (
              <div key={negocio.id} className="relative">
                {/* @ts-ignore - Evita errores de tipos si el objeto es complejo */}
                <BusinessCard negocio={negocio} />
                
                {negocio.esNuevo && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                    NUEVO
                  </div>
                )}
                
                {negocio.esServicio && (
                  <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                    SERVICIO
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 text-center bg-white/50 rounded-2xl p-8 border border-[#7AB8C4] max-w-2xl mx-auto">
          <h3 className="text-2xl font-serif mb-4 text-gray-800">
            ¿Tienes un comercio u ofreces servicios?
          </h3>
          <p className="text-gray-600 mb-6">
            Únete a nuestra comunidad y aparece automáticamente aquí.
          </p>
          <Link href="/registro">
            <Button size="lg" className="bg-[#28a745] hover:bg-[#218838] text-white font-serif text-lg px-8 py-6 rounded-xl">
              Únete a la comunidad
            </Button>
          </Link>
        </div>
      </main>

      <footer className="text-center py-10 text-gray-500 font-serif border-t border-[#7AB8C4]/30">
        © 2026 Conecta Barrio
      </footer>
    </div>
  )
}