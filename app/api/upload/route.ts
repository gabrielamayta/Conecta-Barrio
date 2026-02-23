import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const profileId = data.get("profileId") as string;
  const type = data.get("type") as string; // "comercio" o "profesional"

  if (!file) return NextResponse.json({ error: "No hay archivo" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Nombre único para evitar sobrescribir (ej: 17123456-nails.png)
  const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
  const filePath = path.join(process.cwd(), "public/uploads", filename);

  await writeFile(filePath, buffer);

  // Guardar en la base de datos
  const nuevaImagen = await prisma.galeriaImagen.create({
    data: {
      url: `/uploads/${filename}`,
      comercioId: type === "comercio" ? profileId : null,
      profesionalId: type === "profesional" ? profileId : null,
    },
  });

  return NextResponse.json(nuevaImagen);
}