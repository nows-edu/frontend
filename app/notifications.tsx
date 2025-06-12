import FollowButton from '@/components/Profile/FollowButton';
import { followService } from '@/utils/followService';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  nowId?: string;
  nowThumbnail?: string;
  comment?: string;
}

// Mock notifications for development
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'follow',
    timestamp: '2h',
    user: {
      id: 'user1',
      name: 'Elena',
      username: '@elena',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isFollowing: false
    }
  },
  {
    id: '2',
    type: 'like',
    timestamp: '3h',
    user: {
      id: 'user2',
      name: 'Marc',
      username: '@marc',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isFollowing: true
    },
    nowId: 'now1',
    nowThumbnail: 'https://picsum.photos/200/300'
  },
  {
    id: '3',
    type: 'comment',
    timestamp: '5h',
    user: {
      id: 'user3',
      name: 'Paula',
      username: '@paula',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isFollowing: false
    },
    nowId: 'now2',
    nowThumbnail: 'https://picsum.photos/200/301',
    comment: '¡Me encanta tu punto de vista! 👏'
  }
];

const NotificationsScreen: React.FC = () => {
  const [showFollowers, setShowFollowers] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS.filter(n => n.type !== 'follow'));
  const [followers, setFollowers] = useState<Notification[]>(MOCK_NOTIFICATIONS.filter(n => n.type === 'follow'));
  const [isLoading, setIsLoading] = useState(false);
  const currentUserId = 'carol'; // Hardcoded for now

  const handleToggleFollow = async (targetUserId: string) => {
    try {
      const userToUpdate = followers.find(n => n.user.id === targetUserId);
      if (!userToUpdate) return;

      if (userToUpdate.user.isFollowing) {
        await followService.unfollowUser(currentUserId, targetUserId);
      } else {
        await followService.followUser(currentUserId, targetUserId);
      }

      setFollowers(prev => 
        prev.map(notif => 
          notif.user.id === targetUserId 
            ? { ...notif, user: { ...notif.user, isFollowing: !notif.user.isFollowing }}
            : notif
        )
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const renderNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case 'follow':
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.userName}>{notification.user.name}</Text>
            {' ha comenzado a seguirte'}
          </Text>
        );
      case 'like':
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.userName}>{notification.user.name}</Text>
            {' ha dado me gusta a tu now'}
          </Text>
        );
      case 'comment':
        return (
          <View>
            <Text style={styles.notificationText}>
              <Text style={styles.userName}>{notification.user.name}</Text>
              {' ha comentado en tu now'}
            </Text>
            <Text style={styles.commentText}>{notification.comment}</Text>
          </View>
        );
    }
  };
  const renderNotification = (notification: Notification) => (
    <Pressable 
      style={styles.notificationItem}
      onPress={() => {
        if (notification.nowId) {
          router.push({
            pathname: '/(tabs)/home',
            params: { nowId: notification.nowId }
          });
        }
      }}
      android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
    >
      <Pressable
        style={styles.userInfo}
        onPress={(e) => {
          e.stopPropagation();
          router.push({
            pathname: '/(tabs)/profile',
            params: { userId: notification.user.id }
          });
        }}
      >
        <Image 
          source={{ uri: notification.user.avatar }} 
          style={styles.avatar} 
        />
        <View style={styles.notificationContent}>
          {renderNotificationContent(notification)}
          <Text style={styles.timestamp}>{notification.timestamp}</Text>
        </View>
      </Pressable>

      {notification.nowId && notification.nowThumbnail && (
        <View style={styles.nowPreview}>
          <Image 
            source={{ uri: notification.nowThumbnail }} 
            style={styles.nowThumbnail} 
          />
        </View>
      )}
    </Pressable>
  );
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
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={styles.backButton} />
      </View>      <Pressable 
        style={styles.followersButton}
        onPress={() => router.push('/new-followers')}
        android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
      >
        <View style={styles.followersContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="group-add" size={26} color="#7A9AEC" />
          </View>
          <View style={styles.followersInfo}>            <Text style={styles.followersText}>
              <Text style={styles.followersCount}>3 </Text>
              nuevos seguidores
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.6)" />
        </View>
      </Pressable>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#7A9AEC" size="large" />
        </View>
      ) : showFollowers ? (
        <>
          <View style={styles.subHeader}>
            <IconButton
              icon="arrow-left"
              iconColor="white"
              size={24}
              onPress={() => setShowFollowers(false)}
              style={styles.backButton}
            />
            <Text style={styles.subHeaderTitle}>Nuevos seguidores</Text>
            <View style={styles.backButton} />
          </View>
          <ScrollView style={styles.content}>
            {followers.map(follower => (
              <View key={follower.id} style={styles.followerItem}>
                <Pressable
                  style={styles.userInfo}
                  onPress={() => router.push({
                    pathname: '/(tabs)/profile',
                    params: { userId: follower.user.id }
                  })}
                >
                  <Image 
                    source={{ uri: follower.user.avatar }} 
                    style={styles.followerAvatar} 
                  />
                  <View style={styles.followerInfo}>
                    <Text style={styles.userName}>{follower.user.name}</Text>
                    <Text style={styles.userUsername}>{follower.user.username}</Text>
                  </View>
                </Pressable>
                <FollowButton
                  isFollowing={follower.user.isFollowing || false}
                  onToggleFollow={() => handleToggleFollow(follower.user.id)}
                  style={styles.followButton}
                />
              </View>
            ))}
          </ScrollView>
        </>
      ) : notifications.length > 0 ? (
        <ScrollView style={styles.content}>
          {notifications.map(renderNotification)}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={SCREEN_WIDTH * 0.15} color="#7A9AEC" />
          <Text style={styles.emptyText}>No tienes notificaciones</Text>
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
  },  followersButton: {
    paddingVertical: SCREEN_WIDTH * 0.035,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  followersContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconContainer: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: SCREEN_WIDTH * 0.06,
    backgroundColor: 'rgba(122, 154, 236, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SCREEN_WIDTH * 0.03,
  },
  followersInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: SCREEN_WIDTH * 0.03,
  },
  followersText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: SCREEN_WIDTH * 0.035,
  },
  followersCount: {
    color: '#7A9AEC',
    fontWeight: '600',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SCREEN_WIDTH * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  subHeaderTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SCREEN_WIDTH * 0.03,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  followerAvatar: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: SCREEN_WIDTH * 0.06,
  },
  followerInfo: {
    marginLeft: SCREEN_WIDTH * 0.03,
  },
  userUsername: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH * 0.032,
    marginTop: 2,
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
  },  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SCREEN_WIDTH * 0.035,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: SCREEN_WIDTH * 0.11,
    height: SCREEN_WIDTH * 0.11,
    borderRadius: SCREEN_WIDTH * 0.055,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  notificationContent: {
    flex: 1,
    marginLeft: SCREEN_WIDTH * 0.03,
  },
  notificationText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: SCREEN_WIDTH * 0.033,
    lineHeight: SCREEN_WIDTH * 0.045,
  },
  userName: {
    fontWeight: '600',
    color: '#7A9AEC',
  },
  commentText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.032,
    marginTop: SCREEN_WIDTH * 0.01,
    fontStyle: 'italic',
  },
  timestamp: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: SCREEN_WIDTH * 0.028,
    marginTop: SCREEN_WIDTH * 0.01,
  },  nowPreview: {
    marginLeft: SCREEN_WIDTH * 0.03,
    borderRadius: SCREEN_WIDTH * 0.02,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  nowThumbnail: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: SCREEN_WIDTH * 0.02,
  },
  followButton: {
    marginLeft: SCREEN_WIDTH * 0.03,
  },
});

export default NotificationsScreen;