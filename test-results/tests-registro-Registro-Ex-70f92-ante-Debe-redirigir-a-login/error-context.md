# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - heading "Registro en Conecta Barrio" [level=1] [ref=e3]
    - generic [ref=e4]:
      - textbox "Nombre" [ref=e5]: Jessica
      - textbox "Apellido" [ref=e6]: Olivares
      - textbox "Email" [ref=e7]: test_registro_1761083400516@conecta-barrio.com
      - generic [ref=e8]: ¿Cómo deseas registrarte?
      - combobox [ref=e9]:
        - option "Vecino/a"
        - option "Comerciante" [selected]
        - option "Profesional"
      - textbox "Contraseña (Mín. 8, Mayús, Núm, Símbolo)" [ref=e10]: Jungkook97@
      - textbox "Confirmar Contraseña" [ref=e11]: Jungkook97@
      - button "Registrarse" [ref=e12] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e18] [cursor=pointer]:
    - img [ref=e19]
  - alert [ref=e22]
```