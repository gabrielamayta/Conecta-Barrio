// tests/registro-inseguro.spec.ts

import { test, expect } from '@playwright/test';

// Datos que intencionalmente fallan el criterio de seguridad:
// No tiene 8 caracteres (sólo 7)
const unsafePassword = '123Abc@'; 
const uniqueEmail = `fail_security_${Date.now()}@conecta-barrio.com`; 

test('Validación de Contraseña: Debe fallar si no cumple con requisitos mínimos (Menos de 8 caracteres)', async ({ page }) => {
  
  // 1. Navegar al formulario de registro
  await page.goto('http://localhost:3000/registro');

  // 2. Llenar campos con datos válidos
  await page.getByRole('textbox', { name: 'Nombre' }).fill('TestFail');
  await page.getByRole('textbox', { name: 'Apellido' }).fill('Security');
  await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);

  // 3. Seleccionar el rol (por defecto VECINO)
  await page.selectOption('select[name="role"]', { value: 'VECINO' });

  // 4. Llenar contraseñas (usa la contraseña INSEGURA)
  // El placeholder usado es el que tienes en tu page.tsx
  await page.getByPlaceholder('Contraseña (Mín. 8, Mayús, Núm, Símbolo)').fill(unsafePassword);
  await page.getByPlaceholder('Confirmar Contraseña').fill(unsafePassword);

  // 5. Clic en Registrarse
  await page.getByRole('button', { name: 'Registrarse' }).click();

  // 6. Criterio de Aceptación: Verificar el mensaje de error (Backend/Frontend)
  // El sistema debe mostrar el mensaje de error.
  const expectedErrorMessage = "La contraseña no cumple con los requisitos: debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos"
  
  // Esperamos encontrar el texto de error en la página.
  await expect(page.getByText(expectedErrorMessage)).toBeVisible();
  // Opcional: Afirmar que la URL NO cambió (sigue en registro)
  await expect(page).toHaveURL('http://localhost:3000/registro');
  
  console.log(`✅ Test PASSED: Falló correctamente la validación de seguridad.`);
});