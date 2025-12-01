import { test, expect } from '@playwright/test';

test('test de login fallido', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('listitem').filter({ hasText: 'Ingresar' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('maytagabi765@gmail.com'); 
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Test123!dddd');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByText('No se pudo conectar con el servidor').click();
});