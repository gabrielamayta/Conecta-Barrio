"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Facebook, Chrome } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    contrasena: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Login:", formData)
    // Aquí irá la lógica de login cuando conectes el backend
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B8E0E8] to-[#D4EEF3]">
      <Header />

      <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="font-serif text-3xl text-center mb-2 text-gray-900">Inicia Sesión</h2>
            <p className="text-center text-gray-600 mb-8">
              ¿No tienes cuenta?{" "}
              <Link href="/registro" className="text-gray-900 hover:underline font-semibold">
                Regístrate
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-serif text-gray-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contrasena" className="font-serif text-gray-900">
                  Contraseña
                </Label>
                <Input
                  id="contrasena"
                  type="password"
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                  className="border-gray-300"
                  required
                />
              </div>

              <div className="text-center">
                <Link href="/recuperar-contrasena" className="text-sm text-gray-600 hover:text-gray-900">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-serif text-lg py-6">
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-8">
              <p className="text-center text-gray-600 mb-4 font-serif">O Conéctate con</p>
              <div className="flex justify-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors bg-transparent"
                >
                  <Facebook className="w-6 h-6" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-[#DB4437] hover:bg-[#DB4437] hover:text-white transition-colors bg-transparent"
                >
                  <Chrome className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-700 font-serif">© 2025 Conecta Barrio</footer>
    </div>
  )
}
