// lib/session.ts
'use client';

// Guardar usuario en localStorage (para cliente)
export function saveUserToLocalStorage(user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

// Obtener usuario desde localStorage
export function getUserFromLocalStorage() {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

// Eliminar usuario (logout)
export function removeUserFromLocalStorage() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}

// Obtener userId actual
export function getCurrentUserId(): string | null {
  const user = getUserFromLocalStorage();
  return user?.id || null;
}

// Verificar si está autenticado
export function isAuthenticated(): boolean {
  return !!getCurrentUserId();
}

// Obtener tipo de usuario (COMERCIANTE o PROFESIONAL)
export function getUserRole(): string | null {
  const user = getUserFromLocalStorage();
  return user?.role || null;
}