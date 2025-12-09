import { test, expect } from '@playwright/test';
test('editar perfil de profesional', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('came@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('T');
  await page.getByRole('textbox', { name: 'Contraseña' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Test123_');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('heading', { name: 'Bienvenido a tu Panel de' }).click();
  await page.getByRole('button', { name: '✏️ Editar Perfil' }).click();
  await expect(page.getByRole('heading', { name: '✏️ Editar Perfil' })).toBeVisible();
  await expect(page.locator('h2')).toContainText('✏️ Editar Perfil');
  await page.getByRole('combobox').selectOption('Otros');
  await page.getByRole('button', { name: '💾 Actualizar Perfil' }).click();
});