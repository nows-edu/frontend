import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FollowButtonProps = {
  isFollowing: boolean;
  onToggleFollow: () => void;
  style?: any;
};

export default function FollowButton({ isFollowing, onToggleFollow, style }: FollowButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        isFollowing && styles.buttonFollowing,
        style
      ]}
      onPress={onToggleFollow}
    >
      <Text style={[
        styles.buttonText,
        isFollowing && styles.buttonTextFollowing
      ]}>
        {isFollowing ? 'Siguiendo' : 'Seguir'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: SCREEN_WIDTH * 0.02,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingVertical: SCREEN_WIDTH * 0.01,
    minWidth: SCREEN_WIDTH * 0.18,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonFollowing: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: '#000000',
    fontSize: SCREEN_WIDTH * 0.032,
    fontWeight: '600',
  },
  buttonTextFollowing: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
