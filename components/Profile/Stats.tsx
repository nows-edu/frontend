import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileStats({
  following = 0,
  followers = 0,
  visits = 0,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.statColumn}>
        <Text style={styles.numberText}>{following}</Text>
        <Text style={styles.labelText}>seguidos</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.statColumn}>
        <Text style={styles.numberText}>{followers}</Text>
        <Text style={styles.labelText}>seguidores</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.statColumn}>
        <Text style={styles.numberText}>{visits}</Text>
        <Text style={styles.labelText}>visitas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SCREEN_WIDTH * 0.05,
  },
  statColumn: {
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.02,
  },
  numberText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.038,
    fontWeight: '600',
    marginBottom: SCREEN_WIDTH * 0.01,
  },
  labelText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.032,
    fontWeight: '400',
  },
  separator: {
    width: 1,
    height: SCREEN_WIDTH * 0.085,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginHorizontal: SCREEN_WIDTH * 0.062,
  },
});