import { test, expect } from '@playwright/test';

test('test de registro como vecino', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await page.getByRole('link', { name: 'Registrarse' }).click();
  await page.goto('http://localhost:3001/registro');
  await page.getByRole('textbox', { name: 'Nombre *' }).fill('candela');
  await page.getByRole('textbox', { name: 'Apellido *' }).fill('ramirez');
  await page.getByRole('textbox', { name: 'Email *' }).fill('cande@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña *', exact: true }).fill('Test123!');
  await page.getByRole('textbox', { name: 'Confirmar Contraseña *' }).fill('Test123!');
  await page.getByRole('textbox', { name: 'Teléfono *' }).fill('11 12345678');
  await page.locator('div').filter({ hasText: /^Cuéntanos sobre ti \(opcional\)$/ }).click();
  await page.getByRole('textbox', { name: 'Cuéntanos sobre ti (opcional)' }).fill('holaa');
  await page.getByRole('button', { name: 'Completar Registro' }).click();
  await page.goto('http://localhost:3001/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('cande@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Test123!');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('main').click();
});