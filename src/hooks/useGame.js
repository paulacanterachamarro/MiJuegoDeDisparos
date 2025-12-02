import { useState, useRef, useCallback, useEffect } from 'react';
import {
  MAX_ROUNDS,
  PLAYER_INITIAL_LIVES,
  PLAYER_SPEED,
  BULLET_SPEED,
  ENEMY_BULLET_SPEED,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  BULLET_WIDTH,
  BULLET_HEIGHT,
  BASE_ENEMY_HEALTH,
  HEALTH_INCREMENT_PER_ROUND,
  BASE_SHOOT_INTERVAL,
  MIN_SHOOT_INTERVAL,
  INTERVAL_DECREASE_PER_ROUND,
} from '../utils/constants';

const createPlayer = (canvasWidth, canvasHeight) => ({
  x: canvasWidth / 2 - PLAYER_WIDTH / 2,
  y: canvasHeight - PLAYER_HEIGHT - 20,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  speed: PLAYER_SPEED,
  canShoot: true,
});

const createEnemy = (round, canvasWidth) => {
  const maxHealth = BASE_ENEMY_HEALTH + (round - 1) * HEALTH_INCREMENT_PER_ROUND;
  const shootInterval = Math.max(
    MIN_SHOOT_INTERVAL,
    BASE_SHOOT_INTERVAL - (round - 1) * INTERVAL_DECREASE_PER_ROUND
  );
  
  return {
    x: canvasWidth / 2 - ENEMY_WIDTH / 2,
    y: 50,
    width: ENEMY_WIDTH,
    height: ENEMY_HEIGHT,
    speed: 2 + (round - 1) * 0.3,
    direction: 1,
    maxHealth,
    health: maxHealth,
    shootInterval,
    lastShot: Date.now(),
    hitFlash: 0,
  };
};

const checkCollision = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

export const useGame = (canvasWidth, canvasHeight) => {
  const [gameScreen, setGameScreen] = useState('loading'); // loading, playing, victory, defeat
  const [lives, setLives] = useState(PLAYER_INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  
  // Memoize dimensions to prevent unnecessary re-renders
  const dimensionsRef = useRef({ canvasWidth, canvasHeight });
  dimensionsRef.current = { canvasWidth, canvasHeight };
  
  const playerRef = useRef(null);
  const enemyRef = useRef(null);
  const playerBulletsRef = useRef([]);
  const enemyBulletsRef = useRef([]);
  const isRunningRef = useRef(false);
  const playerInvincibleRef = useRef(false);
  const moveDirectionRef = useRef(0); // -1 left, 0 none, 1 right
  const animationFrameRef = useRef(null);
  
  const initGame = useCallback(() => {
    const { canvasWidth, canvasHeight } = dimensionsRef.current;
    playerRef.current = createPlayer(canvasWidth, canvasHeight);
    enemyRef.current = createEnemy(1, canvasWidth);
    playerBulletsRef.current = [];
    enemyBulletsRef.current = [];
    playerInvincibleRef.current = false;
    isRunningRef.current = true;
    setLives(PLAYER_INITIAL_LIVES);
    setScore(0);
    setRound(1);
    setGameScreen('playing');
  }, []);

  const shoot = useCallback(() => {
    if (!playerRef.current || !playerRef.current.canShoot || !isRunningRef.current) return;
    
    const bullet = {
      x: playerRef.current.x + playerRef.current.width / 2 - BULLET_WIDTH / 2,
      y: playerRef.current.y - BULLET_HEIGHT,
      width: BULLET_WIDTH,
      height: BULLET_HEIGHT,
      speed: BULLET_SPEED,
    };
    
    playerBulletsRef.current.push(bullet);
    playerRef.current.canShoot = false;
    
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.canShoot = true;
      }
    }, 300);
  }, []);

  const setMoveDirection = useCallback((direction) => {
    moveDirectionRef.current = direction;
  }, []);

  const nextRound = useCallback(() => {
    setRound((prevRound) => {
      const newRound = prevRound + 1;
      
      if (newRound > MAX_ROUNDS) {
        isRunningRef.current = false;
        setGameScreen('victory');
        return prevRound;
      }
      
      const { canvasWidth } = dimensionsRef.current;
      playerBulletsRef.current = [];
      enemyBulletsRef.current = [];
      enemyRef.current = createEnemy(newRound, canvasWidth);
      
      if (playerRef.current) {
        playerRef.current.x = canvasWidth / 2 - PLAYER_WIDTH / 2;
      }
      
      return newRound;
    });
  }, []);

  const playerHit = useCallback(() => {
    setLives((prevLives) => {
      const newLives = prevLives - 1;
      
      if (newLives <= 0) {
        isRunningRef.current = false;
        setGameScreen('defeat');
      } else {
        playerInvincibleRef.current = true;
        setTimeout(() => {
          playerInvincibleRef.current = false;
        }, 2000);
      }
      
      return newLives;
    });
  }, []);

  const update = useCallback(() => {
    if (!isRunningRef.current) return null;
    
    const { canvasWidth, canvasHeight } = dimensionsRef.current;

    // Update player position
    if (playerRef.current) {
      playerRef.current.x += moveDirectionRef.current * playerRef.current.speed;
      
      // Clamp to boundaries
      if (playerRef.current.x < 0) playerRef.current.x = 0;
      if (playerRef.current.x > canvasWidth - playerRef.current.width) {
        playerRef.current.x = canvasWidth - playerRef.current.width;
      }
    }

    // Update enemy
    if (enemyRef.current) {
      enemyRef.current.x += enemyRef.current.speed * enemyRef.current.direction;
      
      if (enemyRef.current.x <= 0 || enemyRef.current.x >= canvasWidth - enemyRef.current.width) {
        enemyRef.current.direction *= -1;
      }
      
      // Enemy shooting
      if (Date.now() - enemyRef.current.lastShot > enemyRef.current.shootInterval) {
        const bullet = {
          x: enemyRef.current.x + enemyRef.current.width / 2 - BULLET_WIDTH / 2,
          y: enemyRef.current.y + enemyRef.current.height,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          speed: ENEMY_BULLET_SPEED,
        };
        enemyBulletsRef.current.push(bullet);
        enemyRef.current.lastShot = Date.now();
      }
      
      // Reduce hit flash
      if (enemyRef.current.hitFlash > 0) {
        enemyRef.current.hitFlash--;
      }
    }

    // Update player bullets
    playerBulletsRef.current = playerBulletsRef.current.filter((bullet) => {
      bullet.y -= bullet.speed;
      return bullet.y > -BULLET_HEIGHT;
    });

    // Update enemy bullets
    enemyBulletsRef.current = enemyBulletsRef.current.filter((bullet) => {
      bullet.y += bullet.speed;
      return bullet.y < canvasHeight;
    });

    // Check player bullet collisions with enemy
    for (let i = playerBulletsRef.current.length - 1; i >= 0; i--) {
      const bullet = playerBulletsRef.current[i];
      if (enemyRef.current && checkCollision(bullet, enemyRef.current)) {
        playerBulletsRef.current.splice(i, 1);
        enemyRef.current.health--;
        enemyRef.current.hitFlash = 10;
        
        if (enemyRef.current.health <= 0) {
          setScore((prev) => prev + 100 * round);
          nextRound();
        }
      }
    }

    // Check enemy bullet collisions with player
    if (!playerInvincibleRef.current && playerRef.current) {
      for (let i = enemyBulletsRef.current.length - 1; i >= 0; i--) {
        const bullet = enemyBulletsRef.current[i];
        if (checkCollision(bullet, playerRef.current)) {
          enemyBulletsRef.current.splice(i, 1);
          playerHit();
        }
      }
    }

    return {
      player: playerRef.current,
      enemy: enemyRef.current,
      playerBullets: [...playerBulletsRef.current],
      enemyBullets: [...enemyBulletsRef.current],
      isPlayerInvincible: playerInvincibleRef.current,
    };
  }, [round, nextRound, playerHit]);

  const restart = useCallback(() => {
    initGame();
  }, [initGame]);

  const startLoading = useCallback(() => {
    setGameScreen('loading');
    setTimeout(() => {
      initGame();
    }, 2000);
  }, [initGame]);

  return {
    gameScreen,
    lives,
    score,
    round,
    update,
    shoot,
    setMoveDirection,
    restart,
    startLoading,
    isRunning: isRunningRef.current,
    maxRounds: MAX_ROUNDS,
  };
};
