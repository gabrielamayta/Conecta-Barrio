import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Negocio {
  id: number
  nombre: string
  descripcion: string
  telefono: string
  instagram: string
  logo: string
  tipo: string
}

interface BusinessCardProps {
  negocio: Negocio
}

export function BusinessCard({ negocio }: BusinessCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="aspect-square bg-white flex items-center justify-center p-6">
        <Image
          src={negocio.logo || "/placeholder.svg"}
          alt={`Logo de ${negocio.nombre}`}
          width={200}
          height={200}
          className="object-contain"
        />
      </div>

      <div className="p-6 space-y-3">
        <h3 className="font-serif text-xl font-bold text-gray-900 text-center">{negocio.tipo}</h3>
        <p className="text-gray-700 text-center text-sm">{negocio.descripcion}</p>
        <p className="text-gray-600 text-center text-sm">Número: {negocio.telefono}</p>
        <p className="text-gray-600 text-center text-sm">Ig: {negocio.instagram}</p>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full font-serif border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors bg-transparent"
          >
            Ver Perfil
          </Button>
        </div>
      </div>
    </div>
  )
}
