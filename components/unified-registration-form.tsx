"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type UserType = "VECINO" | "COMERCIANTE" | "PROFESIONAL"

const categoriasComercio = [
  "Kiosco",
  "Almacén", 
  "Indumentaria",
  "Gastronomía",
  "Tecnología",
  "Farmacia",
  "Manicuria",
  "Confiteria",
  "Panaderia",
  "Vendedor de Plotters",
  "Otros"
  

]

const categoriasServicio = [
  "BELLEZA",
  "SALUD", 
  "EDUCACION",
  "TECNICO",
  "CONSTRUCCION",
  "LIMPIEZA",
  "CUIDADO_PERSONAL",
  "PASTELERIA",
  "MANICURIA",
  "OTROS"
]

export function UnifiedRegistrationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<UserType>("VECINO")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    // Datos básicos para todos
    email: "",
    nombre: "",
    apellido: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    
    // Datos específicos
    nombreNegocio: "",
    nombreServicio: "", 
    categoria: "",
    descripcion: "",
    direccion: "",
    usuario: "",
    experiencia: "",
    zonaCobertura: "",
    disponibilidad: ""
  })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación frontend de contraseñas
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }
    
    setIsLoading(true)

    try {
      // Crear FormData para enviar archivos
      const formDataToSend = new FormData()
      
      // Agregar todos los campos del formulario
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })
      
      // Agregar userType y logo si existe
      formDataToSend.append('userType', userType)
      if (logoFile) {
        formDataToSend.append('logo', logoFile)
      }

      console.log('Enviando datos con logo:', logoFile ? 'SÍ' : 'NO')

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formDataToSend, // Usar FormData en lugar de JSON
      })

      if (response.ok) {
        router.push("/login")
      } else {
        const error = await response.json()
        alert(error.error || "Error en el registro")
      }
    } catch (error) {
      alert("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Renderizar campos específicos según el tipo de usuario
  const renderSpecificFields = () => {
    switch (userType) {
      case "COMERCIANTE":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="nombreNegocio">Nombre del Comercio *</Label>
              <Input
                id="nombreNegocio"
                value={formData.nombreNegocio}
                onChange={(e) => updateFormData("nombreNegocio", e.target.value)}
                required
                placeholder="Ej: Almacén Don Pedro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <Select onValueChange={(value) => updateFormData("categoria", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasComercio.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección del Local *</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => updateFormData("direccion", e.target.value)}
                required
                placeholder="Ej: Calle Principal 123"
              />
            </div>

            {/* ✅ NUEVO CAMPO: Logo para Comerciante */}
            <div className="space-y-2">
              <Label htmlFor="logo">Logo del Comercio</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">
                Formatos: JPG, PNG, WEBP. Tamaño máximo: 2MB
              </p>
            </div>
          </>
        )

      case "PROFESIONAL":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="nombreServicio">Nombre del Servicio *</Label>
              <Input
                id="nombreServicio"
                value={formData.nombreServicio}
                onChange={(e) => updateFormData("nombreServicio", e.target.value)}
                required
                placeholder="Ej: Manicuría a Domicilio"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría de Servicio *</Label>
              <Select onValueChange={(value) => updateFormData("categoria", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasServicio.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "BELLEZA" && "Belleza"}
                      {cat === "SALUD" && "Salud"}
                      {cat === "EDUCACION" && "Educación"}
                      {cat === "TECNICO" && "Servicios Técnicos"}
                      {cat === "CONSTRUCCION" && "Construcción"}
                      {cat === "LIMPIEZA" && "Limpieza"}
                      {cat === "CUIDADO_PERSONAL" && "Cuidado Personal"}
                      {cat === "OTROS" && "Otros"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experiencia">Años de Experiencia *</Label>
              <Input
                id="experiencia"
                value={formData.experiencia}
                onChange={(e) => updateFormData("experiencia", e.target.value)}
                placeholder="Ej: 2 años, Más de 5 años"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zonaCobertura">Zona de Cobertura *</Label>
              <Input
                id="zonaCobertura"
                value={formData.zonaCobertura}
                onChange={(e) => updateFormData("zonaCobertura", e.target.value)}
                placeholder="Barrios donde ofreces servicios"
                required
              />
            </div>

            {/* ✅ NUEVO CAMPO: Logo para Profesional */}
            <div className="space-y-2">
              <Label htmlFor="logo">Logo del Servicio (opcional)</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">
                Muestra tu profesionalismo con un logo
              </p>
            </div>
          </>
        )

      default: // VECINO
        return (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              Como vecino, podrás descubrir comercios y servicios cerca de ti, 
              guardar tus favoritos y contactar directamente.
            </p>
          </div>
        )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Selección de tipo de usuario */}
      <div className="space-y-3">
        <Label className="text-base">¿Qué describes mejor lo que eres? *</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            { 
              value: "VECINO" as UserType, 
              label: "🧑‍🤝‍🧑 Vecino", 
              desc: "Quiero descubrir servicios y comercios de mi barrio" 
            },
            { 
              value: "COMERCIANTE" as UserType, 
              label: "🏪 Comercio", 
              desc: "Tengo un local físico (kiosko, almacén, tienda)" 
            },
            { 
              value: "PROFESIONAL" as UserType, 
              label: "🔧 Profesional", 
              desc: "Ofrezco servicios (manicuría, plomería, clases, etc.)" 
            }
          ].map((type) => (
            <div
              key={type.value}
              className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                userType === type.value
                  ? "border-[#007bff] bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => {
                setUserType(type.value)
                setLogoFile(null) // Resetear logo al cambiar tipo
              }}
            >
              <div className="font-semibold text-gray-800">{type.label}</div>
              <div className="text-xs text-gray-600 mt-1">{type.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Campos básicos para todos */}
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => updateFormData("nombre", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido *</Label>
            <Input
              id="apellido"
              value={formData.apellido}
              onChange={(e) => updateFormData("apellido", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            required
            placeholder="Mínimo 8 caracteres con mayúsculas, números y símbolos"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            required
            placeholder="Repite tu contraseña"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) => updateFormData("telefono", e.target.value)}
            required
            placeholder="11 1234-5678"
          />
        </div>

        {/* Campos específicos */}
        {renderSpecificFields()}

        {/* Descripción para todos */}
        <div className="space-y-2">
          <Label htmlFor="descripcion">
            {userType === "COMERCIANTE" && "Descripción del Comercio"}
            {userType === "PROFESIONAL" && "Descripción de tus Servicios"}
            {userType === "VECINO" && "Cuéntanos sobre ti (opcional)"}
          </Label>
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => updateFormData("descripcion", e.target.value)}
            placeholder={
              userType === "COMERCIANTE" ? "Describe tu comercio, productos, horarios..." :
              userType === "PROFESIONAL" ? "Describe los servicios que ofreces, tu especialidad..." :
              "Comparte algo sobre ti (opcional)"
            }
            rows={3}
          />
        </div>

        {/* Instagram para comerciantes y profesionales */}
        {(userType === "COMERCIANTE" || userType === "PROFESIONAL") && (
          <div className="space-y-2">
            <Label htmlFor="usuario">Usuario de Instagram (opcional)</Label>
            <Input
              id="usuario"
              value={formData.usuario}
              onChange={(e) => updateFormData("usuario", e.target.value)}
              placeholder="@tunegocio"
            />
          </div>
        )}

        {/* Disponibilidad solo para profesionales */}
        {userType === "PROFESIONAL" && (
          <div className="space-y-2">
            <Label htmlFor="disponibilidad">Disponibilidad (opcional)</Label>
            <Input
              id="disponibilidad"
              value={formData.disponibilidad}
              onChange={(e) => updateFormData("disponibilidad", e.target.value)}
              placeholder="Ej: Lunes a Viernes 9-18, Fines de semana"
            />
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full mt-2" 
        size="lg"
      >
        {isLoading ? "Registrando..." : "Completar Registro"}
      </Button>
    </form>
  )
}