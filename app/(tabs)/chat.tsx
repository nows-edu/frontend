import ChatList from '@/components/Chat/ChatList';
import RecentNows from '@/components/Chat/RecentNows';
import SavedNowsButton from '@/components/Chat/SavedNowsButton';
import Header from '@/components/General/Header';
import SearchBar from '@/components/Search/SearchBar';
import type { ChatListItem, ChatUser } from '@/types/chat';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MOCK_RECENT_USERS: ChatUser[] = [
  { id: '1', name: 'Carol', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Aina', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Jofre', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Kerea', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Alba', avatar: 'https://i.pravatar.cc/150?img=5' },
];

const MOCK_CHATS: ChatListItem[] = [
  {
    id: '1',
    name: 'Aina F.C.',
    avatar: 'https://i.pravatar.cc/150?img=2',
    subtitle: 'Imparable',
    lastMessage: '¡Nos vemos mañana!',
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Jan G.S.',
    avatar: 'https://i.pravatar.cc/150?img=3',
    subtitle: 'Techy Boy',
    lastMessage: 'Me parece genial la idea',
    unreadCount: 7,
  },
  {
    id: '3',
    name: 'Melani B.G.',
    avatar: 'https://i.pravatar.cc/150?img=4',
    subtitle: 'Presidenta',
    lastMessage: '¿Podemos hablar un momento?',
    unreadCount: 2,
  },
];

export default function ChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState<ChatListItem[]>(MOCK_CHATS);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredChats(MOCK_CHATS);
      return;
    }
    const filtered = MOCK_CHATS.filter(chat => 
      chat.name.toLowerCase().includes(query.toLowerCase()) ||
      (chat.subtitle && chat.subtitle.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredChats(filtered);
  };

  const handleNowPress = (userId: string) => {
    router.push({
      pathname: '/(tabs)/profile',
      params: { userId }
    });
  };  const handleChatPress = (chat: ChatListItem) => {
    router.push({
      pathname: '/chat',
      params: { 
        id: chat.id,
        name: chat.name,
        avatar: chat.avatar,
        subtitle: chat.subtitle,
        lastMessage: chat.lastMessage
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Los míos"
        points={180}
        onSearchPress={() => router.push('/search')}
      />
      
      <ScrollView style={styles.content}>
        <RecentNows 
          users={MOCK_RECENT_USERS}
          onUserPress={handleNowPress}
        />
          <SavedNowsButton />
        
        <View style={styles.searchContainer}>
          <SearchBar            value={searchQuery}
            onChange={handleSearch}
            placeholder="Busca lo que apetezca..."
          />
        </View>        <ChatList 
          chats={filteredChats}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    marginHorizontal: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_WIDTH * 0.02,
  },
});