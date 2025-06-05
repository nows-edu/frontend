import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

type ProfileStatsProps = {
  following?: number;
  followers?: number;
  visits?: number;
  showBackground?: boolean;
  userId?: string;
  onPressFollowing?: () => void;
  onPressFollowers?: () => void;
  onPressVisits?: () => void;
};

export default function ProfileStats({
  following = 0,
  followers = 0,
  visits = 0,
  showBackground = true,
  userId,
  onPressFollowing,
  onPressFollowers,
  onPressVisits,
}: ProfileStatsProps) {
  const handlePress = (type: 'following' | 'followers' | 'visits') => {
    if (!userId) return;

    switch (type) {      
      case 'following':
        if (onPressFollowing) onPressFollowing();
        else router.push({ pathname: '/user-list', params: { userId, type: 'following' }});
        break;
      case 'followers':
        if (onPressFollowers) onPressFollowers();
        else router.push({ pathname: '/user-list', params: { userId, type: 'followers' }});
        break;
      case 'visits':
        if (onPressVisits) onPressVisits();
        else router.push({ pathname: '/user-list', params: { userId, type: 'visits' }});
        break;
    }
  };

  return (
    <View
      style={[
        styles.container,
        showBackground && {
          backgroundColor: 'rgba(255,255,255,0.05)',
          padding: SCREEN_WIDTH * 0.03,
          borderRadius: SCREEN_WIDTH * 0.02,
        },
      ]}
    >
      <Pressable
        style={styles.statColumn}
        onPress={() => handlePress('following')}
        disabled={!userId}
      >
        <Text style={styles.numberText}>{formatNumber(following)}</Text>
        <Text style={styles.labelText}>seguidos</Text>
      </Pressable>
      <View style={styles.separator} />
      <Pressable
        style={styles.statColumn}
        onPress={() => handlePress('followers')}
        disabled={!userId}
      >
        <Text style={styles.numberText}>{formatNumber(followers)}</Text>
        <Text style={styles.labelText}>seguidores</Text>
      </Pressable>
      <View style={styles.separator} />
      <Pressable
        style={styles.statColumn}
        onPress={() => handlePress('visits')}
        disabled={!userId}
      >
        <Text style={styles.numberText}>{formatNumber(visits)}</Text>
        <Text style={styles.labelText}>visitas</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SCREEN_WIDTH * 0.04,
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