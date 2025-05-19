import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileNameProps {
  name: string;
  username: string;
}

const ProfileName: React.FC<ProfileNameProps> = ({ name, username }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.username}>@{username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_WIDTH * 0.06, // Equivalente a ~30 en una pantalla de 375px
  },
  name: {
    fontSize: SCREEN_WIDTH * 0.042, // Equivalente a ~18 en una pantalla de 375px
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: SCREEN_WIDTH * 0.01, // Equivalente a ~4 en una pantalla de 375px
  },
  username: {
    fontSize: SCREEN_WIDTH * 0.03, // Equivalente a ~13 en una pantalla de 375px
    color: '#888888',
  },
});

export default ProfileName;
