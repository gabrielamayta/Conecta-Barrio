
import { test, expect } from '@playwright/test';
const TEST_EMAIL = 'gloria@gmail.com';
const TEST_PASSWORD = 'Gloria123!';

test('Login de usuario exitoso', async ({ page }) => {
    // 1. Navegar a la página principal
    await page.goto('http://localhost:3000/');
    await page.getByRole('listitem').filter({ hasText: 'Ingresar' }).click();
        await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Email' }).fill(TEST_EMAIL);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(TEST_PASSWORD);
    
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    // 5. Aserción (¡Esto es lo más importante! Debes verificar la redirección)
    // Asumiendo que 'Gloria' es un Vecino que redirige a la raíz (/)
    await page.waitForURL('http://localhost:3000/'); 
    await expect(page).toHaveURL('http://localhost:3000/');
});