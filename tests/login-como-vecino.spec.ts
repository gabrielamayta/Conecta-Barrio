 import { test, expect } from '@playwright/test';

test('Login 2. Vecino: Debe iniciar sesión y redirigir a la página principal (/)', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByRole('heading', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('melanie@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('T');
  await page.getByRole('textbox', { name: 'Contraseña' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Test123!');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await expect(page.getByRole('banner')).toBeVisible();
  await page.getByText('Comercios y Servicios del Barrio').click();
});