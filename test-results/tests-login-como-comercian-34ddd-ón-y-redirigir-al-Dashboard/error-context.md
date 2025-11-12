# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - main [ref=e13]:
    - generic [ref=e15]:
      - heading "Iniciar Sesión" [level=1] [ref=e16]
      - generic [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]: Email
          - textbox "Email" [ref=e20]:
            - /placeholder: tucorreo@ejemplo.com
            - text: jeon@gmail.com
        - generic [ref=e21]:
          - generic [ref=e22]: Contraseña
          - textbox "Contraseña" [ref=e23]:
            - /placeholder: "********"
            - text: Jungkook97@
        - link "¿Olvidaste tu contraseña?" [ref=e25] [cursor=pointer]:
          - /url: /forgot-password
        - button "Iniciar Sesión" [ref=e26]
      - paragraph [ref=e27]:
        - text: ¿Aún no tienes cuenta?
        - link "Regístrate aquí" [ref=e28] [cursor=pointer]:
          - /url: /registro
```