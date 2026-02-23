import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function DELETE(
  request: Request,
  // Modificamos aquí: params ahora es una Promesa
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // IMPORTANTE: Esperamos a que los params se resuelvan
    const { id } = await params; 

    // 1. Buscar la imagen en la DB para obtener la URL del archivo
    const imagen = await prisma.galeriaImagen.findUnique({
      where: { id }
    });

    if (!imagen) {
      return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });
    }

    // 2. Eliminar el archivo físico de la carpeta public/uploads
    // path.join unirá "public" con "/uploads/archivo.jpg" correctamente
    const filePath = path.join(process.cwd(), "public", imagen.url);
    
    await fs.unlink(filePath).catch((err) => {
      console.error("No se pudo borrar el archivo físico, quizá ya no existía:", err);
    });

    // 3. Eliminar el registro de la base de datos
    await prisma.galeriaImagen.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Imagen eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}