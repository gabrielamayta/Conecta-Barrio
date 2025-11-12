import { test, expect } from '@playwright/test';

// 🚨 IMPORTANTE: Estas constantes deben coincidir con un usuario existente en tu base de datos 
// y la NUEVA contraseña debe cumplir con tus reglas de seguridad.
const TEST_USER_EMAIL = 'maytagabi765@gmail.com'; 
// Token fijo de prueba (El backend debe estar configurado para aceptarlo para testing)
const FAKE_RESET_TOKEN = '9a3647f13c499cd2b231564dade7a95dad34714f3b398f60903f85519eccd5eb'; 
const NEW_SECURE_PASSWORD = 'Jungkook@'; 

test('Flujo E2E: Restablecimiento de Contraseña y Login Exitoso', async ({ page }) => {

    // --- 1. Navegar a la página de Forgot Password y solicitar el enlace ---
    await test.step('Navegar y solicitar el enlace de restablecimiento', async () => {
        
        await page.goto('http://localhost:3000/login');

        // CRÍTICO: Usamos Promise.all para esperar el clic Y la navegación
        await Promise.all([
            page.waitForURL('http://localhost:3000/forgot-password'),
            page.getByRole('link', { name: '¿Olvidaste tu contraseña?' }).click(),
        ]);

        // Llenar el campo de email
        await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill(TEST_USER_EMAIL);

        // Esperar la respuesta de la API de forgot-password
        const [response] = await Promise.all([
            page.waitForResponse(res => 
                res.url().includes('/api/auth/forgot-password') && res.request().method() === 'POST'
            ),
            page.getByRole('button', { name: 'Solicitar Restablecimiento' }).click(),
        ]);
        
        // Verificar el mensaje de éxito del backend (asume que muestra un mensaje en el DOM)
        await expect(page.getByText('Si la cuenta existe, hemos enviado un enlace')).toBeVisible();
    });

    // --- 2. Aplicar el Restablecimiento con el Token Fijo ---
    await test.step('Restablecer la contraseña con el token de prueba', async () => {
        
        // Navegamos directamente a la URL de restablecimiento con el token simulado
        const resetUrl = `http://localhost:3000/reset-password?token=${FAKE_RESET_TOKEN}`;
        await page.goto(resetUrl);

        // Verificar que la página cargó el formulario de nueva contraseña
        await expect(page.getByRole('heading', { name: 'Nueva Contraseña' })).toBeVisible();

        // Llenar los campos con la nueva contraseña
        await page.getByRole('textbox', { name: 'Nueva Contraseña', exact: true }).fill(NEW_SECURE_PASSWORD);
        await page.getByRole('textbox', { name: 'Confirmar Nueva Contraseña' }).fill(NEW_SECURE_PASSWORD);

        // Enviar el formulario y esperar la respuesta de la API
        const [response] = await Promise.all([
            page.waitForResponse(res => 
                res.url().includes('/api/auth/reset-password') && res.request().method() === 'POST'
            ),
            page.getByRole('button', { name: 'Cambiar Contraseña' }).click(),
        ]);

        // VERIFICACIÓN CRÍTICA: Asegúrate de que el backend respondió 200/201 (menos de 400)
        expect(response.status(), 'El backend debe devolver status 200/201 para el restablecimiento.').toBeLessThan(400);
        
        // CORRECCIÓN: Usamos regex para ser flexibles con la puntuación del mensaje de éxito
        await expect(page.getByText(/Contraseña restablecida con éxito/)).toBeVisible();
        await expect(page).toHaveURL('http://localhost:3000/login');
    });

    // --- 3. Verificar Login con la Nueva Contraseña ---
    await test.step('Verificar inicio de sesión con la nueva contraseña', async () => {
        
        // Llenar formulario de login
        await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
        await page.getByRole('textbox', { name: 'Contraseña' }).fill(NEW_SECURE_PASSWORD);

        // Iniciar sesión
        const [loginResponse] = await Promise.all([
            page.waitForResponse(res => res.url().includes('/api/auth/login') && res.request().method() === 'POST'),
            page.getByRole('button', { name: 'Iniciar Sesión' }).click(),
        ]);
        
        // Verificar el éxito (código 200) y la redirección a la página principal
        expect(loginResponse.status()).toBe(200);
        await expect(page).toHaveURL('http://localhost:3000/'); 
        
        // Verificar un elemento de la página principal para confirmar el login
        await expect(page.getByRole('link', { name: 'Conecta Barrio' })).toBeVisible();
    });
});