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
    borderWidth: 1.5,
    borderColor: '#7A9AEC',
    borderRadius: SCREEN_WIDTH * 0.02,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_WIDTH * 0.015,
    minWidth: SCREEN_WIDTH * 0.2,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: SCREEN_WIDTH * 0.04,
  },
  buttonFollowing: {
    backgroundColor: 'rgba(122, 154, 236, 0.2)',
  },
  buttonText: {
    color: '#7A9AEC',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '600',
  },
  buttonTextFollowing: {
    color: '#7A9AEC',
  },
});
