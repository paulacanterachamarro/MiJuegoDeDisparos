import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../utils/constants';

export const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    // Animación del título
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simular carga
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadingComplete();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <View style={styles.container}>
      <Animated.Text 
        style={[
          styles.title, 
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        MI JUEGO DE DISPAROS
      </Animated.Text>
      
      <View style={styles.loadingBarContainer}>
        <View style={[styles.loadingBar, { width: `${progress}%` }]} />
      </View>
      
      <Text style={styles.loadingText}>CARGANDO...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'monospace',
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 50,
    textShadowColor: '#8b0000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
    letterSpacing: 4,
  },
  loadingBarContainer: {
    width: 250,
    height: 30,
    borderWidth: 4,
    borderColor: COLORS.player,
    backgroundColor: '#001100',
    marginBottom: 20,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: COLORS.player,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: COLORS.player,
  },
});
