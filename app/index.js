import React, { useEffect, useCallback, useRef, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import {
  GameCanvas,
  getCanvasDimensions,
  LoadingScreen,
  VictoryScreen,
  DefeatScreen,
  GameHUD,
  GameControls,
} from '../src/components';
import { useGame } from '../src/hooks/useGame';

export default function Game() {
  const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = getCanvasDimensions();
  
  const {
    gameScreen,
    lives,
    score,
    round,
    update,
    shoot,
    setMoveDirection,
    restart,
    startLoading,
    maxRounds,
  } = useGame(CANVAS_WIDTH, CANVAS_HEIGHT);

  const [gameState, setGameState] = useState(null);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Game loop
  useEffect(() => {
    if (gameScreen !== 'playing') return;

    const gameLoop = (timestamp) => {
      if (timestamp - lastTimeRef.current >= 16) { // ~60 FPS
        const state = update();
        if (state) {
          setGameState(state);
        }
        lastTimeRef.current = timestamp;
      }
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameScreen, update]);

  // Start loading on mount
  useEffect(() => {
    startLoading();
  }, []);

  const handleMoveLeft = useCallback(() => {
    setMoveDirection(-1);
  }, [setMoveDirection]);

  const handleMoveRight = useCallback(() => {
    setMoveDirection(1);
  }, [setMoveDirection]);

  const handleStopMove = useCallback(() => {
    setMoveDirection(0);
  }, [setMoveDirection]);

  const handleShoot = useCallback(() => {
    shoot();
  }, [shoot]);

  const handlePlayAgain = useCallback(() => {
    restart();
  }, [restart]);

  const handleLoadingComplete = useCallback(() => {
    // Loading complete is handled by startLoading internally
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      {gameScreen === 'loading' && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}
      
      {gameScreen === 'playing' && (
        <View style={styles.gameContainer}>
          <GameHUD lives={lives} round={round} score={score} />
          <View style={styles.canvasContainer}>
            <GameCanvas gameState={gameState} />
          </View>
          <GameControls
            onMoveLeft={handleMoveLeft}
            onMoveRight={handleMoveRight}
            onStopMove={handleStopMove}
            onShoot={handleShoot}
          />
        </View>
      )}
      
      {gameScreen === 'victory' && (
        <VictoryScreen score={score} onPlayAgain={handlePlayAgain} />
      )}
      
      {gameScreen === 'defeat' && (
        <DefeatScreen score={score} round={round} onPlayAgain={handlePlayAgain} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  canvasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
