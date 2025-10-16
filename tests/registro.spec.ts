// tests/registro.spec.ts

import { test, expect } from '@playwright/test';

// Genera un email único usando la marca de tiempo para asegurar que el registro no falle por duplicidad.
const uniqueEmail = `test_registro_${Date.now()}@conecta-barrio.com`;
const securePassword = 'Jungkook97@'; // Cumple con los requisitos de seguridad

test('Registro Exitoso de Comerciante: Debe redirigir a /login', async ({ page }) => {

  // 1. Navegar al formulario de registro
  await page.goto('http://localhost:3000/registro');

  // 2. Llenar los campos
  await page.getByRole('textbox', { name: 'Nombre' }).fill('Jessica');
  await page.getByRole('textbox', { name: 'Apellido' }).fill('Olivares');
  await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);

  // 3. Seleccionar el Rol (Comerciante)
  // Nota: Si el test es de Comerciante, debemos seleccionarlo explícitamente.
  await page.selectOption('select[name="role"]', { value: 'COMERCIANTE' });

  // 4. Llenar contraseñas (usa la contraseña segura)
  await page.getByPlaceholder('Contraseña (Mín. 8, Mayús, Núm, Símbolo)').fill(securePassword);
  await page.getByPlaceholder('Confirmar Contraseña').fill(securePassword);

  // 5. Clic en Registrarse
  await page.getByRole('button', { name: 'Registrarse' }).click();

  // 6. Criterio de Aceptación: Verificar la redirección
  // Esperamos que el Comerciante sea redirigido a la creación de perfil.
  await page.waitForURL('http://localhost:3000/login');
  
  // Opcional: Afirmar que la URL final es la correcta
  await expect(page).toHaveURL('http://localhost:3000/login');
  
  console.log(`✅ Registro exitoso como COMERCIANTE con email: ${uniqueEmail}`);
});