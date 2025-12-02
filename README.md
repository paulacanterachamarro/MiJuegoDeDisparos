# Mi Juego de Disparos 🎮

Un videojuego de disparos estilo retro desarrollado con HTML5 Canvas y JavaScript.

## Características

- 🎯 **Controles intuitivos**: Muévete con las flechas ← → y dispara con ESPACIO
- 👾 **Enemigos desafiantes**: Los enemigos se mueven horizontalmente y disparan proyectiles
- 📈 **Sistema de rondas**: 10 rondas con dificultad progresiva (los enemigos tienen más vida cada ronda)
- ❤️ **Vidas**: Comienza con 3 vidas
- 🏆 **Puntuación**: Gana puntos por cada enemigo derrotado
- 🎨 **Estilo retro**: Gráficos pixelados con estética arcade de los 80s
- 🎵 **Audio 8-bit**: Música de fondo y efectos de sonido generados proceduralmente

## Cómo jugar

1. Abre `index.html` en tu navegador
2. Espera a que cargue el juego
3. Usa las flechas ← → para moverte
4. Presiona ESPACIO para disparar
5. Derrota al enemigo antes de quedarte sin vidas
6. ¡Completa las 10 rondas para ganar!

## Pantallas

- **Pantalla de carga**: Muestra el progreso mientras carga el juego
- **Pantalla de juego**: El campo de batalla con HUD mostrando vidas, ronda y puntuación
- **Pantalla de victoria**: Se muestra al completar las 10 rondas
- **Pantalla de derrota**: Se muestra cuando pierdes todas tus vidas

## Tecnologías

- HTML5 Canvas para renderizado de gráficos
- CSS3 para estilos y animaciones
- JavaScript vanilla para la lógica del juego
- Web Audio API para sonidos 8-bit

## Instalación

No requiere instalación. Simplemente clona o descarga el repositorio y abre `index.html` en un navegador moderno.

```bash
git clone https://github.com/paulacanterachamarro/MiJuegoDeDisparos.git
cd MiJuegoDeDisparos
# Abre index.html en tu navegador
```

## Estructura del proyecto

```
MiJuegoDeDisparos/
├── index.html    # Estructura HTML del juego
├── styles.css    # Estilos retro del juego
├── game.js       # Lógica del juego
└── README.md     # Este archivo
```