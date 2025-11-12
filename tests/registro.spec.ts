import { test, expect } from '@playwright/test';

// Genera un email único usando la marca de tiempo para asegurar que el registro no falle por duplicidad.
const uniqueEmail = `test_registro_${Date.now()}@conecta-barrio.com`;
const securePassword = 'Jungkook97@'; // Debe cumplir con los requisitos de seguridad

test('Registro Exitoso de Comerciante: Debe redirigir a /login', async ({ page }) => {

    // 1. Navegar al formulario de registro
    await page.goto('http://localhost:3000/registro');

    // 2. Llenar los campos
    await page.getByRole('textbox', { name: 'Nombre' }).fill('Jessica');
    await page.getByRole('textbox', { name: 'Apellido' }).fill('Olivares');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);

    // 3. Seleccionar el Rol (Comerciante)
    await page.selectOption('select[name="role"]', { value: 'COMERCIANTE' });

    // 4. Llenar contraseñas
    await page.getByPlaceholder('Contraseña (Mín. 8, Mayús, Núm, Símbolo)').fill(securePassword);
    await page.getByPlaceholder('Confirmar Contraseña').fill(securePassword);
// Esperar la respuesta de la API de registro
    const [response] = await Promise.all([
        page.waitForResponse(res => res.url().includes('/api/auth/register') && res.request().method() === 'POST'),
        page.getByRole('button', { name: 'Registrarse' }).click(),
    ]);

    // 🚨 AJUSTE DEL TIMEOUT: Dale más tiempo para la redirección.
    await page.waitForTimeout(1000); // Intenta 1000ms (1 segundo)

    // Verificamos la URL final.
    // LÍNEA 35: await expect(page).toHaveURL('http://localhost:3000/login'); 
    await expect(page).toHaveURL('http://localhost:3000/login');
});