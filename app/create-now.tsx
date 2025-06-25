import React, { useState, useEffect, useRef } from 'react';
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
  ScrollView,
  Modal
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType, FlashMode, CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Picker } from '@react-native-picker/picker';
import * as api from '../services/api';
import { useFeed } from '../contexts/FeedContext';
import { MediaItem } from '../types/media';
import { Challenge } from '../types/challenges';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Mock user ID - in a real app this would come from authentication  
const CURRENT_USER_ID = 1;

const NOW_TYPES = ['Reto', 'Opiniones', 'Actividad', 'Perfil', 'Comunidad', 'QA'];

export default function CreateNowScreen() {
  const { addNewItem } = useFeed();
  const params = useLocalSearchParams();
  const cameraRef = useRef<CameraView>(null);
  
  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [mediaPermission, setMediaPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [isRecording, setIsRecording] = useState(false);
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  
  // Content states
  const [challengeContext, setChallengeContext] = useState<Challenge | null>(null);
  const [urlContent, setUrlContent] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('Reto');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Request permissions on mount
  useEffect(() => {
    requestPermissions();
  }, []);
  
  // Parse challenge context from route params
  useEffect(() => {
    if (params.challengeData && typeof params.challengeData === 'string') {
      try {
        const challenge = JSON.parse(params.challengeData) as Challenge;
        setChallengeContext(challenge);
        setSelectedType('Reto');
      } catch (error) {
        console.error('Error parsing challenge data:', error);
      }
    }
  }, [params.challengeData]);

  const requestPermissions = async () => {
    // Request camera permissions
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraStatus.status === 'granted');

    // Request media library permissions
    const mediaStatus = await MediaLibrary.requestPermissionsAsync();
    setMediaPermission(mediaStatus.status === 'granted');

    // Show info about camera availability
    if (cameraStatus.status !== 'granted') {
      Alert.alert(
        'Camera Permission',
        'Camera access will allow you to take photos and videos directly in the app. You can still use the gallery option.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        });
        
        if (photo) {
          setMediaUri(photo.uri);
          setMediaType('image');
          setUrlContent(photo.uri);
          setShowCamera(false);
          
          // Save to media library if permission granted
          if (mediaPermission) {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
          }
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({
          maxDuration: 30, // 30 seconds max
        });
        
        if (video) {
          setMediaUri(video.uri);
          setMediaType('video');
          setUrlContent(video.uri);
          setShowCamera(false);
          
          // Save to media library if permission granted
          if (mediaPermission) {
            await MediaLibrary.saveToLibraryAsync(video.uri);
          }
        }
      } catch (error) {
        console.error('Error recording video:', error);
        Alert.alert('Error', 'Failed to record video');
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashMode(current => {
      switch (current) {
        case 'off': return 'on';
        case 'on': return 'auto';
        default: return 'off';
      }
    });
  };

  const handlePickMedia = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setMediaUri(asset.uri);
        setMediaType(asset.type === 'video' ? 'video' : 'image');
        setUrlContent(asset.uri);
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
      Alert.alert('Error', 'Please take a photo/video or enter a URL');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please add a description for your NOW');
      return;
    }

    setIsUploading(true);

    try {
      const result = await api.createNowFromUrl(urlContent.trim(), selectedType, CURRENT_USER_ID, description.trim());

      if (result.success && result.now) {
        const challengeText = challengeContext 
          ? ` - Participando en: "${challengeContext.title}"` 
          : '';
        
        const newMediaItem: MediaItem = {
          id: result.now.id.toString(),
          mediaType: mediaType || (urlContent.includes('.mp4') || urlContent.includes('video') ? 'video' : 'image'),
          contentType: 'challenge',
          uri: urlContent.trim(),
          text: description.trim() + challengeText,
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
        { text: 'Cancel', style: 'cancel' },
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

  const canCreate = urlContent.trim().length > 0 && description.trim().length > 0 && !isUploading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowCamera(false)}
      >
        <View style={styles.cameraContainer}>
          {cameraPermission ? (
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={cameraType}
              flash={flashMode}
            >
              <View style={styles.cameraControls}>
                <View style={styles.topControls}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setShowCamera(false)}
                  >
                    <Text style={styles.controlButtonText}>✕</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={toggleFlash}
                  >
                    <Text style={styles.controlButtonText}>
                      {flashMode === 'off' ? '⚡' : flashMode === 'on' ? '🔦' : '⚡'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.bottomControls}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={toggleCameraType}
                  >
                    <Text style={styles.controlButtonText}>🔄</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.captureButtons}>
                    <TouchableOpacity
                      style={[styles.captureButton, styles.photoButton]}
                      onPress={takePicture}
                    >
                      <Text style={styles.captureButtonText}>📷</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.captureButton, 
                        styles.videoButton,
                        isRecording && styles.recordingButton
                      ]}
                      onPress={isRecording ? stopRecording : startRecording}
                    >
                      <Text style={styles.captureButtonText}>
                        {isRecording ? '⏹️' : '🎥'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handlePickMedia}
                  >
                    <Text style={styles.controlButtonText}>📱</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {isRecording && (
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>Recording...</Text>
                </View>
              )}
            </CameraView>
          ) : (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>Camera permission required</Text>
              <TouchableOpacity
                style={styles.permitButton}
                onPress={requestPermissions}
              >
                <Text style={styles.permitButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
      
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
        
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Create your NOW! 🚀</Text>
          <Text style={styles.instructionsText}>
            1. Take a photo/video or select from gallery{'\n'}
            2. Add a description{'\n'}
            3. Choose your NOW type{'\n'}
            4. Publish to the feed!
          </Text>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description *</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="What's your NOW about? Add a description..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
            maxLength={280}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {description.length}/280 characters
          </Text>
        </View>

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
          <Text style={styles.sectionTitle}>Add Media *</Text>
          <View style={styles.mediaButtons}>
            <TouchableOpacity 
              style={styles.mediaButton} 
              onPress={() => setShowCamera(true)}
            >
              <Text style={styles.mediaButtonText}>📷 Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton} onPress={handlePickMedia}>
              <Text style={styles.mediaButtonText}>📱 Pick from Library</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mediaButtons}>
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
  
  // Camera styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  captureButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  photoButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  videoButton: {
    backgroundColor: 'rgba(255,0,0,0.2)',
  },
  recordingButton: {
    backgroundColor: 'rgba(255,0,0,0.8)',
  },
  captureButtonText: {
    fontSize: 24,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 100,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  recordingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Header styles
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
  
  // Content styles
  content: {
    flex: 1,
    padding: 16,
  },
  
  // Instructions styles
  instructionsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    textAlign: 'center',
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
  
  // Description input styles
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  
  // Picker styles
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  
  // Media preview styles
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
  
  // Media button styles
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
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
  
  // Info text styles
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: '#000',
  },
  
  // Challenge banner styles
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
