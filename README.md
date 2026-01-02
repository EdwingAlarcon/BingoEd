# 🎲 BingoEd - Aplicación de Bingo Virtual Profesional

Una aplicación web moderna y completa para jugar bingo virtual, diseñada tanto para uso personal como empresarial. Con interfaz atractiva, múltiples modos de juego, y características avanzadas de administración.

![BingoEd](https://img.shields.io/badge/Versi%C3%B3n-1.0.0-blue)
![License](https://img.shields.io/badge/Licencia-MIT-green)

## ✨ Características Principales

### � Multijugador en Tiempo Real
- **Modo Anfitrión**: Crea una sala y controla el sorteo
- **Modo Jugador**: Únete a cualquier sala con un código
- **Sincronización P2P**: Tecnología peer-to-peer sin servidor
- **Hasta 30 jugadores**: Juega con amigos, familia o compañeros
- **Ver jugadores conectados**: Lista en tiempo real de participantes
- **Ganadores sincronizados**: Todos ven los ganadores al instante
- 📖 **[Guía completa de Multijugador](MULTIJUGADOR.md)**

### �🎮 Para Jugadores
- **Múltiples Cartones**: Juega con 1-6 cartones simultáneamente
- **Auto-Marcado**: Los números se marcan automáticamente (configurable)
- **5 Modos de Juego**:
  - 🎯 Clásico (Cartón Completo)
  - 📏 Línea Simple
  - 🔲 4 Esquinas
  - 🎨 Patrón Especial
  - ⚫ Apagón Total
- **Sorteo Automático**: Configura la velocidad de sorteo (0.5s - 3s)
- **Interfaz Intuitiva**: Diseño responsive y fácil de usar
- **Animaciones Atractivas**: Efectos visuales suaves y profesionales

### 🎨 Personalización
- **Temas Visuales**: 5 temas de color diferentes
  - Predeterminado
  - Océano
  - Atardecer
  - Bosque
  - Corporativo
- **Modo Oscuro**: Cambia entre tema claro y oscuro
- **Efectos de Sonido**: Sonidos para sorteo y victorias (activable/desactivable)
- **Animaciones**: Opción para habilitar/deshabilitar animaciones

### 👔 Para Empresas y Eventos
- **Panel de Administrador**: Control completo del juego
- **Códigos de Sala**: Genera y comparte códigos únicos para multijugador
- **Gestión de Premios**: Configura premios personalizados
- **Estadísticas Detalladas**:
  - Partidas jugadas
  - Bingos ganados
  - Número más frecuente
  - Tiempo promedio de juego
- **Lista de Ganadores**: Historial de ganadores en tiempo real
- **Impresión de Cartones**: Imprime cartones para eventos físicos
- **Compartir Sala**: Comparte fácilmente códigos de sala

## � Estructura del Proyecto

```
BingoEd/
├── index.html              # Página principal
├── README.md              # Documentación principal
├── assets/                # Recursos estáticos
│   ├── css/
│   │   └── styles.css    # Estilos de la aplicación
│   ├── js/
│   │   └── app.js        # Lógica principal del juego
│   └── images/           # Imágenes y recursos visuales
├── docs/                  # Documentación adicional
│   ├── MULTIJUGADOR.md   # Guía completa de multijugador
│   └── COMO-JUGAR-MULTIJUGADOR.txt  # Guía visual paso a paso
└── .gitignore            # Archivos ignorados por Git
```
📖 **[Ver estructura completa del proyecto](ESTRUCTURA.md)**
## �🚀 Inicio Rápido

### Instalación

1. **Descarga los archivos** o clona el repositorio:
```bash
git clone https://github.com/tuusuario/bingoed.git
cd bingoed
```

2. **Abre el archivo**: Simplemente abre `index.html` en tu navegador favorito:
   - Chrome
   - Firefox
   - Safari
   - Edge

**¡No requiere instalación de dependencias ni servidor!**

### Primer Uso

1. Al abrir la aplicación, verás el **Modal de Configuración**
2. **Selecciona el tipo de juego**:
   - **Solo/Local**: Para jugar individualmente
   - **Multijugador - Crear Sala**: Para ser el anfitrión
   - **Multijugador - Unirse a Sala**: Para unirte a una partida existente
3. Ingresa tu nombre
4. Si te unes a una sala, ingresa el **código compartido por el anfitrión**
5. Selecciona el número de cartones (1-6)
6. Elige el modo de juego
7. Configura las opciones:
   - Auto-marcado de números
   - Velocidad de sorteo (solo anfitrión)
8. Haz clic en **"Iniciar Juego"**

## 🌐 Jugar con Varias Personas

### 🎯 Modo Multijugador

BingoEd incluye **multijugador en tiempo real** usando tecnología P2P (peer-to-peer):

#### Para el Anfitrión 👑
1. Selecciona **"Multijugador - Crear Sala"**
2. Configura el juego y haz clic en "Iniciar"
3. Se generará un **código de sala** (ej: `ABCD-1234`)
4. **Comparte el código** con los demás jugadores por:
   - WhatsApp
   - Email  
   - Mensaje de texto
   - Pantalla compartida
5. ¡Empieza a sortear números cuando todos estén listos!

#### Para Jugadores 🎮
1. Recibe el **código de sala** del anfitrión
2. Selecciona **"Multijugador - Unirse a Sala"**
3. Ingresa el código recibido
4. Configura tus cartones
5. ¡Espera a que el anfitrión sortee números!

**Ver estado de conexión**: En la esquina superior derecha verás si estás conectado (🟢 verde para jugadores, 🟡 amarillo para anfitrión).

📖 **[Lee la guía completa de multijugador aquí](docs/MULTIJUGADOR.md)**

### Características del Multijugador
- ✅ Sin servidor necesario (P2P)
- ✅ Gratis y sin registro
- ✅ Números sincronizados en tiempo real
- ✅ Ver jugadores conectados
- ✅ Ganadores anunciados a todos
- ✅ Hasta 30 jugadores simultáneos
- ✅ Funciona en cualquier dispositivo

## 🎯 Cómo Jugar

### Controles Básicos

#### Sortear Números
- **Botón "Sortear Número"**: Sortea un número manualmente
- **Botón "Auto Sorteo"**: Inicia el sorteo automático
- **Tecla Espacio**: Atajo para sortear (durante el juego)

#### Marcar Cartones
- Si el **auto-marcado está activado**: Los números se marcan automáticamente
- Si está **desactivado**: Haz clic en las celdas para marcarlas manualmente

#### Verificar Bingo
- **Verificación Automática**: El sistema verifica automáticamente después de cada marcado
- **Botón "Verificar Bingo"**: Verifica manualmente todos los cartones

### Modos de Juego

#### 🎯 Clásico (Cartón Completo)
Completa todos los números de un cartón para ganar.

#### 📏 Línea Simple
Completa una línea horizontal, vertical o diagonal.

#### 🔲 4 Esquinas
Marca las cuatro esquinas del cartón.

#### 🎨 Patrón Especial
Completa un patrón específico (personalizable).

#### ⚫ Apagón Total
Igual que el clásico, completa todo el cartón.

## 🎨 Panel de Administrador

Accede al panel haciendo clic en el botón **"Administrador"** en la esquina superior derecha.

### Pestañas del Panel

#### 📱 Sala
- Genera códigos de sala únicos
- Visualiza jugadores conectados
- Gestiona la sesión actual

#### 🏆 Premios
- Configura premios para:
  - Primera línea
  - Segunda línea
  - Bingo completo

#### 📊 Estadísticas
- **Partidas Jugadas**: Contador total de partidas
- **Bingos Ganados**: Total de victorias
- **Número Más Frecuente**: Estadística de números sorteados
- **Tiempo Promedio**: Duración media de las partidas

#### ⚙️ Configuración
- Cambiar tema de color
- Habilitar/deshabilitar animaciones
- Habilitar chat (para uso empresarial)
- Resetear estadísticas

## 📱 Responsive Design

BingoEd se adapta perfectamente a cualquier dispositivo:

- 💻 **Desktop**: Experiencia completa con múltiples paneles
- 📱 **Tablet**: Layout optimizado para pantallas medianas
- 📱 **Móvil**: Interfaz simplificada para móviles

## 🎨 Personalización Avanzada

### Cambiar Temas de Color

Los temas se pueden cambiar desde el panel de administrador:

```javascript
// En app.js, puedes modificar las variables CSS
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --accent-color: #f59e0b;
}
```

### Agregar Nuevos Modos de Juego

En el archivo `app.js`, busca la función `checkWin()` y agrega tu lógica personalizada:

```javascript
case 'tuModo':
    won = this.checkTuModo(card);
    winType = 'Tu Modo Personalizado';
    break;
```

## 🔧 Características Técnicas

### Tecnologías Utilizadas
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con variables CSS y animaciones
- **JavaScript (ES6+)**: Lógica del juego orientada a objetos
- **PeerJS**: Conexiones peer-to-peer para multijugador
- **WebRTC**: Comunicación en tiempo real entre navegadores
- **Font Awesome**: Iconos profesionales
- **LocalStorage**: Persistencia de estadísticas

### Compatibilidad
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Rendimiento
- **Carga rápida**: Sin dependencias externas pesadas
- **Optimizado**: Uso eficiente de memoria
- **Sin lag**: Animaciones suaves con CSS transitions

## 📋 Casos de Uso

### 🏠 Uso Personal
- Juegos familiares (cada uno en su dispositivo)
- Entretenimiento en casa con invitados
- Práctica de bingo
- **Nuevo**: Familia distribuida jugando juntos online

### 👔 Uso Empresarial
- **Eventos corporativos**: Team building y actividades remotas o presenciales
- **Marketing**: Promociones y sorteos en vivo
- **Educación**: Herramienta educativa interactiva con múltiples estudiantes
- **Entretenimiento**: Bares, restaurantes, centros comunitarios
- **Reuniones virtuales**: Rompe hielos y dinámicas de grupo

### 🎉 Eventos Especiales
- Fiestas de cumpleaños virtuales o presenciales
- Reuniones familiares (incluso si algunos están lejos)
- Eventos benéficos con múltiples participantes
- Recaudación de fondos
- **Baby showers / Despedidas** con invitados remotos

### 🌍 Casos de Uso Multijugador
- **Familia en diferentes ciudades**: Todos juegan juntos virtualmente
- **Oficina híbrida**: Algunos en oficina, otros remotos
- **Eventos con audiencia grande**: Un anfitrión, múltiples jugadores
- **Torneos organizados**: Múltiples rondas con ganadores
- **Clases online**: Profesores como anfitriones, estudiantes como jugadores

## 🔐 Privacidad y Datos

- **Sin servidor**: Toda la lógica se ejecuta en el navegador
- **Sin recopilación de datos**: No se envía información a servidores externos
- **LocalStorage**: Las estadísticas se guardan localmente en tu dispositivo

## 🎯 Roadmap Futuro

### Próximas Características
- [x] ✅ Modo multijugador en línea (P2P)
- [ ] Chat integrado entre jugadores
- [ ] Más patrones de bingo
- [ ] Salas persistentes con servidor dedicado
- [ ] Exportación de estadísticas a CSV/PDF
- [ ] Modo torneo con múltiples rondas
- [ ] Videollamada integrada
- [ ] Integración con pagos para premios reales
- [ ] Aplicación móvil nativa (PWA)
- [ ] Soporte para múltiples idiomas
- [ ] Soporte para más de 75 jugadores (con servidor)

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar BingoEd:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

📖 Lee nuestra [Guía de Contribución](CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

Creado con ❤️ para hacer el bingo más divertido y accesible.

**BingoEd Team** - 2026

## 🌟 Características del Código

### Buenas Prácticas Implementadas
- ✅ **Código modular**: Organización en clases y métodos
- ✅ **Constantes configurables**: Fácil personalización
- ✅ **Comentarios descriptivos**: Código autodocumentado
- ✅ **Manejo de errores**: Try-catch en operaciones críticas
- ✅ **Responsive design**: Mobile-first approach
- ✅ **Accesibilidad**: HTML semántico y ARIA labels
- ✅ **Performance**: Uso eficiente de memoria y DOM
- ✅ **Seguridad**: Validación de entradas

### Tecnologías y Patrones
- **POO**: Programación Orientada a Objetos
- **ES6+**: JavaScript moderno
- **CSS Variables**: Temas dinámicos
- **LocalStorage**: Persistencia de datos
- **Event Delegation**: Manejo eficiente de eventos
- **WebRTC/PeerJS**: Comunicación P2P

## 🙏 Agradecimientos

- Font Awesome por los iconos
- La comunidad de desarrolladores web
- Todos los jugadores de bingo del mundo 🎉

## 📞 Soporte

¿Tienes preguntas o problemas?
- Abre un issue en GitHub
- Revisa la documentación
- Contacta al equipo de desarrollo

---

**¡Disfruta jugando BingoEd!** 🎲🎉

*Haz del bingo una experiencia digital inolvidable*
