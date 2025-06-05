import type { ChatUser } from '@/types/chat';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.17;
const CARD_HEIGHT = CARD_WIDTH * 1.3;

type RecentNowsProps = {
  users: ChatUser[];
  onUserPress?: (userId: string) => void;
};

export default function RecentNows({ users, onUserPress }: RecentNowsProps) {
  const handlePress = (userId: string) => {
    if (onUserPress) {
      onUserPress(userId);
    } else {
      router.push({
        pathname: '/(tabs)/profile',
        params: { userId }
      });
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {users.map((user) => (
        <Pressable
          key={user.id}
          style={styles.userContainer}
          onPress={() => handlePress(user.id)}
        >
          <View style={styles.cardContainer}>
            <View style={styles.glowEffect} />
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CARD_HEIGHT * 1.3,
    backgroundColor: '#000',
  },
  contentContainer: {
    paddingLeft: SCREEN_WIDTH * 0.05,
    paddingRight: SCREEN_WIDTH * 0.08,
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.03,
  },
  userContainer: {
    alignItems: 'center',
    width: CARD_WIDTH,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: SCREEN_WIDTH * 0.015,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1a1a1a',
  },
  glowEffect: {
    position: 'absolute',
    top: -CARD_HEIGHT / 2,
    left: -CARD_WIDTH / 2,
    width: CARD_WIDTH * 2,
    height: CARD_HEIGHT * 2,
    borderRadius: CARD_WIDTH,
    backgroundColor: 'rgba(122, 154, 236, 0.15)',
    transform: [{ rotate: '45deg' }],
  },
  avatar: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  nameContainer: {
    marginTop: 4,
  },
  name: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: SCREEN_WIDTH * 0.028,
    textAlign: 'center',
  },
});
