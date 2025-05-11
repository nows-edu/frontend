import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { getVerticalVideo } from '../../utils/pexelsApi';

export default function App() {
  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideo();
  }, []);

  const loadVideo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const uri = await getVerticalVideo();
      
      if (!uri) {
        setError('Failed to load video. No valid video URL received.');
        return;
      }
      
      console.log('Received video URI:', uri);
      setVideoUri(uri);
    } catch (err) {
      setError('Failed to load video: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVideoError = (error: any) => {
    console.error('Video playback error:', error);
    setError(`Video playback error: ${error.error.errorString}`);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.text}>Loading video...</Text>
      </View>
    );
  }

  if (error || !videoUri) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error || 'No video available'}</Text>
        <TouchableOpacity style={styles.button} onPress={loadVideo}>
          <Text style={styles.text}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode="cover"
        repeat
        paused={!isPlaying}
        onError={handleVideoError}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePlayback}
        >
          <Text style={styles.text}>
            {isPlaying ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    flex: 1,
    alignSelf: 'stretch'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
