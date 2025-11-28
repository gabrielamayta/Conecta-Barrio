import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BusinessCard } from "@/components/business-card"
import { Header } from "@/components/header"
import { prisma } from "@/lib/prisma"

// Negocios fijos que ya tenías
const negociosFijos = [
  {
    id: 1,
    nombre: "Indumentaria Hope",
    descripcion: "Emprendedora: Marcela Velzaga",
    telefono: "1151418997",
    instagram: "indumentaria_hope1",
    logo: "/hope.png",
    tipo: "Indumentaria",
  },
  {
    id: 2,
    nombre: "Nails by Valen",
    descripcion: "Manicurista: Valentina Mayta",
    telefono: "1141466446",
    instagram: "",
    logo: "/manicuria.png",
    tipo: "Manicurista",
  },
  {
    id: 3,
    nombre: "Kmili",
    descripcion: "Pastelera: Camila Fernandez",
    telefono: "1148889873",
    instagram: "cookieskmill",
    logo: "/kmill.png",
    tipo: "Pastelería y Confitería",
  },
  {
    id: 4,
    nombre: "Fredy Burgoa",
    descripcion: "Modelista y Vendedor de Plotters",
    telefono: "1139055160",
    instagram: "fredy_burgoa",
    logo: "/modelista.png",
    tipo: "Modelista",
  },
]

// Función para obtener comerciantes de la base de datos
async function getComerciantesRegistrados() {
  try {
    const comerciantes = await prisma.comercianteProfile.findMany({
      where: {
        aprobado: true
      },
      include: {
        user: {
          select: {
            nombre: true,
            apellido: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return comerciantes.map((comerciante, index) => {
      let logo = "/default-business.png";
      
      if (comerciante.nombreNegocio === "Gabu Makeup" || comerciante.usuario === "gabumakeup53wz") {
        logo = "/gabu.makeup.png";
      } else if (comerciante.nombreNegocio === "Lo de Mar") {
        logo = "/kiosko.png"; 
      }
      
      return {
        id: 1000 + index,
        nombre: comerciante.nombreNegocio,
        descripcion: comerciante.descripcion,
        telefono: comerciante.telefono,
        instagram: comerciante.usuario,
        logo: logo,
        tipo: comerciante.categoria,
      };
    });
  } catch (error) {
    console.error('Error obteniendo comerciantes:', error);
    return [];
  }
}

export default async function HomePage() {
  const comerciantesRegistrados = await getComerciantesRegistrados();
  const todosLosNegocios = [...negociosFijos, ...comerciantesRegistrados];

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
              <Link
                href="/#servicios"
                className="font-serif text-lg text-gray-800 hover:text-gray-900 transition-colors"
              >
                Servicios
              </Link>
            </li>
            <li>
              <Link
                href="/#comercios"
                className="font-serif text-lg text-gray-800 hover:text-gray-900 transition-colors"
              >
                Comercios
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
        {/* Sección de Comercios */}
        <div id="comercios" className="mb-12">
          <h2 className="text-3xl font-serif text-center mb-8 text-gray-800">
            Comercios y Servicios del Barrio
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {todosLosNegocios.map((negocio) => {
              const esNuevo = typeof negocio.id === 'number' && negocio.id >= 1000;
              
              return (
                <div key={negocio.id} className="relative">
                  <BusinessCard negocio={negocio} />
                  {esNuevo && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      NUEVO
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN DE REGISTRO UNIFICADO */}
        <div className="text-center bg-white/50 rounded-lg p-8 border border-[#7AB8C4]">
          <h3 className="text-2xl font-serif mb-4 text-gray-800">
            ¿Tienes un negocio o ofreces servicios?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Únete a nuestra comunidad como comerciante o profesional. Llega a más vecinos y haz crecer tu emprendimiento.
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