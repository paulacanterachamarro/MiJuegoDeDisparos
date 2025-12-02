import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, PLAYER_INITIAL_LIVES } from '../utils/constants';

export const GameHUD = ({ lives, round, score }) => {
  const hearts = useMemo(() => {
    const result = [];
    for (let i = 0; i < PLAYER_INITIAL_LIVES; i++) {
      result.push(i < lives ? '❤️' : '🖤');
    }
    return result;
  }, [lives]);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>VIDAS:</Text>
        <Text style={styles.value}>{hearts.join('')}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>RONDA:</Text>
        <Text style={styles.value}>{round}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>PUNTOS:</Text>
        <Text style={styles.value}>{score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  label: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#888888',
  },
  value: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: COLORS.player,
    fontWeight: 'bold',
  },
});
