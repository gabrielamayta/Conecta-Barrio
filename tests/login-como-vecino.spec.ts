import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

const VECINO_EMAIL = 'cielo@gmail.com'; 
const VECINO_PASSWORD = 'Valen123@'; 


test('Login 2. Vecino: Debe iniciar sesión y redirigir a la página principal (/)', async ({ page }) => {
    
    // 1. Navegar a la página principal y luego al login
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: 'Ingresar' }).click();
    
    // Opcional: Verificar que estamos en la página de login
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();

    // 2. Llenar el formulario de inicio de sesión
    await page.getByRole('textbox', { name: 'Email' }).fill(VECINO_EMAIL);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(VECINO_PASSWORD);
    
    // 3. Hacer clic en el botón de Iniciar Sesión
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    // 4. CRITERIO DE ACEPTACIÓN: Verificar la redirección al Home (/)
    await page.waitForURL(BASE_URL, { timeout: 10000 }); // Espera 10s por si la DB está lenta
    await expect(page).toHaveURL(BASE_URL);
    
    // Opcional: Verificar que se ve contenido de la página principal (ej. el título)
    await expect(page.getByRole('link', { name: 'Conecta Barrio Encuentra lo que necesitas, cerca tuyo' })).toBeVisible();


});