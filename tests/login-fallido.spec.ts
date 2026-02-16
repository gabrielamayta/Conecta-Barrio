import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByRole('heading', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('maytagabi765@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('tre4534');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByText('Credenciales inválidas.').click();
  await expect(page.getByText('Credenciales inválidas.')).toBeVisible();
});