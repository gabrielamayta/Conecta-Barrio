import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
console.log(__filename)
const __dirname = path.dirname(__filename);
console.log(__dirname)

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('camila@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Miel12_!');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('button', { name: '✏️ Editar Perfil y Galería' }).click();

  const rutaImagen = path.join(__dirname, '..', 'public', 'uploads', 'pandulce.jpg');

  await page.locator('input[type="file"]').setInputFiles(rutaImagen);

  await page.getByRole('button', { name: 'Confirmar y subir 1 fotos' }).click();
  await expect(page.getByText('✅ ¡Fotos cargadas con éxito!')).toBeVisible();
  
});