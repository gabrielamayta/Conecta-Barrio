import { test, expect } from '@playwright/test';
test.describe('Edicion de perfil existente de comerciante', () => {
test('El comerciante debe poder acceder a una seccióndonde pueda revisar y modificar toda la información de su perfil).', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('valentinaa@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('V');
  await page.getByRole('textbox', { name: 'Contraseña' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Valen123_');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await expect(page.getByRole('heading', { name: 'Bienvenido a tu Panel de Control, Comerciante' })).toBeVisible();
  await expect(page.locator('h2')).toContainText('Bienvenido a tu Panel de Control, Comerciante');
});
})