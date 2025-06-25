// src/components/Home/NowsFeed.tsx

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, ViewToken } from 'react-native';
import { useFeed } from '../../contexts/FeedContext';
import * as api from '../../services/api';
import { MediaItem } from '../../types/media';
import MediaItemComponent from './MediaItem';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 80;
const TOP_BAR_HEIGHT = 60;
const ITEM_HEIGHT = SCREEN_HEIGHT - (TAB_BAR_HEIGHT + TOP_BAR_HEIGHT);

interface NowsFeedProps {
  selectedCategories: string[]; // Receives filter from HomeScreen
  onItemChange?: (item: MediaItem) => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loader: {
    paddingVertical: 20,
  },
});

export default function NowsFeed({ selectedCategories, onItemChange }: NowsFeedProps) {
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
      const { data, hasMore: newHasMore } = await api.fetchNows(pageToFetch, undefined, selectedCategories);
      
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

  const renderItem = useCallback(({ item, index }: { item: MediaItem, index: number }) => {
    console.log('Rendering item:', { id: item.id, mediaType: item.mediaType, uri: item.uri });
    
    return (
      <MediaItemComponent 
        item={{
          ...item,
          mediaType: item.mediaType || (item.uri?.includes('.mp4') ? 'video' : 'image'),
          contentType: item.contentType || 'opinion',
        }} 
        isVisible={visibleItems.includes(item.id)}
      />
    );
  }, [visibleItems]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    setVisibleItems(viewableItems.map(item => item.key as string));
    // Notificar el cambio de item visible
    if (viewableItems.length > 0 && onItemChange) {
      onItemChange(viewableItems[0].item as MediaItem);
    }
  }, [onItemChange]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  };

  const viewabilityConfigCallbackPairs = useRef([{
    viewabilityConfig,
    onViewableItemsChanged,
  }]);

  const renderFooter = () => {
    if (!isLoadingMore || isRefreshing) return null;
    return <ActivityIndicator style={styles.loader} size="large" color="#FFF" />;
  };

  return (
    <FlatList
      style={styles.container}
      data={allNows}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onEndReached={() => loadNows()}
      onEndReachedThreshold={0.1}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      getItemLayout={(_, index) => ({
        length: SCREEN_HEIGHT,
        offset: SCREEN_HEIGHT * index,
        index,
      })}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      showsVerticalScrollIndicator={false}
      snapToInterval={SCREEN_HEIGHT}
      snapToAlignment="start"
      decelerationRate="fast"
      ListFooterComponent={
        isLoadingMore ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        ) : null
      }
    />
  );
}