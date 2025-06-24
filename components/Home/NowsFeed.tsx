// src/components/Home/NowsFeed.tsx

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, ViewToken } from 'react-native';
import * as api from '../../services/api';
import { MediaItem } from '../../types/media';
import { useFeed } from '../../contexts/FeedContext';
import MediaItemComponent from './MediaItem';

interface NowsFeedProps {
  selectedCategories: string[]; // Receives filter from HomeScreen
}

export default function NowsFeed({ selectedCategories }: NowsFeedProps) {
  const { feedItems, setFeedItems, addNewItem } = useFeed();
  const [nows, setNows] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  
  // Ref to prevent multiple fetches from firing simultaneously
  const isFetching = useRef(false);

  // Combine fetched NOWs with new items from context
  const allNows = [...feedItems, ...nows];

  const loadNows = useCallback(async (isInitialLoad = false) => {
    //
    // --- STABILITY FIX: Prevent concurrent fetches ---
    if (isFetching.current) return;
    if (!isInitialLoad && !hasMore) return;

    isFetching.current = true;
    const pageToFetch = isInitialLoad ? 1 : page;

    if (isInitialLoad) {
      setIsRefreshing(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      console.log(`Fetching page ${pageToFetch} with categories: ${selectedCategories.join(', ')}`);
      const { data, hasMore: newHasMore } = await api.fetchNows(pageToFetch);
      
      setNows(prev => (isInitialLoad ? data : [...prev, ...data]));
      setPage(pageToFetch + 1);
      setHasMore(newHasMore);
    } catch (error) {
      console.error("Failed to fetch NOWs:", error);
    } finally {
      isFetching.current = false;
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [page, hasMore, selectedCategories]);

  // --- REFRESH FIX: Trigger initial load on refresh or category change ---
  useEffect(() => {
    // This effect runs on mount and whenever the filters change
    loadNows(true);
  }, [selectedCategories]);

  // --- REFRESH FIX: Handle the pull-to-refresh gesture ---
  const handleRefresh = () => {
    // Only set the state, the effect will handle the logic
    if (!isFetching.current) {
       loadNows(true);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const visibleIds = viewableItems.map(item => item.key as string).filter(Boolean);
    setVisibleItems(visibleIds);
  }).current;

  const renderItem = useCallback(
    ({ item }: { item: MediaItem }) => (
      <MediaItemComponent item={item} isVisible={visibleItems.includes(item.id)} />
    ),
    [visibleItems]
  );
  
  const renderFooter = () => {
    if (!isLoadingMore || isRefreshing) return null;
    return <ActivityIndicator style={styles.footer} size="large" color="#FFF" />;
  };

  return (
    <FlatList
      data={allNows}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      pagingEnabled={true}
      snapToInterval={Dimensions.get('window').height}
      snapToAlignment="start"
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      bounces={false}
      scrollEventThrottle={16}
      disableIntervalMomentum={true}
      onEndReached={() => loadNows(false)}
      onEndReachedThreshold={0.7}
      ListFooterComponent={renderFooter}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
      style={styles.container}
      getItemLayout={(data, index) => ({
        length: Dimensions.get('window').height,
        offset: Dimensions.get('window').height * index,
        index,
      })}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
});