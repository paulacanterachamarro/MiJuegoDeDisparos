# Mi Juego de Disparos 🎮

Un videojuego de disparos estilo retro desarrollado con **React Native y Expo**.

## Características

- 🎯 **Controles táctiles**: Botones de movimiento ◀ ▶ y botón de disparo
- 👾 **Enemigos desafiantes**: Los enemigos se mueven horizontalmente y disparan proyectiles
- 📈 **Sistema de rondas**: 10 rondas con dificultad progresiva (los enemigos tienen más vida cada ronda)
- ❤️ **Vidas**: Comienza con 3 vidas
- 🏆 **Puntuación**: Gana puntos por cada enemigo derrotado
- 🎨 **Estilo retro**: Gráficos pixelados con estética arcade de los 80s
- 📱 **Multiplataforma**: Funciona en iOS, Android y Web

## Cómo jugar

1. Inicia la aplicación con Expo
2. Espera a que cargue el juego
3. Usa los botones ◀ ▶ para moverte
4. Presiona el botón DISPARAR para atacar
5. Derrota al enemigo antes de quedarte sin vidas
6. ¡Completa las 10 rondas para ganar!

## Pantallas

- **Pantalla de carga**: Muestra el progreso mientras carga el juego
- **Pantalla de juego**: El campo de batalla con HUD mostrando vidas, ronda y puntuación
- **Pantalla de victoria**: Se muestra al completar las 10 rondas
- **Pantalla de derrota**: Se muestra cuando pierdes todas tus vidas

## Tecnologías

- React Native para la interfaz de usuario
- Expo para desarrollo multiplataforma
- Expo Router para navegación
- React Hooks para gestión de estado

## Instalación

### Requisitos previos

- Node.js (v18 o superior)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app en tu dispositivo móvil (opcional, para pruebas)

### Pasos de instalación

```bash
# Clonar el repositorio
git clone https://github.com/paulacanterachamarro/MiJuegoDeDisparos.git
cd MiJuegoDeDisparos

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

### Ejecutar en diferentes plataformas

```bash
# Iniciar en modo desarrollo (seleccionar plataforma desde terminal)
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en navegador web
npm run web
```

## Estructura del proyecto

```
MiJuegoDeDisparos/
├── app/
│   ├── _layout.js        # Layout principal de Expo Router
│   └── index.js          # Pantalla principal del juego
├── src/
│   ├── components/
│   │   ├── index.js      # Exportaciones de componentes
│   │   ├── GameCanvas.js # Canvas del juego (renderizado)
│   │   ├── GameControls.js # Controles táctiles
│   │   ├── GameHUD.js    # Interfaz de usuario (vidas, puntos)
│   │   ├── LoadingScreen.js # Pantalla de carga
│   │   └── EndScreens.js # Pantallas de victoria/derrota
│   ├── hooks/
│   │   └── useGame.js    # Hook con la lógica del juego
│   └── utils/
│       └── constants.js  # Constantes del juego
├── assets/               # Iconos y recursos
├── app.json              # Configuración de Expo
├── babel.config.js       # Configuración de Babel
├── package.json          # Dependencias del proyecto
└── README.md             # Este archivo
```

## Versión Web Original

Los archivos originales de la versión web (HTML5 Canvas) aún están disponibles:
- `index.html` - Estructura HTML del juego web
- `styles.css` - Estilos retro del juego web
- `game.js` - Lógica del juego web

Para jugar la versión web, simplemente abre `index.html` en un navegador moderno.