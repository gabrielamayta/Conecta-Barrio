import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const DASHBOARD_URL = `${BASE_URL}/dashboard`;

const COMERCIANTE_EMAIL = 'jeon@gmail.com'; 
const COMERCIANTE_PASSWORD = 'Jungkook97@'; 


test('Login 1. Comerciante: Debe iniciar sesión y redirigir al Dashboard', async ({ page }) => {
    
    // 1. Navegar a la página principal
    await page.goto(BASE_URL);
    
    // 2. Navegar a la página de Login
    // Busca el enlace/botón 'Ingresar'
    await page.getByRole('listitem').filter({ hasText: 'Ingresar' }).click();
    
    // Opcional: Verificar que la página de login cargó correctamente
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();

    // 3. Llenar el formulario de inicio de sesión
    // Se usa el selector más robusto para los campos
    await page.getByRole('textbox', { name: 'Email' }).fill(COMERCIANTE_EMAIL);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(COMERCIANTE_PASSWORD);
    
    // 4. Hacer clic en el botón de Iniciar Sesión
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    // 5. CRITERIO DE ACEPTACIÓN: Verificar la redirección al Dashboard
    // Se usa un timeout de 15s por si el servidor es lento en procesar el login.
    await page.waitForURL(DASHBOARD_URL, { timeout: 15000 }); 
    
    // Aserción final de URL
    await expect(page).toHaveURL(DASHBOARD_URL);
    
    // Opcional: Verificar que un elemento clave del Dashboard está visible (ej. el encabezado de bienvenida)
    await expect(page.getByRole('heading', { name: 'Bienvenido a tu Panel de Control' })).toBeVisible();
});