import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BusinessCard } from "@/components/business-card"
import { Header } from "@/components/header"

const negocios = [
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
    instagram: "cookieskmili",
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

export default function HomePage() {
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
        <div id="comercios" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {negocios.map((negocio) => (
            <BusinessCard key={negocio.id} negocio={negocio} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link href="/registro">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white font-serif text-lg px-8 py-6">
              Registrarme
            </Button>
          </Link>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-700 font-serif">© 2025 Conecta Barrio</footer>
    </div>
  )
}
