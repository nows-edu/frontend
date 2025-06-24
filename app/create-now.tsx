import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Image,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import * as api from '../services/api';
import { useFeed } from '../contexts/FeedContext';
import { MediaItem } from '../types/media';
import { Challenge } from '../types/challenges';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock user ID - in a real app this would come from authentication  
const CURRENT_USER_ID = 1;

const NOW_TYPES = ['Reto', 'Opiniones', 'Actividad', 'Perfil', 'Comunidad', 'QA'];

export default function CreateNowScreen() {
  const { addNewItem } = useFeed();
  const params = useLocalSearchParams();
  
  // Parse challenge context from route params
  const [challengeContext, setChallengeContext] = useState<Challenge | null>(null);
  
  useEffect(() => {
    if (params.challengeData && typeof params.challengeData === 'string') {
      try {
        const challenge = JSON.parse(params.challengeData) as Challenge;
        setChallengeContext(challenge);
        // Set the type based on challenge
        setSelectedType('Reto');
      } catch (error) {
        console.error('Error parsing challenge data:', error);
      }
    }
  }, [params.challengeData]);

  const [urlContent, setUrlContent] = useState('');
  const [selectedType, setSelectedType] = useState('Reto');
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
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setMediaUri(asset.uri);
        setMediaType(asset.type === 'video' ? 'video' : 'image');
        setUrlContent(asset.uri); // Set as URL content
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  const handleClearMedia = () => {
    setMediaUri(null);
    setMediaType(null);
    if (urlContent === mediaUri) {
      setUrlContent('');
    }
  };

  const handleCreateNow = async () => {
    if (!urlContent.trim()) {
      Alert.alert('Error', 'Please enter a URL or select media');
      return;
    }

    setIsUploading(true);

    try {
      let result;
      
      // Create NOW from URL
      result = await api.createNowFromUrl(urlContent.trim(), selectedType, CURRENT_USER_ID);

      if (result.success && result.now) {
        // Convert the NOW result to MediaItem format for the feed
        const challengeText = challengeContext 
          ? ` - Participando en: "${challengeContext.title}"` 
          : '';
        
        const newMediaItem: MediaItem = {
          id: result.now.id.toString(),
          type: mediaType || (urlContent.includes('.mp4') || urlContent.includes('video') ? 'video' : 'image'),
          uri: urlContent.trim(),
          text: `[${selectedType}] Acabo de crear este NOW! 🚀${challengeText}`,
          author: {
            id: CURRENT_USER_ID.toString(),
            name: 'Tu Perfil',
            avatarUri: 'https://i.pravatar.cc/150?u=current_user',
          },
          likes: 0,
          comments: 0,
          challengeId: challengeContext?.id,
          challengeTitle: challengeContext?.title,
        };

        // Add to the feed immediately
        addNewItem(newMediaItem);

        const successMessage = challengeContext 
          ? `Tu NOW para el reto "${challengeContext.title}" ha sido creado exitosamente!`
          : `Tu NOW de ${selectedType} ha sido creado exitosamente y agregado al feed!`;

        Alert.alert(
          '¡Éxito!', 
          successMessage,
          [
            {
              text: 'Ver en Feed',
              onPress: () => {
                router.back();
                router.push('/(tabs)/home');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to create NOW');
      }
    } catch (error) {
      console.error('Error creating NOW:', error);
      Alert.alert('Error', 'Failed to create NOW. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFromUrl = () => {
    Alert.prompt(
      'Create NOW from URL',
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
              setUrlContent(url.trim());
              setMediaUri(url.trim());
              setMediaType(url.includes('.mp4') || url.includes('video') ? 'video' : 'image');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const canCreate = urlContent.trim().length > 0 && !isUploading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="close"
          size={24}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Create NOW</Text>
        <TouchableOpacity
          style={[styles.createButton, !canCreate && styles.createButtonDisabled]}
          onPress={handleCreateNow}
          disabled={!canCreate}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Challenge Context Banner */}
      {challengeContext && (
        <View style={styles.challengeBanner}>
          <View style={styles.challengeIconContainer}>
            <Text style={styles.challengeIcon}>
              {challengeContext.type === 'video' ? '🎤' : '⚡️'}
            </Text>
          </View>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeLabel}>Participando en reto:</Text>
            <Text style={styles.challengeTitle}>{challengeContext.title}</Text>
          </View>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* NOW Type Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOW Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedType}
              onValueChange={setSelectedType}
              style={styles.picker}
            >
              {NOW_TYPES.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </View>

        {/* URL Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content URL</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter image or video URL..."
            placeholderTextColor="#999"
            value={urlContent}
            onChangeText={setUrlContent}
            multiline={true}
            numberOfLines={3}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Media Preview */}
        {mediaUri && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.mediaPreview}>
              {mediaType === 'image' ? (
                <Image source={{ uri: mediaUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.videoPlaceholder}>
                  <Text style={styles.videoPlaceholderText}>Video: {mediaUri}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.clearMediaButton}
                onPress={handleClearMedia}
              >
                <Text style={styles.clearMediaText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Media Selection Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Media</Text>
          <View style={styles.mediaButtons}>
            <TouchableOpacity style={styles.mediaButton} onPress={handlePickMedia}>
              <Text style={styles.mediaButtonText}>📷 Pick from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton} onPress={handleCreateFromUrl}>
              <Text style={styles.mediaButtonText}>🔗 Use URL</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NOW Type Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About NOW Types</Text>
          <Text style={styles.infoText}>
            • <Text style={styles.bold}>Reto:</Text> Challenges and competitions{'\n'}
            • <Text style={styles.bold}>Opiniones:</Text> Thoughts and opinions{'\n'}
            • <Text style={styles.bold}>Actividad:</Text> Events and activities{'\n'}
            • <Text style={styles.bold}>Perfil:</Text> Profile content{'\n'}
            • <Text style={styles.bold}>Comunidad:</Text> Community posts{'\n'}
            • <Text style={styles.bold}>QA:</Text> Questions and answers
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  mediaPreview: {
    position: 'relative',
    alignSelf: 'center',
  },
  previewImage: {
    width: SCREEN_WIDTH * 0.8,
    height: (SCREEN_WIDTH * 0.8) * (16/9),
    borderRadius: 8,
  },
  videoPlaceholder: {
    width: SCREEN_WIDTH * 0.8,
    height: (SCREEN_WIDTH * 0.8) * (16/9),
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  videoPlaceholderText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  clearMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearMediaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: '#000',
  },
  challengeBanner: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeIcon: {
    fontSize: 20,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.9,
    marginBottom: 2,
  },
  challengeTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
