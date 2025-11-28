# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - main [ref=e13]:
    - generic [ref=e15]:
      - heading "Iniciar Sesión" [level=1] [ref=e16]
      - generic [ref=e17]: No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]: Email
          - textbox "Email" [ref=e21]:
            - /placeholder: tucorreo@ejemplo.com
            - text: cielo@gmail.com
        - generic [ref=e22]:
          - generic [ref=e23]: Contraseña
          - textbox "Contraseña" [ref=e24]:
            - /placeholder: "********"
            - text: Valen123@
        - link "¿Olvidaste tu contraseña?" [ref=e26] [cursor=pointer]:
          - /url: /forgot-password
        - button "Iniciar Sesión" [ref=e27]
      - paragraph [ref=e28]:
        - text: ¿Aún no tienes cuenta?
        - link "Regístrate aquí" [ref=e29] [cursor=pointer]:
          - /url: /registro
```