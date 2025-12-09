import { test, expect } from '@playwright/test';


test('test', async ({ page }) => {
 await page.goto('http://localhost:3001/');
 await page.getByRole('link', { name: 'Registrarse' }).click();
 await page.getByRole('textbox', { name: 'Nombre *' }).click();
 await page.getByRole('textbox', { name: 'Nombre *' }).fill('eugenia');
 await page.getByRole('textbox', { name: 'Apellido *' }).click();
 await page.getByRole('textbox', { name: 'Apellido *' }).fill('fernandez');
 await page.getByText('Nombre *Apellido *Email *').click();
 await page.getByRole('textbox', { name: 'Email *' }).click();
 await page.getByRole('textbox', { name: 'Email *' }).fill('euge@gmail.com');
 await page.getByRole('textbox', { name: 'Contraseña *', exact: true }).click();
 await page.getByRole('textbox', { name: 'Contraseña *', exact: true }).press('CapsLock');
 await page.getByRole('textbox', { name: 'Contraseña *', exact: true }).fill('T');
 await page.getByRole('textbox', { name: 'Contraseña *', exact: true }).press('CapsLock');
 await page.getByRole('textbox', { name: 'Contraseña *', exact: true }).fill('Test123_');
 await page.getByRole('textbox', { name: 'Confirmar Contraseña *' }).click();
 await page.getByRole('textbox', { name: 'Confirmar Contraseña *' }).press('CapsLock');
 await page.getByRole('textbox', { name: 'Confirmar Contraseña *' }).fill('T');
 await page.getByRole('textbox', { name: 'Confirmar Contraseña *' }).press('CapsLock');
 await page.getByRole('textbox', { name: 'Confirmar Contraseña *' }).fill('Test123_');
 await page.getByRole('textbox', { name: 'Teléfono *' }).fill('1154326785');
 await page.getByRole('textbox', { name: 'Cuéntanos sobre ti (opcional)' }).click();
 await page.getByRole('textbox', { name: 'Cuéntanos sobre ti (opcional)' }).fill('holis');
 await page.getByRole('button', { name: 'Completar Registro' }).click();
 await page.getByRole('button', { name: 'Completar Registro' }).click();
});
