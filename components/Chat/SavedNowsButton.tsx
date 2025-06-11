import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type SavedNowsButtonProps = {
  onPress?: () => void;
};

export default function SavedNowsButton({ onPress }: SavedNowsButtonProps) {  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: '/saved-nows'
      });
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name="bookmark" size={24} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Mis guardados</Text>
        <Text style={styles.subtitle}>Lo que te guardas para más tarde :)</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.6)" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SCREEN_WIDTH * 0.032,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: SCREEN_WIDTH * 0.02,
    marginHorizontal: SCREEN_WIDTH * 0.04,
    borderRadius: SCREEN_WIDTH * 0.02,
  },
  iconContainer: {
    width: SCREEN_WIDTH * 0.09,
    height: SCREEN_WIDTH * 0.09,
    borderRadius: SCREEN_WIDTH * 0.045,
    backgroundColor: '#7A9AEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: SCREEN_WIDTH * 0.03,
  },
  title: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.038,
    fontWeight: '600',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH * 0.033,
  },
});
