import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('came@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Test123_');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('heading', { name: 'Bienvenido a tu Panel de Control, Profesional' }).click();
  await expect(page.getByRole('heading', { name: 'Bienvenido a tu Panel de Control, Profesional' })).toBeVisible();
});