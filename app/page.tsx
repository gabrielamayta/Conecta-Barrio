import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BusinessCard } from "@/components/business-card"
import { Header } from "@/components/header"
import { prisma } from "@/lib/prisma"

// Función para obtener TODOS los negocios y servicios aprobados
async function getTodosLosNegocios() {
  try {
    // Obtener comerciantes aprobados
    const comerciantes = await prisma.comercianteProfile.findMany({
      where: { aprobado: true },
      orderBy: { createdAt: 'desc' }
    });

    // Obtener profesionales aprobados
    const profesionales = await prisma.profesionalProfile.findMany({
      where: { aprobado: true },
      orderBy: { createdAt: 'desc' }
    });

    // Convertir comerciantes - USANDO LOGOS REALES
    const comerciantesFormateados = comerciantes.map((comerciante, index) => ({
      id: 1000 + index,
      nombre: comerciante.nombreNegocio,
      descripcion: comerciante.descripcion,
      telefono: comerciante.telefono,
      instagram: comerciante.usuario,
      logo: comerciante.logoUrl || "/default-business.png", // ✅ USA logoUrl SI EXISTE
      tipo: comerciante.categoria,
      esNuevo: true,
      esServicio: false,
      // ✅ AGREGAR CAMPOS PARA EL NUEVO BUSINESS-CARD
      nombreNegocio: comerciante.nombreNegocio,
      categoria: comerciante.categoria,
      logoUrl: comerciante.logoUrl
    }));

    // Convertir profesionales - USANDO LOGOS REALES
    const profesionalesFormateados = profesionales.map((profesional, index) => ({
      id: 2000 + index,
      nombre: profesional.nombreServicio,
      descripcion: profesional.descripcion,
      telefono: profesional.telefono,
      instagram: profesional.usuario,
      logo: profesional.logoUrl || "/default-service.png", // ✅ USA logoUrl SI EXISTE
      tipo: profesional.categoria,
      esNuevo: true,
      esServicio: true,
      // ✅ AGREGAR CAMPOS PARA EL NUEVO BUSINESS-CARD
      nombreNegocio: profesional.nombreServicio, // Para profesionales usamos nombreServicio
      categoria: profesional.categoria,
      logoUrl: profesional.logoUrl
    }));

    return [...comerciantesFormateados, ...profesionalesFormateados];
    
  } catch (error) {
    console.error('Error obteniendo negocios:', error);
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
            <li>
              <Link href="/" className="font-serif text-lg text-gray-800 hover:text-gray-900 transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/registro" className="font-serif text-lg text-gray-800 hover:text-gray-900 transition-colors">
                Registrarse
              </Link>
            </li>
            <li>
              <Link href="/login" className="font-serif text-lg text-gray-800 hover:text-gray-900 transition-colors">
                Ingresar
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {/* Sección de Comercios y Servicios */}
        <div className="mb-12">
          <h2 className="text-3xl font-serif text-center mb-8 text-gray-800">
            Comercios y Servicios del Barrio
          </h2>
          
          {negociosRegistrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">Aún no hay comercios o servicios registrados.</p>
              <p className="text-gray-500">¡Sé el primero en registrarte!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {negociosRegistrados.map((negocio) => (
                <div key={negocio.id} className="relative">
                  <BusinessCard negocio={negocio} />
                  
                  {/* Etiqueta "NUEVO" */}
                  {negocio.esNuevo && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      NUEVO
                    </div>
                  )}
                  
                  {/* Etiqueta "SERVICIO" para profesionales - AHORA SEGURO QUE EXISTE */}
                  {negocio.esServicio && (
                    <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      SERVICIO
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Llamado a la acción */}
        <div className="text-center bg-white/50 rounded-lg p-8 border border-[#7AB8C4]">
          <h3 className="text-2xl font-serif mb-4 text-gray-800">
            ¿Tienes un comercio o ofreces servicios?
          </h3>
          <p className="text-gray-600 mb-6">
            Únete a nuestra comunidad y aparece automáticamente aquí.
          </p>
          <Link href="/registro">
            <Button size="lg" className="bg-[#28a745] hover:bg-[#218838] text-white font-serif text-lg px-8 py-6">
              Únete a la comunidad
            </Button>
          </Link>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-700 font-serif">
        © 2025 Conecta Barrio
      </footer>
    </div>
  )
}