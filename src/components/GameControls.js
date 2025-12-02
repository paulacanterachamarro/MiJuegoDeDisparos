import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export const GameControls = ({ onMoveLeft, onMoveRight, onStopMove, onShoot }) => {
  return (
    <View style={styles.container}>
      <View style={styles.moveControls}>
        <TouchableOpacity
          style={styles.moveButton}
          onPressIn={onMoveLeft}
          onPressOut={onStopMove}
        >
          <Text style={styles.buttonText}>◀</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.moveButton}
          onPressIn={onMoveRight}
          onPressOut={onStopMove}
        >
          <Text style={styles.buttonText}>▶</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.shootButton}
        onPress={onShoot}
      >
        <Text style={styles.shootButtonText}>DISPARAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  moveControls: {
    flexDirection: 'row',
    gap: 15,
  },
  moveButton: {
    width: 60,
    height: 60,
    backgroundColor: '#222222',
    borderWidth: 3,
    borderColor: COLORS.player,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 24,
    color: COLORS.player,
  },
  shootButton: {
    width: 100,
    height: 60,
    backgroundColor: '#222222',
    borderWidth: 3,
    borderColor: COLORS.enemy,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  shootButtonText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: COLORS.enemy,
    fontWeight: 'bold',
  },
});
