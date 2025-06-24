import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Image,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as api from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock user ID - in a real app this would come from authentication
const CURRENT_USER_ID = 'current-user-123';

export default function CreatePostScreen() {
  const [text, setText] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePickMedia = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      // Pick media
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [9, 16], // Vertical aspect ratio for social media
        quality: 0.8,
        videoQuality: ImagePicker.VideoQuality.High,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setMediaUri(asset.uri);
        setMediaType(asset.type === 'video' ? 'video' : 'image');
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera permissions to make this work!');
        return;
      }

      // Take photo/video
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
        videoQuality: ImagePicker.VideoQuality.High,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setMediaUri(asset.uri);
        setMediaType(asset.type === 'video' ? 'video' : 'image');
      }
    } catch (error) {
      console.error('Error taking media:', error);
      Alert.alert('Error', 'Failed to take media');
    }
  };

  const handleCreatePost = async () => {
    if (!mediaUri) {
      Alert.alert('No media selected', 'Please select an image or video to post');
      return;
    }

    if (!text.trim()) {
      Alert.alert('No caption', 'Please add a caption to your post');
      return;
    }

    setIsUploading(true);

    try {
      let result;
      
      // For now, we'll use createPostFromUrl since file upload requires more complex setup
      // In a real app, you'd implement proper file upload
      result = await api.createPostFromUrl(mediaUri, text.trim(), CURRENT_USER_ID);

      if (result.success) {
        Alert.alert(
          'Success!', 
          'Your post has been created successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                router.back();
                // Optionally navigate to home to see the new post
                router.push('/(tabs)/home');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFromUrl = () => {
    Alert.prompt(
      'Create from URL',
      'Enter the URL of an image or video:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Use URL',
          onPress: (url) => {
            if (url && url.trim()) {
              setMediaUri(url.trim());
              setMediaType(url.includes('.mp4') || url.includes('video') ? 'video' : 'image');
            }
          },
        },
      ],
      'plain-text',
      'https://example.com/image.jpg'
    );
  };

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
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity 
            style={[
              styles.postButton, 
              (!mediaUri || !text.trim() || isUploading) && styles.postButtonDisabled
            ]}
            onPress={handleCreatePost}
            disabled={!mediaUri || !text.trim() || isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
      </SafeAreaView>

      <View style={styles.content}>
        {/* Media Preview */}
        <View style={styles.mediaSection}>
          {mediaUri ? (
            <View style={styles.mediaPreview}>
              <Image source={{ uri: mediaUri }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeMediaButton}
                onPress={() => {
                  setMediaUri(null);
                  setMediaType(null);
                }}
              >
                <Text style={styles.removeMediaText}>✕</Text>
              </TouchableOpacity>
              <View style={styles.mediaTypeIndicator}>
                <Text style={styles.mediaTypeText}>
                  {mediaType === 'video' ? '🎥' : '📷'}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.noMediaContainer}>
              <Text style={styles.noMediaText}>No media selected</Text>
              <Text style={styles.noMediaSubtext}>Choose an option below to add media</Text>
            </View>
          )}
        </View>

        {/* Media Selection Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
            <Text style={styles.actionButtonIcon}>📷</Text>
            <Text style={styles.actionButtonText}>Take Photo/Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handlePickMedia}>
            <Text style={styles.actionButtonIcon}>📱</Text>
            <Text style={styles.actionButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleCreateFromUrl}>
            <Text style={styles.actionButtonIcon}>🔗</Text>
            <Text style={styles.actionButtonText}>Use URL</Text>
          </TouchableOpacity>
        </View>

        {/* Caption Input */}
        <View style={styles.captionSection}>
          <Text style={styles.captionLabel}>Caption</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
          />
          <Text style={styles.characterCount}>{text.length}/500</Text>
        </View>
      </View>
    </View>
  );
}

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
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    height: SCREEN_WIDTH * 0.14,
    justifyContent: 'space-between',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SCREEN_WIDTH * 0.04,
  },
  postButton: {
    backgroundColor: '#7A9AEC',
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_WIDTH * 0.02,
    borderRadius: SCREEN_WIDTH * 0.02,
    minWidth: SCREEN_WIDTH * 0.15,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: 'rgba(122, 154, 236, 0.3)',
  },
  postButtonText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flex: 1,
    padding: SCREEN_WIDTH * 0.04,
  },
  mediaSection: {
    height: SCREEN_WIDTH * 0.8,
    marginBottom: SCREEN_WIDTH * 0.04,
  },
  mediaPreview: {
    flex: 1,
    borderRadius: SCREEN_WIDTH * 0.03,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeMediaButton: {
    position: 'absolute',
    top: SCREEN_WIDTH * 0.02,
    right: SCREEN_WIDTH * 0.02,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_WIDTH * 0.08,
    borderRadius: SCREEN_WIDTH * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeMediaText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
  },
  mediaTypeIndicator: {
    position: 'absolute',
    bottom: SCREEN_WIDTH * 0.02,
    left: SCREEN_WIDTH * 0.02,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    paddingVertical: SCREEN_WIDTH * 0.01,
    borderRadius: SCREEN_WIDTH * 0.015,
  },
  mediaTypeText: {
    fontSize: SCREEN_WIDTH * 0.04,
  },
  noMediaContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: SCREEN_WIDTH * 0.03,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  noMediaText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '600',
    marginBottom: SCREEN_WIDTH * 0.01,
  },
  noMediaSubtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: SCREEN_WIDTH * 0.032,
    textAlign: 'center',
  },
  buttonSection: {
    marginBottom: SCREEN_WIDTH * 0.04,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: SCREEN_WIDTH * 0.04,
    borderRadius: SCREEN_WIDTH * 0.02,
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  actionButtonIcon: {
    fontSize: SCREEN_WIDTH * 0.05,
    marginRight: SCREEN_WIDTH * 0.03,
  },
  actionButtonText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '500',
    flex: 1,
  },
  captionSection: {
    flex: 1,
  },
  captionLabel: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '600',
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  captionInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: SCREEN_WIDTH * 0.02,
    padding: SCREEN_WIDTH * 0.04,
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.035,
    minHeight: SCREEN_WIDTH * 0.25,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: SCREEN_WIDTH * 0.03,
    textAlign: 'right',
    marginTop: SCREEN_WIDTH * 0.02,
  },
});
