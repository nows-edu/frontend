import SearchBar from '@/components/Search/SearchBar';
import UserRow from '@/components/Search/UserRow';
import { User, followService } from '@/utils/followService';
import { router } from 'expo-router';
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

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<UserWithFollowState[]>([]);
  const currentUserId = 'carol'; // Current user ID

  // Load users and their follow state
  const loadUsers = useCallback(async () => {
    try {
      const allUsers = await followService.allUsers();
      const usersWithState = await Promise.all(
        Object.values(allUsers)
          .filter((user): user is User => {
            return user.id !== currentUserId && typeof user.id === 'string';
          })
          .map(async (user: User) => ({
            ...user,
            isFollowing: await followService.isFollowing(currentUserId, user.id)
          }))
      );
      setSuggestedUsers(usersWithState);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleFollow = async (targetUserId: string) => {
    try {
      const userToUpdate = suggestedUsers.find(u => u.id === targetUserId);
      if (!userToUpdate) return;

      if (userToUpdate.isFollowing) {
        await followService.unfollowUser(currentUserId, targetUserId);
      } else {
        await followService.followUser(currentUserId, targetUserId);
      }

      // Update UI
      setSuggestedUsers(prev => 
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
    async (searchQuery: string) => {
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
    ? suggestedUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      )
    : suggestedUsers;

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {query.trim() 
          ? 'No se encontraron usuarios'
          : 'Busca usuarios por nombre o username'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Buscador</Text>
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
        {!query.trim() ? (
          <>
            <Text style={styles.sectionTitle}>Sugerencias</Text>
            {suggestedUsers.map(user => (
              <UserRow
                key={user.id}
                {...user}
                isFollowing={user.isFollowing ?? false}
                onToggleFollow={() => handleToggleFollow(user.id)}
              />
            ))}
          </>
        ) : (
          <>
            {isSearching ? (
              <ActivityIndicator style={styles.loading} color="#fff" />
            ) : filteredUsers.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Resultados</Text>
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
          </>
        )}
      </ScrollView>
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
  },  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  searchContainer: {
    marginTop: SCREEN_WIDTH * 0.02,
    marginHorizontal: SCREEN_WIDTH * 0.04,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SCREEN_WIDTH * 0.04,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '600',
    marginHorizontal: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_WIDTH * 0.02,
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
  loading: {
    marginTop: SCREEN_WIDTH * 0.2,
  },
});

export default SearchScreen;