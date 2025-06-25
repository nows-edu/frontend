import { followService } from '@/utils/followService';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type FollowButtonProps = {
  userId: string;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  style?: any;
  disabled?: boolean;
  loading?: boolean;
};

export default function FollowButton({ userId, style, disabled: externalDisabled }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const disabled = externalDisabled || loading;

  useEffect(() => {
    loadFollowStatus();
  }, [userId]);

  const loadFollowStatus = async () => {
    try {
      const status = await followService.getFollowStatus(userId);
      setIsFollowing(status);
      setLoading(false);
    } catch (error) {
      console.error('Error loading follow status:', error);
      setLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await followService.unfollowUser(userId);
      } else {
        await followService.followUser(userId);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
    setLoading(false);
  };

  return (
    <Pressable
      style={[
        styles.button,
        isFollowing && styles.buttonFollowing,
        disabled && styles.buttonDisabled,
        style
      ]}
      onPress={handleToggleFollow}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isFollowing ? "#FFFFFF" : "#000000"} />
      ) : (
        <Text style={[
          styles.buttonText,
          isFollowing && styles.buttonTextFollowing,
          disabled && styles.buttonTextDisabled
        ]}>
          {isFollowing ? 'Siguiendo' : 'Seguir'}
        </Text>
      )}
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#000000',
    fontSize: SCREEN_WIDTH * 0.032,
    fontWeight: '600',
  },
  buttonTextFollowing: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonTextDisabled: {
    opacity: 0.7,
  },
});
