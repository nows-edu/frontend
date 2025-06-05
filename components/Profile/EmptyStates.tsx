import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type EmptyNowsProps = {
  isOwnProfile?: boolean;
};

export const EmptyNows = ({ isOwnProfile = true }: EmptyNowsProps) => (
  <View style={styles.container}>
    <Text style={styles.text}>
      {isOwnProfile 
        ? 'Aún no has publicado ningún now :('
        : 'Aún no ha publicado ningún now'}
    </Text>
  </View>
);

type EmptyAgendaProps = {
  text?: string;
};

export const EmptyAgenda = ({ text }: EmptyAgendaProps) => (
  <View style={styles.container}>
    <Text style={styles.text}>
      {text || 'No te has apuntado a ningún evento.'}
    </Text>
  </View>
);

const styles = StyleSheet.create({  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: SCREEN_WIDTH * 0.15,
  },
  text: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH * 0.034,
    textAlign: 'center',
  },
});
