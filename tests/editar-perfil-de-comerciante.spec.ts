import { test, expect } from '@playwright/test';
test('editar perfil de comerciante', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await page.getByRole('listitem').filter({ hasText: 'Ingresar' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('valentinaa@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('V');
  await page.getByRole('textbox', { name: 'Contraseña' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Valen123_');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('heading', { name: 'Bienvenido a tu Panel de' }).click();
  await expect(page.getByRole('button', { name: '✏️ Editar Perfil' })).toBeVisible();
  await page.getByRole('button', { name: '✏️ Editar Perfil' }).click();
  await page.getByRole('textbox', { name: '-5678' }).click();
  await page.getByRole('textbox', { name: '-5678' }).fill('9876-5432');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: '💾 Actualizar Perfil' }).click();
  await expect(page.locator('h2')).toContainText('✏️ Editar Perfil');
});