// =====================================
// MI JUEGO DE DISPAROS - Estilo Retro
// =====================================

// Elementos del DOM
const loadingScreen = document.getElementById('loading-screen');
const gameScreen = document.getElementById('game-screen');
const victoryScreen = document.getElementById('victory-screen');
const defeatScreen = document.getElementById('defeat-screen');
const loadingBar = document.getElementById('loading-bar');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Elementos HUD
const livesDisplay = document.getElementById('lives');
const roundDisplay = document.getElementById('round');
const scoreDisplay = document.getElementById('score');
const victoryScoreDisplay = document.getElementById('victory-score');
const defeatScoreDisplay = document.getElementById('defeat-score');
const roundsReachedDisplay = document.getElementById('rounds-reached');

// Botones
const playAgainVictory = document.getElementById('play-again-victory');
const playAgainDefeat = document.getElementById('play-again-defeat');

// Configuración del canvas
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Constantes del juego
const MAX_ROUNDS = 10;
const PLAYER_INITIAL_LIVES = 3;
const PLAYER_SPEED = 6;
const BULLET_SPEED = 10;
const ENEMY_BULLET_SPEED = 5;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 40;
const ENEMY_WIDTH = 50;
const ENEMY_HEIGHT = 40;
const BULLET_WIDTH = 6;
const BULLET_HEIGHT = 15;

// Estado del juego
let gameState = {
    player: null,
    enemy: null,
    playerBullets: [],
    enemyBullets: [],
    lives: PLAYER_INITIAL_LIVES,
    score: 0,
    round: 1,
    isRunning: false,
    keys: {},
    lastEnemyShot: 0,
    enemyDirection: 1,
    playerInvincible: false,
    invincibleTimer: 0
};

// Audio Context para sonidos
let audioContext = null;

// Inicializar Audio Context
function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Generar sonidos retro 8-bit
function playSound(type) {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'shoot':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
            
        case 'enemyHit':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            // Sonido adicional de explosión
            setTimeout(() => {
                if (!audioContext) return;
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.type = 'sawtooth';
                osc2.frequency.setValueAtTime(150, audioContext.currentTime);
                osc2.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.15);
                gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                osc2.start(audioContext.currentTime);
                osc2.stop(audioContext.currentTime + 0.15);
            }, 50);
            break;
            
        case 'playerHit':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.4);
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
            break;
            
        case 'victory':
            playMelody([523, 659, 784, 1047], 0.15, 'square');
            break;
            
        case 'defeat':
            playMelody([392, 330, 262, 196], 0.2, 'sawtooth');
            break;
            
        case 'roundComplete':
            playMelody([440, 554, 659], 0.1, 'square');
            break;
    }
}

// Reproducir melodía
function playMelody(frequencies, noteDuration, waveType) {
    frequencies.forEach((freq, index) => {
        setTimeout(() => {
            if (!audioContext) return;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.type = waveType;
            osc.frequency.setValueAtTime(freq, audioContext.currentTime);
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + noteDuration);
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + noteDuration);
        }, index * noteDuration * 1000);
    });
}

// Música de fondo
let bgMusicInterval = null;
let bgMusicPlaying = false;

function startBackgroundMusic() {
    if (bgMusicPlaying) return;
    bgMusicPlaying = true;
    
    const bassLine = [110, 110, 146, 146, 110, 110, 130, 130];
    let noteIndex = 0;
    
    bgMusicInterval = setInterval(() => {
        if (!audioContext || !gameState.isRunning) return;
        
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(bassLine[noteIndex], audioContext.currentTime);
        gain.gain.setValueAtTime(0.15, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.15);
        
        noteIndex = (noteIndex + 1) % bassLine.length;
    }, 200);
}

function stopBackgroundMusic() {
    bgMusicPlaying = false;
    if (bgMusicInterval) {
        clearInterval(bgMusicInterval);
        bgMusicInterval = null;
    }
}

// Clase Jugador
class Player {
    constructor() {
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.x = CANVAS_WIDTH / 2 - this.width / 2;
        this.y = CANVAS_HEIGHT - this.height - 20;
        this.speed = PLAYER_SPEED;
        this.canShoot = true;
        this.shootCooldown = 300; // ms
    }
    
    update() {
        if (gameState.keys['ArrowLeft'] || gameState.keys['Left']) {
            this.x -= this.speed;
        }
        if (gameState.keys['ArrowRight'] || gameState.keys['Right']) {
            this.x += this.speed;
        }
        
        // Limitar a los bordes
        if (this.x < 0) this.x = 0;
        if (this.x > CANVAS_WIDTH - this.width) this.x = CANVAS_WIDTH - this.width;
    }
    
    draw() {
        // Efecto de parpadeo cuando invencible
        if (gameState.playerInvincible && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }
        
        // Nave del jugador (estilo retro pixelado)
        ctx.fillStyle = '#00ff00';
        
        // Cuerpo principal
        ctx.fillRect(this.x + 15, this.y + 10, 20, 25);
        
        // Punta
        ctx.fillRect(this.x + 20, this.y, 10, 10);
        ctx.fillRect(this.x + 22, this.y - 5, 6, 5);
        
        // Alas
        ctx.fillRect(this.x, this.y + 20, 15, 15);
        ctx.fillRect(this.x + 35, this.y + 20, 15, 15);
        
        // Detalles de las alas
        ctx.fillStyle = '#00cc00';
        ctx.fillRect(this.x + 2, this.y + 22, 8, 8);
        ctx.fillRect(this.x + 40, this.y + 22, 8, 8);
        
        // Motor
        ctx.fillStyle = '#ff6600';
        if (Math.random() > 0.3) {
            ctx.fillRect(this.x + 20, this.y + 35, 10, 8);
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(this.x + 22, this.y + 38, 6, 8);
        }
        
        ctx.globalAlpha = 1;
    }
    
    shoot() {
        if (!this.canShoot) return;
        
        const bullet = {
            x: this.x + this.width / 2 - BULLET_WIDTH / 2,
            y: this.y - BULLET_HEIGHT,
            width: BULLET_WIDTH,
            height: BULLET_HEIGHT,
            speed: BULLET_SPEED
        };
        
        gameState.playerBullets.push(bullet);
        playSound('shoot');
        
        this.canShoot = false;
        setTimeout(() => {
            this.canShoot = true;
        }, this.shootCooldown);
    }
}

// Clase Enemigo
class Enemy {
    constructor(round) {
        this.width = ENEMY_WIDTH;
        this.height = ENEMY_HEIGHT;
        this.x = CANVAS_WIDTH / 2 - this.width / 2;
        this.y = 50;
        this.baseSpeed = 2;
        this.speed = this.baseSpeed + (round - 1) * 0.3;
        this.direction = 1;
        this.maxHealth = 3 + (round - 1) * 2; // Vida aumenta con las rondas
        this.health = this.maxHealth;
        this.shootInterval = Math.max(800, 2000 - (round - 1) * 150); // Dispara más rápido en rondas más altas
        this.lastShot = Date.now();
        this.hitFlash = 0;
    }
    
    update() {
        this.x += this.speed * this.direction;
        
        // Cambiar dirección en los bordes
        if (this.x <= 0 || this.x >= CANVAS_WIDTH - this.width) {
            this.direction *= -1;
        }
        
        // Disparar
        if (Date.now() - this.lastShot > this.shootInterval) {
            this.shoot();
            this.lastShot = Date.now();
        }
        
        // Reducir flash de impacto
        if (this.hitFlash > 0) {
            this.hitFlash--;
        }
    }
    
    draw() {
        // Color base o flash blanco al recibir daño
        const baseColor = this.hitFlash > 0 ? '#ffffff' : '#ff0000';
        
        ctx.fillStyle = baseColor;
        
        // Cuerpo principal (invertido respecto al jugador)
        ctx.fillRect(this.x + 15, this.y + 5, 20, 25);
        
        // Punta (hacia abajo)
        ctx.fillRect(this.x + 20, this.y + 30, 10, 10);
        ctx.fillRect(this.x + 22, this.y + 35, 6, 5);
        
        // Alas
        ctx.fillRect(this.x, this.y + 5, 15, 15);
        ctx.fillRect(this.x + 35, this.y + 5, 15, 15);
        
        // Ojos malvados
        ctx.fillStyle = this.hitFlash > 0 ? '#ff0000' : '#ffff00';
        ctx.fillRect(this.x + 18, this.y + 10, 6, 6);
        ctx.fillRect(this.x + 26, this.y + 10, 6, 6);
        
        // Pupilas
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 20, this.y + 12, 2, 2);
        ctx.fillRect(this.x + 28, this.y + 12, 2, 2);
        
        // Barra de vida
        const healthBarWidth = 50;
        const healthBarHeight = 6;
        const healthBarX = this.x;
        const healthBarY = this.y - 15;
        
        // Fondo de barra
        ctx.fillStyle = '#333333';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        
        // Vida actual
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercent, healthBarHeight);
        
        // Borde de barra
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    }
    
    shoot() {
        const bullet = {
            x: this.x + this.width / 2 - BULLET_WIDTH / 2,
            y: this.y + this.height,
            width: BULLET_WIDTH,
            height: BULLET_HEIGHT,
            speed: ENEMY_BULLET_SPEED
        };
        
        gameState.enemyBullets.push(bullet);
    }
    
    takeDamage() {
        this.health--;
        this.hitFlash = 10;
        
        if (this.health <= 0) {
            return true; // Enemigo derrotado
        }
        return false;
    }
}

// Funciones de dibujo de balas
function drawPlayerBullets() {
    ctx.fillStyle = '#00ff00';
    gameState.playerBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        // Estela
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.fillRect(bullet.x + 1, bullet.y + bullet.height, bullet.width - 2, 8);
        ctx.fillStyle = '#00ff00';
    });
}

function drawEnemyBullets() {
    ctx.fillStyle = '#ff0000';
    gameState.enemyBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        // Estela
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(bullet.x + 1, bullet.y - 8, bullet.width - 2, 8);
        ctx.fillStyle = '#ff0000';
    });
}

// Actualizar balas
function updateBullets() {
    // Balas del jugador
    for (let i = gameState.playerBullets.length - 1; i >= 0; i--) {
        gameState.playerBullets[i].y -= gameState.playerBullets[i].speed;
        
        // Eliminar si sale de la pantalla
        if (gameState.playerBullets[i].y < -BULLET_HEIGHT) {
            gameState.playerBullets.splice(i, 1);
        }
    }
    
    // Balas del enemigo
    for (let i = gameState.enemyBullets.length - 1; i >= 0; i--) {
        gameState.enemyBullets[i].y += gameState.enemyBullets[i].speed;
        
        // Eliminar si sale de la pantalla
        if (gameState.enemyBullets[i].y > CANVAS_HEIGHT) {
            gameState.enemyBullets.splice(i, 1);
        }
    }
}

// Detección de colisiones
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function handleCollisions() {
    // Balas del jugador vs Enemigo
    for (let i = gameState.playerBullets.length - 1; i >= 0; i--) {
        const bullet = gameState.playerBullets[i];
        if (gameState.enemy && checkCollision(bullet, gameState.enemy)) {
            gameState.playerBullets.splice(i, 1);
            
            const defeated = gameState.enemy.takeDamage();
            if (defeated) {
                playSound('enemyHit');
                gameState.score += 100 * gameState.round;
                updateHUD();
                nextRound();
            } else {
                playSound('shoot');
            }
        }
    }
    
    // Balas del enemigo vs Jugador
    if (!gameState.playerInvincible) {
        for (let i = gameState.enemyBullets.length - 1; i >= 0; i--) {
            const bullet = gameState.enemyBullets[i];
            if (gameState.player && checkCollision(bullet, gameState.player)) {
                gameState.enemyBullets.splice(i, 1);
                playerHit();
            }
        }
    }
}

// Jugador recibe daño
function playerHit() {
    playSound('playerHit');
    gameState.lives--;
    updateHUD();
    
    if (gameState.lives <= 0) {
        gameOver();
    } else {
        // Período de invencibilidad
        gameState.playerInvincible = true;
        setTimeout(() => {
            gameState.playerInvincible = false;
        }, 2000);
    }
}

// Siguiente ronda
function nextRound() {
    gameState.round++;
    
    if (gameState.round > MAX_ROUNDS) {
        victory();
        return;
    }
    
    playSound('roundComplete');
    
    // Limpiar balas
    gameState.playerBullets = [];
    gameState.enemyBullets = [];
    
    // Crear nuevo enemigo con más vida
    gameState.enemy = new Enemy(gameState.round);
    
    // Resetear posición del jugador
    gameState.player.x = CANVAS_WIDTH / 2 - gameState.player.width / 2;
    
    updateHUD();
}

// Actualizar HUD
function updateHUD() {
    let hearts = '';
    for (let i = 0; i < gameState.lives; i++) {
        hearts += '❤️';
    }
    for (let i = gameState.lives; i < PLAYER_INITIAL_LIVES; i++) {
        hearts += '🖤';
    }
    livesDisplay.textContent = hearts;
    roundDisplay.textContent = gameState.round;
    scoreDisplay.textContent = gameState.score;
}

// Victoria
function victory() {
    gameState.isRunning = false;
    stopBackgroundMusic();
    playSound('victory');
    
    gameScreen.classList.add('hidden');
    victoryScreen.classList.remove('hidden');
    victoryScoreDisplay.textContent = gameState.score;
}

// Game Over
function gameOver() {
    gameState.isRunning = false;
    stopBackgroundMusic();
    playSound('defeat');
    
    gameScreen.classList.add('hidden');
    defeatScreen.classList.remove('hidden');
    defeatScoreDisplay.textContent = gameState.score;
    roundsReachedDisplay.textContent = gameState.round;
}

// Dibujar estrellas de fondo en el canvas
function drawStars() {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 73) % CANVAS_WIDTH;
        const y = (i * 47 + Date.now() / 50) % CANVAS_HEIGHT;
        const size = (i % 3) + 1;
        ctx.globalAlpha = 0.3 + (Math.sin(Date.now() / 500 + i) + 1) * 0.2;
        ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;
}

// Loop principal del juego
function gameLoop() {
    if (!gameState.isRunning) return;
    
    // Limpiar canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Dibujar estrellas
    drawStars();
    
    // Actualizar
    gameState.player.update();
    if (gameState.enemy) {
        gameState.enemy.update();
    }
    updateBullets();
    handleCollisions();
    
    // Dibujar
    gameState.player.draw();
    if (gameState.enemy) {
        gameState.enemy.draw();
    }
    drawPlayerBullets();
    drawEnemyBullets();
    
    // Información de ronda
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText(`RONDA ${gameState.round} / ${MAX_ROUNDS}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 10);
    
    requestAnimationFrame(gameLoop);
}

// Iniciar juego
function startGame() {
    // Inicializar audio si no está inicializado
    if (!audioContext) {
        initAudio();
    }
    
    // Resetear estado
    gameState = {
        player: new Player(),
        enemy: new Enemy(1),
        playerBullets: [],
        enemyBullets: [],
        lives: PLAYER_INITIAL_LIVES,
        score: 0,
        round: 1,
        isRunning: true,
        keys: {},
        playerInvincible: false
    };
    
    updateHUD();
    startBackgroundMusic();
    gameLoop();
}

// Control de teclado
document.addEventListener('keydown', (e) => {
    gameState.keys[e.key] = true;
    
    if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (gameState.isRunning && gameState.player) {
            gameState.player.shoot();
        }
    }
});

document.addEventListener('keyup', (e) => {
    gameState.keys[e.key] = false;
});

// Botones de reinicio
playAgainVictory.addEventListener('click', () => {
    victoryScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame();
});

playAgainDefeat.addEventListener('click', () => {
    defeatScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame();
});

// Pantalla de carga
function simulateLoading() {
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            loadingBar.style.width = progress + '%';
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                gameScreen.classList.remove('hidden');
                startGame();
            }, 500);
        } else {
            loadingBar.style.width = progress + '%';
        }
    }, 200);
}

// Iniciar cuando se carga la página
window.addEventListener('load', () => {
    simulateLoading();
});

// Manejar pérdida de foco
window.addEventListener('blur', () => {
    gameState.keys = {};
});
