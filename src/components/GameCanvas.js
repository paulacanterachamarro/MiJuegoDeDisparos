import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS, PLAYER_WIDTH, PLAYER_HEIGHT, ENEMY_WIDTH, ENEMY_HEIGHT } from '../utils/constants';

const { width: screenWidth } = Dimensions.get('window');
const CANVAS_WIDTH = Math.min(screenWidth - 20, 400);
const CANVAS_HEIGHT = CANVAS_WIDTH * 1.5;

const Star = ({ index }) => {
  const x = (index * 73) % CANVAS_WIDTH;
  const baseY = (index * 47) % CANVAS_HEIGHT;
  const size = (index % 3) + 1;
  
  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: baseY,
        width: size,
        height: size,
        backgroundColor: '#ffffff',
        opacity: 0.3 + (index % 5) * 0.1,
      }}
    />
  );
};

const PlayerShip = ({ player, isInvincible }) => {
  if (!player) return null;
  
  const opacity = isInvincible ? 0.5 : 1;
  
  return (
    <View style={[styles.playerContainer, { left: player.x, top: player.y, opacity }]}>
      {/* Punta superior */}
      <View style={[styles.playerTip, { left: 22, top: -5 }]} />
      <View style={[styles.playerTipMid, { left: 20, top: 0 }]} />
      
      {/* Cuerpo principal */}
      <View style={styles.playerBody} />
      
      {/* Alas */}
      <View style={[styles.playerWing, { left: 0 }]} />
      <View style={[styles.playerWing, { left: 35 }]} />
      
      {/* Detalles de las alas */}
      <View style={[styles.playerWingDetail, { left: 2 }]} />
      <View style={[styles.playerWingDetail, { left: 40 }]} />
      
      {/* Motor */}
      <View style={styles.playerMotor} />
      <View style={styles.playerMotorFlame} />
    </View>
  );
};

const EnemyShip = ({ enemy }) => {
  if (!enemy) return null;
  
  const baseColor = enemy.hitFlash > 0 ? '#ffffff' : COLORS.enemy;
  const healthPercent = enemy.health / enemy.maxHealth;
  const healthColor = healthPercent > 0.5 ? COLORS.healthGood : 
                      healthPercent > 0.25 ? COLORS.healthMedium : COLORS.healthLow;
  
  return (
    <View style={[styles.enemyContainer, { left: enemy.x, top: enemy.y }]}>
      {/* Barra de vida */}
      <View style={styles.healthBarBg}>
        <View style={[styles.healthBar, { 
          width: `${healthPercent * 100}%`,
          backgroundColor: healthColor 
        }]} />
      </View>
      
      {/* Cuerpo principal */}
      <View style={[styles.enemyBody, { backgroundColor: baseColor }]} />
      
      {/* Punta inferior */}
      <View style={[styles.enemyTip, { backgroundColor: baseColor }]} />
      <View style={[styles.enemyTipBottom, { backgroundColor: baseColor }]} />
      
      {/* Alas */}
      <View style={[styles.enemyWing, { left: 0, backgroundColor: baseColor }]} />
      <View style={[styles.enemyWing, { left: 35, backgroundColor: baseColor }]} />
      
      {/* Ojos */}
      <View style={[styles.enemyEye, { left: 18 }]} />
      <View style={[styles.enemyEye, { left: 26 }]} />
      
      {/* Pupilas */}
      <View style={[styles.enemyPupil, { left: 20 }]} />
      <View style={[styles.enemyPupil, { left: 28 }]} />
    </View>
  );
};

const Bullet = ({ bullet, isEnemy }) => {
  const color = isEnemy ? COLORS.enemyBullet : COLORS.bullet;
  
  return (
    <View style={[styles.bullet, { 
      left: bullet.x, 
      top: bullet.y,
      backgroundColor: color 
    }]} />
  );
};

export const GameCanvas = ({ gameState }) => {
  if (!gameState) return null;
  
  const { player, enemy, playerBullets, enemyBullets, isPlayerInvincible } = gameState;
  
  return (
    <View style={styles.canvas}>
      {/* Estrellas de fondo */}
      {[...Array(30)].map((_, i) => (
        <Star key={i} index={i} />
      ))}
      
      {/* Balas del jugador */}
      {playerBullets.map((bullet, index) => (
        <Bullet key={`player-bullet-${index}`} bullet={bullet} isEnemy={false} />
      ))}
      
      {/* Balas del enemigo */}
      {enemyBullets.map((bullet, index) => (
        <Bullet key={`enemy-bullet-${index}`} bullet={bullet} isEnemy={true} />
      ))}
      
      {/* Jugador */}
      <PlayerShip player={player} isInvincible={isPlayerInvincible} />
      
      {/* Enemigo */}
      <EnemyShip enemy={enemy} />
    </View>
  );
};

export const getCanvasDimensions = () => ({
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
});

const styles = StyleSheet.create({
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: COLORS.background,
    borderWidth: 4,
    borderColor: COLORS.player,
    position: 'relative',
    overflow: 'hidden',
  },
  playerContainer: {
    position: 'absolute',
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  },
  playerBody: {
    position: 'absolute',
    left: 15,
    top: 10,
    width: 20,
    height: 25,
    backgroundColor: COLORS.player,
  },
  playerTip: {
    position: 'absolute',
    width: 6,
    height: 5,
    backgroundColor: COLORS.player,
  },
  playerTipMid: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: COLORS.player,
  },
  playerWing: {
    position: 'absolute',
    top: 20,
    width: 15,
    height: 15,
    backgroundColor: COLORS.player,
  },
  playerWingDetail: {
    position: 'absolute',
    top: 22,
    width: 8,
    height: 8,
    backgroundColor: COLORS.playerDark,
  },
  playerMotor: {
    position: 'absolute',
    left: 20,
    top: 35,
    width: 10,
    height: 8,
    backgroundColor: COLORS.motorOrange,
  },
  playerMotorFlame: {
    position: 'absolute',
    left: 22,
    top: 38,
    width: 6,
    height: 8,
    backgroundColor: COLORS.motorYellow,
  },
  enemyContainer: {
    position: 'absolute',
    width: ENEMY_WIDTH,
    height: ENEMY_HEIGHT + 15,
  },
  healthBarBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 6,
    backgroundColor: COLORS.healthBar,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  healthBar: {
    height: '100%',
  },
  enemyBody: {
    position: 'absolute',
    left: 15,
    top: 20,
    width: 20,
    height: 25,
  },
  enemyTip: {
    position: 'absolute',
    left: 20,
    top: 45,
    width: 10,
    height: 10,
  },
  enemyTipBottom: {
    position: 'absolute',
    left: 22,
    top: 50,
    width: 6,
    height: 5,
  },
  enemyWing: {
    position: 'absolute',
    top: 20,
    width: 15,
    height: 15,
  },
  enemyEye: {
    position: 'absolute',
    top: 25,
    width: 6,
    height: 6,
    backgroundColor: COLORS.enemyEyes,
  },
  enemyPupil: {
    position: 'absolute',
    top: 27,
    width: 2,
    height: 2,
    backgroundColor: '#000000',
  },
  bullet: {
    position: 'absolute',
    width: 6,
    height: 15,
  },
});
