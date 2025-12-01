"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Negocio {
  id: number
  nombre: string
  descripcion: string
  telefono: string
  instagram: string
  logo: string
  tipo: string
  esNuevo?: boolean
  esServicio?: boolean
  nombreNegocio?: string
  categoria?: string
  logoUrl?: string | null
}

interface BusinessCardProps {
  negocio: Negocio
}

export function BusinessCard({ negocio }: BusinessCardProps) {
  const [imgError, setImgError] = useState(false)
  
  const logoSource = imgError ? "/default-business.png" : (negocio.logoUrl || negocio.logo || "/default-business.png")
  const businessName = negocio.nombreNegocio || negocio.nombre || "Negocio"
  const businessCategory = negocio.categoria || negocio.tipo

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="aspect-square bg-white flex items-center justify-center p-6">
        <Image
          src={logoSource}
          alt={`Logo de ${businessName}`}
          width={200}
          height={200}
          className="object-contain max-h-32"
          onError={() => setImgError(true)}
        />
      </div>

      <div className="p-6 space-y-3">
        <h3 className="font-serif text-xl font-bold text-gray-900 text-center">
          {businessName}
        </h3>
        
        <p className="text-sm text-gray-500 text-center capitalize">
          {businessCategory?.toLowerCase()}
        </p>
        
        <p className="text-gray-700 text-center text-sm">
          {negocio.descripcion}
        </p>
        <p className="text-gray-600 text-center text-sm">
          Tel: {negocio.telefono}
        </p>
        
        {/* ✅ MOSTRAR INSTAGRAM SI EXISTE */}
        {negocio.instagram && (
          <p className="text-gray-600 text-center text-sm">
            Instagram: {negocio.instagram}
          </p>
        )}

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