"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GaleriaImagen {
  id: string;
  url: string;
}

interface Props {
  profileId: string;
  type: 'comercio' | 'profesional';
  imagenesIniciales: GaleriaImagen[];
}

export default function SeccionGaleria({ profileId, type, imagenesIniciales }: Props) {
  const [archivos, setArchivos] = useState<File[]>([]);
  const [galeria, setGaleria] = useState<GaleriaImagen[]>([]);
  const [cargando, setCargando] = useState(false);
  
  // --- ESTADOS PARA LA INTERFAZ PERSONALIZADA ---
  const [showModal, setShowModal] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState<string | null>(null);
  const [notificacion, setNotificacion] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (imagenesIniciales) setGaleria(imagenesIniciales);
  }, [imagenesIniciales]);

  // Función para mostrar mensajes tipo "Toast"
  const mostrarMensaje = (msj: string) => {
    setNotificacion(msj);
    setTimeout(() => setNotificacion(null), 3000);
  };

  const handleConfirmarSubida = async () => {
    if (archivos.length === 0) return;
    setCargando(true);
    try {
      for (const file of archivos) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("profileId", profileId);
        formData.append("type", type);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const nuevaImagen = await res.json();
        if (res.ok) setGaleria((prev) => [...prev, nuevaImagen]);
      }
      setArchivos([]);
      mostrarMensaje("✅ ¡Fotos cargadas con éxito!");
      router.refresh();
    } catch (error) {
      mostrarMensaje("❌ Hubo un error al subir");
    } finally {
      setCargando(false);
    }
  };

  const ejecutarEliminacion = async () => {
    if (!idAEliminar) return;
    try {
      const res = await fetch(`/api/upload/${idAEliminar}`, { method: "DELETE" });
      if (res.ok) {
        setGaleria((prev) => prev.filter((img) => img.id !== idAEliminar));
        mostrarMensaje("🗑️ Foto eliminada");
        router.refresh();
      }
    } catch (error) {
      mostrarMensaje("❌ No se pudo eliminar");
    } finally {
      setShowModal(false);
      setIdAEliminar(null);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl border shadow-sm relative overflow-hidden">
      
      {/* 1. NOTIFICACIÓN FLOTANTE (Reemplaza al alert) */}
      {notificacion && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-[100] animate-in fade-in slide-in-from-top-4 duration-300 font-medium">
          {notificacion}
        </div>
      )}

      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        📸 Galería de Trabajos
      </h3>

      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-slate-600">Selecciona tus mejores fotos</label>
        <input 
          type="file" multiple accept="image/*"
          onChange={(e) => setArchivos(Array.from(e.target.files || []))}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        {archivos.length > 0 && (
          <button 
            onClick={handleConfirmarSubida}
            disabled={cargando}
            className="bg-[#3498DB] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#2980B9] transition-all disabled:bg-slate-300"
          >
            {cargando ? "Procesando imágenes..." : `Confirmar y subir ${archivos.length} fotos`}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        {galeria.map((img) => (
          <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-100">
            <Image src={img.url} alt="Trabajo" fill className="object-cover" />
            <button 
              onClick={() => { setIdAEliminar(img.id); setShowModal(true); }}
              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg hover:scale-110"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* 2. MODAL DE CONFIRMACIÓN (Reemplaza al confirm) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">¿Eliminar foto?</h4>
            <p className="text-slate-500 mb-8 text-sm">Esta imagen se borrará permanentemente de tu galería de trabajos.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={ejecutarEliminacion}
                className="flex-1 px-4 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}