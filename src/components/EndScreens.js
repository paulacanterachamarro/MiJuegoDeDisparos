import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../utils/constants';

export const VictoryScreen = ({ score, onPlayAgain }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡VICTORIA!</Text>
      <Text style={styles.message}>Has completado todas las rondas</Text>
      <Text style={styles.score}>Puntuación final: {score}</Text>
      <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
        <Text style={styles.buttonText}>JUGAR DE NUEVO</Text>
      </TouchableOpacity>
    </View>
  );
};

export const DefeatScreen = ({ score, round, onPlayAgain }) => {
  return (
    <View style={styles.defeatContainer}>
      <Text style={styles.defeatTitle}>GAME OVER</Text>
      <Text style={styles.message}>Has perdido todas tus vidas</Text>
      <Text style={styles.score}>Puntuación final: {score}</Text>
      <Text style={styles.roundsReached}>Llegaste a la ronda: {round}</Text>
      <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
        <Text style={styles.buttonText}>JUGAR DE NUEVO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001100',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  defeatContainer: {
    flex: 1,
    backgroundColor: '#110000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontFamily: 'monospace',
    color: COLORS.player,
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: '#008800',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
  },
  defeatTitle: {
    fontSize: 40,
    fontFamily: 'monospace',
    color: COLORS.enemy,
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: '#880000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
  },
  message: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  score: {
    fontSize: 22,
    fontFamily: 'monospace',
    color: '#ffff00',
    textAlign: 'center',
    marginBottom: 10,
  },
  roundsReached: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#ff6600',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#333333',
    borderWidth: 4,
    borderColor: COLORS.player,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: COLORS.player,
    textAlign: 'center',
    letterSpacing: 2,
  },
});
