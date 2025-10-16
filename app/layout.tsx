// app/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// 🛑 IMPORTACIÓN CRÍTICA
import AuthProvider from '../components/AuthProvider'; 

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Conecta Barrio - Encuentra lo que necesitas, cerca tuyo",
  description: "Plataforma para conectar negocios locales con la comunidad",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        {/* 🛑 ENVOLVER AQUI */}
        <AuthProvider> 
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}