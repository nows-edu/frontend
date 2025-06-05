
import SearchBar from '@/components/Search/SearchBar';
import UserRow from '@/components/Search/UserRow';
import { User, followService } from '@/utils/followService';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDebouncedCallback } from 'use-debounce';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type UserWithFollowState = User & {
  isFollowing?: boolean;
};

const UserListScreen = () => {
  // Hide the default header
  React.useEffect(() => {
    router.setParams({ header: 'none' });
  }, []);

  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const type = params.type as 'following' | 'followers' | 'visits';
  const currentUserId = 'carol'; // Current user ID

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [users, setUsers] = useState<UserWithFollowState[]>([]);

  // Load users based on type
  const loadUsers = useCallback(async () => {
    try {
      let fetchedUsers: User[] = [];
      switch (type) {
        case 'following':
          fetchedUsers = await followService.getFollowing(userId);
          break;
        case 'followers':
          fetchedUsers = await followService.getFollowers(userId);
          break;
        case 'visits':
          fetchedUsers = await followService.getVisits(userId);
          break;
      }

      const usersWithState = await Promise.all(
        fetchedUsers.map(async (user: User) => ({
          ...user,
          isFollowing: await followService.isFollowing(currentUserId, user.id)
        }))
      );
      setUsers(usersWithState);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, [type, userId]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleFollow = async (targetUserId: string) => {
    try {
      const userToUpdate = users.find(u => u.id === targetUserId);
      if (!userToUpdate) return;

      if (userToUpdate.isFollowing) {
        await followService.unfollowUser(currentUserId, targetUserId);
      } else {
        await followService.followUser(currentUserId, targetUserId);
      }

      setUsers(prev => 
        prev.map(user => 
          user.id === targetUserId 
            ? { ...user, isFollowing: !user.isFollowing }
            : user
        )
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const debouncedSearch = useDebouncedCallback(
    (searchQuery: string) => {
      setIsSearching(false);
    },
    500
  );

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (text.trim()) {
      setIsSearching(true);
      debouncedSearch(text);
    }
  }, []);

  const filteredUsers = query.trim()
    ? users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      )
    : users;

  const getTitle = () => {
    switch (type) {
      case 'following':
        return 'Seguidos';
      case 'followers':
        return 'Seguidores';
      case 'visits':
        return 'Visitas';
      default:
        return '';
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {query.trim() 
          ? 'No se encontraron usuarios'
          : 'No hay usuarios para mostrar'}
      </Text>
    </View>
  );

  return (    <View style={styles.container}>
      <StatusBar style="light" />
      
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            iconColor="white"
            size={24}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>{getTitle()}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.divider} />
      </SafeAreaView>

      <View style={styles.searchContainer}>
        <SearchBar
          value={query}
          onChange={handleSearch}
          placeholder="Buscar usuarios..."
        />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {isSearching ? (
          <ActivityIndicator style={styles.loading} color="#fff" />
        ) : filteredUsers.length > 0 ? (
          <>
            {filteredUsers.map(user => (
              <UserRow
                key={user.id}
                {...user}
                isFollowing={user.isFollowing ?? false}
                onToggleFollow={() => handleToggleFollow(user.id)}
              />
            ))}
          </>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#000',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    height: SCREEN_WIDTH * 0.12,
  },
  headerTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    margin: 0,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  searchContainer: {
    marginTop: SCREEN_WIDTH * 0.02,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SCREEN_WIDTH * 0.04,
  },
  loading: {
    marginTop: SCREEN_WIDTH * 0.2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SCREEN_WIDTH * 0.2,
  },
  emptyStateText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH * 0.04,
    textAlign: 'center',
  },
});

export default UserListScreen;
