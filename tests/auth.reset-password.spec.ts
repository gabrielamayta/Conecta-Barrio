import { test, expect } from '@playwright/test';

// --- Constantes de Prueba ---
const TEST_USER_EMAIL = 'maytagabi765@gmail.com'; 
const NEW_PASSWORD = 'Jungkook97'; // Contraseña limpia
const TOKEN_PLACEHOLDER = '23e1f7c6f37b9f0f2ecb2c826f39908e4f2a9b15be115ec6026ee6badcab6ada558df9d35e9f38813f49c4d113f09461';

test.describe('Flujo E2E: Olvido, Restablecimiento y Login', () => {

    // Nota: Usamos el token que aparece en tu grabación (TOKEN_PLACEHOLDER)
    // En un test real, este token debería ser leído de la base de datos o de la respuesta de la API.
    const resetUrl = `/reset-password/${TOKEN_PLACEHOLDER}`;

    test('Debe solicitar, restablecer la contraseña, e iniciar sesión con la nueva clave', async ({ page }) => {

        // --- PARTE 1: SOLICITAR EL ENLACE ---
        await test.step('1. Solicitar el token de restablecimiento', async () => {
            await page.goto('/forgot-password');
            await expect(page.getByRole('heading', { name: '¿Olvidaste tu Contraseña?' })).toBeVisible();

            // 1.1. Interceptar la llamada a la API para verificar el éxito del servidor
            const apiCallPromise = page.waitForResponse(
                (response) => response.url().includes('/api/auth/forgot-password') && response.status() === 200
            );

            // 1.2. Ingresar el email y enviar
            await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill(TEST_USER_EMAIL);
            await page.getByRole('button', { name: 'Solicitar Restablecimiento' }).click();

            // 1.3. Esperar la respuesta de éxito de la API
            await apiCallPromise;
            
            // 1.4. Verificar el mensaje de éxito en el frontend
            await expect(page.getByText('Se ha enviado un correo electrónico')).toBeVisible();
        });


        // --- PARTE 2: RESTABLECER LA CONTRASEÑA ---
        await test.step('2. Restablecer la contraseña usando el enlace (simulado)', async () => {
            // 2.1. Ir a la URL de restablecimiento directamente
            await page.goto(resetUrl);
            await expect(page.getByRole('heading', { name: 'Restablecer Contraseña' })).toBeVisible();

            // 2.2. Rellenar los campos con la nueva contraseña
            await page.getByRole('textbox', { name: 'Nueva Contraseña' }).fill(NEW_PASSWORD);
            await page.getByRole('textbox', { name: 'Confirmar Contraseña' }).fill(NEW_PASSWORD);
            
            // 2.3. Interceptar la llamada a la API de restablecimiento
            const apiCallPromise = page.waitForResponse(
                (response) => response.url().includes('/api/auth/reset-password') && response.status() === 200
            );

            // 2.4. Enviar el formulario
            await page.getByRole('button', { name: 'Restablecer Contraseña' }).click();
            await apiCallPromise;

            // 2.5. Verificar el mensaje de éxito del restablecimiento
            await expect(page.getByText('✅ ¡Contraseña restablecida con éxito!')).toBeVisible();
            
            // 2.6. Esperar la redirección automática a /login
            await page.waitForURL('/login');
            await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
        });


        // --- PARTE 3: VERIFICACIÓN DEL LOGIN ---
        await test.step('3. Iniciar sesión con la nueva contraseña', async () => {
            // 3.1. Ingresar las nuevas credenciales
            await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL);
            await page.getByRole('textbox', { name: 'Contraseña' }).fill(NEW_PASSWORD);

            // 3.2. Enviar el formulario de login
            await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

            // 3.3. Verificar que el usuario fue redirigido al Home (o a la página de éxito después de login)
            // Asumimos que la página principal es '/'
            await page.waitForURL('/');
            await expect(page).toHaveURL('/');
            
            // Si el login es exitoso, un elemento de la interfaz (ej. el nombre del usuario o un dashboard)
            // debería ser visible. Aquí verificamos el texto del enlace principal como proxy.
            await expect(page.getByRole('link', { name: 'Conecta Barrio' })).toBeVisible();
        });
    });
});
