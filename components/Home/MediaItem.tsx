import { Image } from 'expo-image';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Author, MediaItem as MediaItemType } from '../../types/media';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const blurhash = 'L6PZfSi_.AyE_3t7t7Rk~qofbHxu'; // A placeholder for images

const TAB_BAR_HEIGHT = 80;
const TOP_BAR_HEIGHT = 60;

const AuthorInfo = ({ author }: { author: Author }) => (
  <View style={styles.authorContainer}>
    <Image source={{ uri: author.avatarUri }} style={styles.avatar} />
    <Text style={styles.authorName}>{author.name}</Text>
  </View>
);

const MediaStats = ({ likes, comments }: { likes: number, comments: number }) => (
  <View style={styles.statsContainer}>
    <Text style={styles.statText}>❤️ {likes}</Text>
    <Text style={styles.statText}>💬 {comments}</Text>
  </View>
);

// --- The Main Overlay Component ---
const MediaOverlay = ({ item, topPadding, bottomPadding }: { item: MediaItemType, topPadding: number, bottomPadding: number }) => (
  <View style={[styles.overlay, { paddingTop: topPadding, paddingBottom: bottomPadding }]}>
    {/* This container pushes content up from the bottom */}
    <View style={styles.infoContainer}>
      <AuthorInfo author={item.author} />
      <Text style={styles.text}>{item.text}</Text>
      <MediaStats likes={item.likes} comments={item.comments} />
    </View>
  </View>
);

interface MediaItemProps {
  item: MediaItemType;
  isVisible: boolean;
}

const VideoPlayer = ({ uri, isVisible }: { uri: string, isVisible: boolean }) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.muted = true; // Start muted for autoplay compliance
    player.playbackRate = 1.0;
  });

  const isVisibleRef = useRef(isVisible);
  const playerRef = useRef(player);
  
  useEffect(() => {
    isVisibleRef.current = isVisible;
    playerRef.current = player;
  }, [isVisible, player]);

  useEffect(() => {
    const handlePlayback = () => {
      try {
        if (isVisible && playerRef.current) {
          // Small delay to ensure the component is ready
          setTimeout(() => {
            if (isVisibleRef.current && playerRef.current) {
              playerRef.current.play();
            }
          }, 100);
        } else if (playerRef.current) {
          playerRef.current.pause();
          // Reset to beginning when pausing
          playerRef.current.currentTime = 0;
        }
      } catch (error) {
        // Silently handle playback errors
        console.log('Video playback error (non-critical):', error);
      }
    };

    handlePlayback();
  }, [isVisible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (playerRef.current) {
          playerRef.current.pause();
        }
      } catch (error) {
        // Silent cleanup
      }
    };
  }, []);

  return (
    <VideoView 
      player={player} 
      style={styles.media} 
      nativeControls={false}
      allowsFullscreen={false}
      contentFit="cover"
      showsTimecodes={false}
    />
  );
};

const ImageViewer = ({ uri }: { uri: string }) => (
  <Image
    source={{ uri }}
    style={styles.media}
    placeholder={{ blurhash }}
    contentFit="cover"
    transition={300}
  />
);

const MediaItem = ({ item, isVisible }: MediaItemProps) => {
  // --- LAYOUT FIX: Calculate padding based on safe areas and component heights ---
  const insets = useSafeAreaInsets();
  const topPadding = insets.top + TOP_BAR_HEIGHT;
  const bottomPadding = insets.bottom + TAB_BAR_HEIGHT;

  return (
    <View style={styles.container}>
      {item.type === 'video' ? (
        <VideoPlayer uri={item.uri} isVisible={isVisible} />
      ) : (
        <ImageViewer uri={item.uri} />
      )}
      <MediaOverlay item={item} topPadding={topPadding} bottomPadding={bottomPadding} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'black',
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  // --- LAYOUT FIX: The overlay is a pointer-event-none container that fills the screen ---
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end', // Aligns infoContainer to the bottom
    paddingHorizontal: 20,
    pointerEvents: 'box-none', // Allows touches to pass through to the video if needed
  },
  // --- LAYOUT FIX: This container holds the actual text content ---
  infoContainer: {
    flex: 1, // Take up available space
    justifyContent: 'flex-end', // Push all content to the bottom
    pointerEvents: 'auto', // The info content itself is touchable
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#fff' },
  authorName: { color: 'white', fontWeight: 'bold', fontSize: 16, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2, },
  text: { color: 'white', fontSize: 15, marginBottom: 15, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2, },
  statsContainer: {
    flexDirection: 'row',
  },
  statText: {
    color: 'white',
    fontWeight: '600',
    marginRight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },
});

export default React.memo(MediaItem); // Memoize for performance