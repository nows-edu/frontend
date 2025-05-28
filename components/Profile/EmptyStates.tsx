import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const EmptyNows = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Aún no has publicado ningún now</Text>
  </View>
);

export const EmptyAgenda = () => (
  <View style={styles.container}>
    <Text style={styles.text}>No te has apuntado a ningún evento</Text>
  </View>
);

const styles = StyleSheet.create({  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: SCREEN_WIDTH * 0.09,
  },
  text: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH * 0.034,
    textAlign: 'center',
  },
});
