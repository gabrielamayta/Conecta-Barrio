// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Solo creamos la instancia una vez
const prisma = new PrismaClient(); 

export default prisma;