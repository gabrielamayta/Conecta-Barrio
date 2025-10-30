import crypto from 'crypto';
import bcrypt from 'bcrypt';


/** Genera un token aleatorio y seguro */
export function generateSecureToken(length: number = 48): string {
    // Genera bytes aleatorios y los convierte a una cadena hexadecimal
    return crypto.randomBytes(length).toString('hex');
}

/** Calcula la fecha de expiración (ej: 60 minutos) */
export function calculateExpirationDate(minutesToAdd: number = 60): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutesToAdd);
    return date;
}

// --- Funciones de Contraseña (Hashing) ---

const saltRounds = 10; 

/**
 * Hashea la contraseña de texto plano.
 * @param password La contraseña en texto plano
 * @returns El hash de la contraseña
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds);
}

/**
 * Compara una contraseña de texto plano con un hash existente.
 * @param password La contraseña en texto plano
 * @param hash El hash guardado en la base de datos
 * @returns Un booleano (true si coinciden)
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}