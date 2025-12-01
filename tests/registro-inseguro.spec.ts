import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Registrarse' }).click();
  await page.getByRole('textbox', { name: 'Nombre *' }).fill('antonella');
  await page.getByRole('textbox', { name: 'Apellido *' }).fill('gonzalez');
  await page.getByRole('textbox', { name: 'Email *' }).fill('anto@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña *', exact: true }).fill('antonella');
  await page.getByRole('textbox', { name: 'Confirmar Contraseña *' }).fill('antonella');
  await page.getByRole('textbox', { name: 'Teléfono *' }).fill('1198765432');
  await page.getByRole('textbox', { name: 'Cuéntanos sobre ti (opcional)' }).fill('hoolaaa');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Completar Registro' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Completar Registro' }).click();
  await page.getByRole('main').click();
});