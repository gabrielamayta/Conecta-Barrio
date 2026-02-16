import { test, expect } from '@playwright/test';

test('test Debe redirigir al dashboard si es Profesional', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByRole('heading', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('camilagmail.com');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email' }).fill('camila@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('M');
  await page.getByRole('textbox', { name: 'Contraseña' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Miel12_!');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('heading', { name: 'Bienvenido a tu Panel de' }).click();
  await expect(page.getByText('Bienvenido a tu Panel de Control, Profesional')).toBeVisible();
});