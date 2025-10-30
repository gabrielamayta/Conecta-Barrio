# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e7]:
      - img [ref=e8]
    - generic [ref=e11]:
      - button "Open issues overlay" [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: "0"
          - generic [ref=e15]: "1"
        - generic [ref=e16]: Issue
      - button "Collapse issues badge" [ref=e17]:
        - img [ref=e18]
  - alert [ref=e20]
  - main [ref=e22]:
    - generic [ref=e24]:
      - heading "Iniciar Sesión" [level=1] [ref=e25]
      - generic [ref=e26]:
        - generic [ref=e27]:
          - generic [ref=e28]: Email
          - textbox "Email" [ref=e29]:
            - /placeholder: tucorreo@ejemplo.com
        - generic [ref=e30]:
          - generic [ref=e31]: Contraseña
          - textbox "Contraseña" [ref=e32]:
            - /placeholder: "********"
        - link "¿Olvidaste tu contraseña?" [ref=e34] [cursor=pointer]:
          - /url: /forgot-password
        - button "Iniciar Sesión" [ref=e35]
      - paragraph [ref=e36]:
        - text: ¿Aún no tienes cuenta?
        - link "Regístrate aquí" [ref=e37] [cursor=pointer]:
          - /url: /registro
```