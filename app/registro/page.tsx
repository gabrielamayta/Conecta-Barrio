import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { UnifiedRegistrationForm } from "@/components/unified-registration-form"

export default function RegistroPage() {
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-gray-800 mb-4">
              Únete a Conecta Barrio
            </h1>
            <p className="text-gray-600">
              Elige cómo quieres participar en nuestra comunidad
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-[#7AB8C4]">
            <UnifiedRegistrationForm />
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-[#007bff] hover:underline font-semibold">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-700 font-serif">© 2025 Conecta Barrio</footer>
    </div>
  )
}