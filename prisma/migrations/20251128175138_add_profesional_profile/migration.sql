-- CreateTable
CREATE TABLE "ComercianteProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "nombreNegocio" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ComercianteProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProfesionalProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "nombreServicio" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "experiencia" TEXT NOT NULL,
    "zonaCobertura" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "disponibilidad" TEXT NOT NULL,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProfesionalProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ComercianteProfile_userId_key" ON "ComercianteProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ComercianteProfile_usuario_key" ON "ComercianteProfile"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "ProfesionalProfile_userId_key" ON "ProfesionalProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfesionalProfile_usuario_key" ON "ProfesionalProfile"("usuario");
