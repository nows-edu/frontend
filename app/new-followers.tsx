import FollowButton from '@/components/Profile/FollowButton';
import { followService } from '@/utils/followService';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Using the same Notification type from notifications.tsx
type NotificationType = 'follow' | 'like' | 'comment';

interface Notification {
  id: string;
  type: NotificationType;
  timestamp: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isFollowing?: boolean;
  };
}

// Mock followers for development
const MOCK_FOLLOWERS: Notification[] = [
  {
    id: '1',
    type: 'follow',
    timestamp: '2h',
    user: {
      id: 'user1',
      name: 'Elena García',
      username: '@elena',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isFollowing: false
    }
  },
  {
    id: '2',
    type: 'follow',
    timestamp: '3h',
    user: {
      id: 'user2',
      name: 'Marc Pérez',
      username: '@marc',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isFollowing: true
    }
  },
  {
    id: '3',
    type: 'follow',
    timestamp: '5h',
    user: {
      id: 'user3',
      name: 'Paula Torres',
      username: '@paula',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isFollowing: false
    }
  }
];

const NewFollowersScreen = () => {  const [followers, setFollowers] = useState<Notification[]>(MOCK_FOLLOWERS);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingFollowId, setUpdatingFollowId] = useState<string | null>(null);
  const currentUserId = 'carol'; // TODO: Get from auth context when implemented
  const handleToggleFollow = async (targetUserId: string) => {
    try {
      setUpdatingFollowId(targetUserId);
      const followerToUpdate = followers.find(f => f.user.id === targetUserId);
      if (!followerToUpdate) {
        console.error('User not found in followers list');
        return;
      }

      if (followerToUpdate.user.isFollowing) {
        await followService.unfollowUser(currentUserId, targetUserId);
      } else {
        await followService.followUser(currentUserId, targetUserId);
      }

      setFollowers(prev => 
        prev.map(follower => 
          follower.user.id === targetUserId 
            ? { ...follower, user: { ...follower.user, isFollowing: !follower.user.isFollowing }}
            : follower
        )
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
      // TODO: Add error toast when toast system is implemented
    } finally {
      setUpdatingFollowId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={24}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Nuevos seguidores</Text>
        <View style={styles.backButton} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#7A9AEC" size="large" />
        </View>
      ) : followers.length > 0 ? (
        <ScrollView style={styles.content}>          {followers.map(follower => (
            <View key={follower.id} style={styles.followerItem}>
              <Pressable
                style={styles.followerContent}
                onPress={() => router.push({
                  pathname: '/(tabs)/profile',
                  params: { userId: follower.user.id }
                })}
                android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
              >
                <Image 
                  source={{ uri: follower.user.avatar }} 
                  style={styles.avatar} 
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{follower.user.name}</Text>
                  <Text style={styles.userUsername}>{follower.user.username}</Text>
                </View>                <FollowButton
                  isFollowing={follower.user.isFollowing || false}
                  onToggleFollow={() => handleToggleFollow(follower.user.id)}
                  style={styles.followButton}
                  disabled={updatingFollowId === follower.user.id}
                  loading={updatingFollowId === follower.user.id}
                />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="group" size={SCREEN_WIDTH * 0.15} color="#7A9AEC" />
          <Text style={styles.emptyText}>No hay nuevos seguidores</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SCREEN_WIDTH * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    width: SCREEN_WIDTH * 0.12,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SCREEN_WIDTH * 0.08,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_WIDTH * 0.04,
  },  followerItem: {
    paddingVertical: SCREEN_WIDTH * 0.035,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  followerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SCREEN_WIDTH * 0.02,
  },
  avatar: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: SCREEN_WIDTH * 0.06,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  userInfo: {
    marginLeft: SCREEN_WIDTH * 0.03,
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.038,
    fontWeight: '600',
    marginBottom: 2,
  },
  userUsername: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH * 0.032,
  },
  followButton: {
    minWidth: SCREEN_WIDTH * 0.22,
    marginLeft: SCREEN_WIDTH * 0.03,
  },
});

export default NewFollowersScreen;
