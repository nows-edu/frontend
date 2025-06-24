import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MediaItem } from '../types/media';

interface FeedContextType {
  feedItems: MediaItem[];
  setFeedItems: (items: MediaItem[]) => void;
  addNewItem: (item: MediaItem) => void;
  refreshFeed: () => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};

interface FeedProviderProps {
  children: ReactNode;
}

export const FeedProvider: React.FC<FeedProviderProps> = ({ children }) => {
  const [feedItems, setFeedItems] = useState<MediaItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const addNewItem = (item: MediaItem) => {
    setFeedItems(prev => [item, ...prev]);
  };

  const refreshFeed = () => {
    setRefreshKey(prev => prev + 1);
  };

  const value: FeedContextType = {
    feedItems,
    setFeedItems,
    addNewItem,
    refreshFeed,
  };

  return (
    <FeedContext.Provider value={value}>
      {children}
    </FeedContext.Provider>
  );
};
