import { test, expect } from '@playwright/test';

const LOGIN_URL = 'http://localhost:3000/login';

const INCORRECT_EMAIL = 'jeon@gmail.com'; 
const INCORRECT_PASSWORD = 'contraseña_incorrecta_123'; 

test('Login 3. Fallido: Debe mostrar error y permanecer en /login', async ({ page }) => {
    
    // 1. Navegar a la página de Login
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Ingresar' }).click();
    
    // Opcional: Verificar que estamos en la página de Login
    await expect(page).toHaveURL(LOGIN_URL);

    // 2. Llenar el formulario con CREDENCIALES INCORRECTAS
    await page.getByRole('textbox', { name: 'Email' }).fill(INCORRECT_EMAIL);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(INCORRECT_PASSWORD);
    
    // 3. Hacer clic en Iniciar Sesión
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    
    // 4. CRITERIO DE ACEPTACIÓN 1: El usuario debe permanecer en la URL de Login
    // Esperamos 5 segundos para asegurarnos que la redirección fallida se haya procesado.
    await page.waitForTimeout(5000); 
    await expect(page).toHaveURL(LOGIN_URL);

    // 5. CRITERIO DE ACEPTACIÓN 2: Recibir un mensaje de error claro
    // Buscamos el texto completo o parcial del mensaje
    const errorMessageLocator = page.locator('text=Email o contraseña incorrectos');
    await expect(errorMessageLocator).toBeVisible();
});