# Assets - Recursos Estáticos

Esta carpeta contiene todos los recursos estáticos de BingoEd.

## 📁 Estructura

```
assets/
├── css/
│   └── styles.css       # Estilos principales de la aplicación
├── js/
│   └── app.js          # Lógica principal del juego
└── images/
    └── (recursos visuales)
```

## 🎨 CSS

- **styles.css**: Contiene todos los estilos de la aplicación
  - Variables CSS para temas
  - Diseño responsive
  - Animaciones y transiciones
  - Modo oscuro y temas de color

## 💻 JavaScript

- **app.js**: Lógica completa del juego
  - Clase BingoApp principal
  - Gestión de estado
  - Multijugador P2P
  - Validación de premios
  - Estadísticas y configuración

## 🖼️ Images

Coloca aquí recursos visuales como:
- Logo de la aplicación
- Iconos personalizados
- Fondos
- Sprites

### Formato Recomendado
- **Logo**: SVG o PNG (512x512px)
- **Iconos**: SVG preferentemente
- **Imágenes**: WebP o PNG optimizados

## 📏 Mejores Prácticas

### CSS
- Usar variables CSS en lugar de valores hardcodeados
- Mobile-first approach
- BEM naming convention (opcional)

### JavaScript
- Documentar funciones complejas
- Mantener funciones puras cuando sea posible
- Usar constantes para valores magic numbers

### Imágenes
- Optimizar antes de agregar
- Usar nombres descriptivos
- Mantener tamaños razonables (<500KB por imagen)

## 🔄 Versionado

Los cambios mayores en estos archivos deben reflejarse en:
- Versión en `app.js` (CONFIG.VERSION)
- Changelog del proyecto
