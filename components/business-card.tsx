"use client"
import Image from "next/image"
import Link from "next/link" 
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface Negocio {
  id: string | number
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
  
  const getLogoPath = () => {
    // 1. Priorizamos logoUrl que viene de la DB
    const rawLogo = negocio.logoUrl || negocio.logo;
    
    // 2. Si no hay nada o hubo error, directo al default
    if (imgError || !rawLogo) return "/default-business.png";
    
    // 3. Si ya tiene la ruta correcta o es externa
    if (rawLogo.startsWith('http') || rawLogo.startsWith('/uploads/')) {
      return rawLogo;
    }

    // 4. TRUCO FINAL: Si el archivo está en public/uploads, 
    // asegurémonos de que empiece con /uploads/
    return `/uploads/${rawLogo.replace(/^\//, '')}`;
  }

  const businessName = negocio.nombreNegocio || negocio.nombre || "Negocio"
  const businessCategory = negocio.categoria || negocio.tipo

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 h-full flex flex-col">
      <div className="aspect-square bg-gray-50 flex items-center justify-center p-6 relative">
        <Image
          src={getLogoPath()}
          alt={`Logo de ${businessName}`}
          width={200}
          height={200}
          className="object-contain max-h-40 transition-opacity duration-300"
          onError={() => {
            console.log("Error cargando imagen:", getLogoPath());
            setImgError(true);
          }}
          priority={false}
        />
      </div>

      <div className="p-6 space-y-3 flex-grow flex flex-col">
        <h3 className="font-serif text-xl font-bold text-gray-900 text-center line-clamp-1">
          {businessName}
        </h3>
        
        <p className="text-[10px] tracking-widest text-gray-400 text-center uppercase font-bold">
          {businessCategory}
        </p>
        
        <p className="text-gray-600 text-center text-sm line-clamp-2 flex-grow"> 
          {negocio.descripcion}
        </p>

        <div className="pt-4 space-y-3">
          <div className="text-xs text-center text-gray-400 border-t pt-3">
            {negocio.telefono} {negocio.instagram && `• @${negocio.instagram.replace('@', '')}`}
          </div>
          
          <Link href={`/perfil/${negocio.id}`} className="block">
            <Button
              variant="outline"
              className="w-full font-serif border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all bg-transparent rounded-xl"
            >
              Ver Perfil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}