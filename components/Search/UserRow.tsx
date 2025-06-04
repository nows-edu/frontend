import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View, Animated } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type UserRowProps = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onPress?: () => void;
};

export default function UserRow({ 
  id,
  name, 
  username, 
  avatarUrl, 
  isFollowing,
  onToggleFollow,
  onPress
}: UserRowProps) {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [prevIsFollowing, setPrevIsFollowing] = useState(isFollowing);

  useEffect(() => {
    if (prevIsFollowing !== isFollowing) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();
      setPrevIsFollowing(isFollowing);
    }
  }, [isFollowing]);

  return (
    <Pressable 
      style={styles.container}
      onPress={onPress || (() => router.push(`/${id}`))}
    >
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.username} numberOfLines={1}>@{username}</Text>
      </View>
      <Pressable        style={[
          styles.button, 
          isFollowing && styles.buttonFollowing,
          { transform: [{ scale: scaleAnim }] }
        ]}
        onPress={(e) => {
          e.stopPropagation();
          onToggleFollow();
        }}
      >
        <Text style={[
          styles.buttonText,
          isFollowing && styles.buttonTextFollowing
        ]}>
          {isFollowing ? 'Siguiendo' : 'Seguir'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SCREEN_WIDTH * 0.03,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  avatar: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: SCREEN_WIDTH * 0.06,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: SCREEN_WIDTH * 0.03,
  },
  name: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '600',
    marginBottom: 2,
  },
  username: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH * 0.03,
  },  button: {
    borderWidth: 1.5,
    borderColor: 'white',
    borderRadius: SCREEN_WIDTH * 0.02,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_WIDTH * 0.015,
    minWidth: SCREEN_WIDTH * 0.2,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonFollowing: {
    backgroundColor: 'rgba(122, 154, 236, 0.2)',
    borderColor: '#7A9AEC',
  },
  buttonText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.031,
    fontWeight: '600',
  },
  buttonTextFollowing: {
    color: '#7A9AEC',
  },
});
