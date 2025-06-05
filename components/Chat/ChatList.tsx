import type { ChatListItem } from '@/types/chat';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ChatListProps = {
  chats: ChatListItem[];
  onChatPress?: (chatId: string) => void;
};

export default function ChatList({ chats, onChatPress }: ChatListProps) {
  const handlePress = (chatId: string) => {
    if (onChatPress) {
      onChatPress(chatId);
    } else {
      router.push({
        pathname: '/chat',
        params: { id: chatId }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis chats</Text>
      {chats.map((chat) => (
        <Pressable
          key={chat.id}
          style={styles.chatRow}
          onPress={() => handlePress(chat.id)}
        >
          <View style={styles.avatarContainer}>
            <Image source={{ uri: chat.avatar }} style={styles.avatar} />
          </View>
          
          <View style={styles.textContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{chat.name}</Text>
              <Text style={styles.dot}>•</Text>
              {chat.subtitle && (
                <Text style={styles.subtitle}>{chat.subtitle}</Text>
              )}
            </View>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {chat.lastMessage}
            </Text>
          </View>
          
          {chat.unreadCount ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{chat.unreadCount}</Text>
            </View>
          ) : <View style={styles.badgePlaceholder} />}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '600',
    marginHorizontal: SCREEN_WIDTH * 0.04,
  },
  chatRow: {
    flexDirection: 'row',
    padding: SCREEN_WIDTH * 0.035,
    paddingLeft: SCREEN_WIDTH * 0.05,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  avatarContainer: {
    marginRight: SCREEN_WIDTH * 0.04,
  },
  avatar: {
    width: SCREEN_WIDTH * 0.11,
    height: SCREEN_WIDTH * 0.11,
    borderRadius: SCREEN_WIDTH * 0.055,
  },
  badge: {
    backgroundColor: '#7A9AEC',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SCREEN_WIDTH * 0.02,
  },
  badgePlaceholder: {
    width: 18,
    marginLeft: SCREEN_WIDTH * 0.02,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  textContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.038,
    fontWeight: '600',
  },
  dot: {
    color: 'rgba(255,255,255,0.3)',
    marginHorizontal: SCREEN_WIDTH * 0.02,
    fontSize: SCREEN_WIDTH * 0.032,
  },
  subtitle: {
    color: '#7A9AEC',
    fontSize: SCREEN_WIDTH * 0.032,
    fontStyle: 'italic',
  },
  lastMessage: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH * 0.034,
    marginTop: 2,
  },
});
