import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    PanResponder,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Author, MediaItem as MediaItemType } from '../../types/media';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const blurhash = 'L6PZfSi_.AyE_3t7t7Rk~qofbHxu'; // A placeholder for images

const TAB_BAR_HEIGHT = 80;
const TOP_BAR_HEIGHT = 60;

// Types for comments
interface Comment {
  id: string;
  author: Author;
  text: string;
  likes: number;
  timeAgo: string;
}

interface CommentProps {
  comment: Comment;
}

interface CommentsSectionProps {
  isVisible: boolean;
  onClose: () => void;
  postId: string;
  comments: Comment[];
}

interface ActionButtonsProps {
  likes: number;
  comments: number;
  showComments: boolean;
  onToggleComments: () => void;
}

// Action Buttons Component
const ActionButtons = ({ likes, comments, showComments, onToggleComments }: ActionButtonsProps) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(likes);
  const [commentsCount, setCommentsCount] = React.useState(comments);
  const [hasShared, setHasShared] = React.useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    setHasShared(true);
    setTimeout(() => setHasShared(false), 2000);
  };

  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={handleLike}
        activeOpacity={0.6}
      >
        <MaterialIcons 
          name={isLiked ? "favorite" : "favorite-border"} 
          size={32} 
          color={isLiked ? "#FF4B6A" : "white"} 
        />
        <Text style={[styles.actionCount, isLiked && { color: "#FF4B6A" }]}>
          {likesCount}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onToggleComments}
        activeOpacity={0.6}
      >
        <MaterialIcons 
          name="chat-bubble-outline" 
          size={30} 
          color={showComments ? "#2B64F6" : "white"} 
        />
        <Text style={[styles.actionCount, showComments && { color: "#2B64F6" }]}>
          {commentsCount}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={handleShare}
        activeOpacity={0.6}
      >
        <MaterialIcons 
          name="reply" 
          size={32} 
          color={hasShared ? "#2B64F6" : "white"}
          style={{ transform: [{ scaleX: -1 }] }}
        />
      </TouchableOpacity>
    </View>
  );
};

// Bottom Profile Section Component
const BottomSection = ({ item }: { item: MediaItemType }) => {
  const navigateToProfile = () => {
    router.push({
      pathname: '/profile',
      params: { userId: item.author.id }
    });
  };

  const handleParticipate = () => {
    router.push({
      pathname: '/create-now',
      params: { type: item.contentType }
    });
  };

  // Si es un perfil de usuario, mostrar información diferente
  if (item.contentType === 'user-profile' && item.profileData) {
    return (
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={navigateToProfile}
          activeOpacity={0.9}
        >
          <Image 
            source={{ uri: item.author.avatarUri }} 
            style={styles.bottomAvatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
              {item.author.name}
            </Text>
            <Text style={[styles.profileStatus, { color: item.profileData.statusColor || '#fff' }]} numberOfLines={1}>
              {item.profileData.status}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.followButton}
          onPress={navigateToProfile}
          activeOpacity={0.9}
        >
          <MaterialIcons 
            name="person-add" 
            size={22} 
            color="white" 
          />
          <Text style={styles.participateText}>
            Ver perfil
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Para contenido normal (retos, opiniones, etc.)
  return (
    <View style={styles.bottomSection}>
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={navigateToProfile}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: item.author.avatarUri }} 
          style={styles.bottomAvatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName} numberOfLines={1}>
            {item.author.name}
          </Text>
          <Text style={styles.profileStatus} numberOfLines={1}>
            {item.author.status || 'Disponible'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.participateButton}
        onPress={handleParticipate}
        activeOpacity={0.9}
      >
        <MaterialIcons 
          name={item.contentType === 'challenge' ? "mic" : "flash-on"} 
          size={22} 
          color="white" 
        />
        <Text style={styles.participateText}>
          Participar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// --- The Main Overlay Component ---
const MediaOverlay = ({ item, topPadding, bottomPadding }: { item: MediaItemType, topPadding: number, bottomPadding: number }) => (
  <View style={[styles.overlay, { paddingTop: topPadding, paddingBottom: bottomPadding }]}>
    <ActionButtons 
      likes={item.likes} 
      comments={item.comments}
      showComments={false}
      onToggleComments={() => {}}
    />
    <BottomSection item={item} />
  </View>
);

interface MediaItemProps {
  item: MediaItemType;
  isVisible: boolean;
}

const VideoPlayer = ({ uri, isVisible }: { uri: string, isVisible: boolean }) => {
  const [hasVideoError, setHasVideoError] = useState(false);
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
    const handlePlayback = async () => {
      try {
        if (isVisible && playerRef.current && !hasVideoError) {
          // Small delay to ensure the component is ready
          setTimeout(async () => {
            if (isVisibleRef.current && playerRef.current) {
              try {
                await playerRef.current.play();
              } catch (playError) {
                console.log('Video play error, fallback to image:', playError);
                setHasVideoError(true);
              }
            }
          }, 100);
        } else if (playerRef.current) {
          playerRef.current.pause();
          // Reset to beginning when pausing
          playerRef.current.currentTime = 0;
        }
      } catch (error) {
        // Silently handle playback errors and fallback to image
        console.log('Video playback error (non-critical):', error);
        setHasVideoError(true);
      }
    };

    handlePlayback();
  }, [isVisible, hasVideoError]);

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

  // If video has error, fallback to image
  if (hasVideoError) {
    return (
      <Image
        source={{ uri: 'https://picsum.photos/id/1043/1080/1920' }} // Default university image
        style={styles.media}
        resizeMode="cover"
        onError={() => {
          console.log('Image fallback also failed');
        }}
      />
    );
  }

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
    resizeMode="cover"
  />
);

const MediaItem = ({ item, isVisible }: MediaItemProps) => {
  const [showComments, setShowComments] = useState(false);
  const insets = useSafeAreaInsets();

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <View style={styles.container}>
      {/* Media content */}
      {item.mediaType === 'video' ? (
        <VideoPlayer uri={item.uri} isVisible={isVisible} />
      ) : (
        <View style={styles.media}>
          <Image
            source={{ uri: item.uri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      )}
      
      {/* Caption and controls overlay */}
      <View style={styles.mediaWrapper}>
        <ActionButtons 
          likes={item.likes} 
          comments={item.comments}
          showComments={showComments}
          onToggleComments={handleToggleComments}
        />
        
        {item.text && (
          <Text style={styles.caption} numberOfLines={4}>
            {item.text}
          </Text>
        )}

        {/* Información especial para perfiles de usuario */}
        {item.contentType === 'user-profile' && item.profileData && (
          <View style={styles.profileInfoOverlay}>
            <Text style={styles.profileEducation}>{item.profileData.education}</Text>
            <Text style={styles.profileLocation}>📍 {item.profileData.location}</Text>
            <View style={styles.profileInterests}>
              {item.profileData.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        <BottomSection item={item} />

        <CommentsSection 
          isVisible={showComments}
          onClose={handleToggleComments}
          postId={item.id}
          comments={MOCK_COMMENTS.map(comment => ({
            ...comment,
            postId: item.id
          }))}
        />
      </View>
    </View>
  );
};

// Mock comments data
const MOCK_COMMENTS = [
  {
    id: '1',
    author: {
      id: '1',
      name: 'Laura García',
      avatarUri: 'https://i.pravatar.cc/150?img=1',
      status: 'Estudiante de Diseño'
    },
    text: '¡Me encanta este reto! Ya estoy preparando mi participación 🔥',
    likes: 24,
    timeAgo: '2m'
  },
  {
    id: '2',
    author: {
      id: '2',
      name: 'Carlos Ruiz',
      avatarUri: 'https://i.pravatar.cc/150?img=2',
      status: 'Creador de contenido'
    },
    text: 'Muy creativo! ¿Qué app usaste para la edición?',
    likes: 15,
    timeAgo: '5m'
  },
  {
    id: '3',
    author: {
      id: '3',
      name: 'María Sánchez',
      avatarUri: 'https://i.pravatar.cc/150?img=3',
      status: 'Artista digital'
    },
    text: '¡Increíble! 👏 Necesitamos más contenido como este',
    likes: 32,
    timeAgo: '7m'
  }
];

// Comment Component
const Comment = ({ comment }: CommentProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes);

  return (
    <View style={styles.commentContainer}>
      <Image source={{ uri: comment.author.avatarUri }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{comment.author.name}</Text>
        <Text style={styles.commentText}>{comment.text}</Text>
        <View style={styles.commentActions}>
          <Text style={styles.commentTime}>{comment.timeAgo}</Text>
          <TouchableOpacity 
            onPress={() => {
              setIsLiked(!isLiked);
              setLikesCount(current => isLiked ? current - 1 : current + 1);
            }}
            style={styles.commentLikeButton}
          >
            <MaterialIcons 
              name={isLiked ? "favorite" : "favorite-border"} 
              size={16} 
              color={isLiked ? "#FF4B6A" : "#fff"} 
            />
            <Text style={[styles.commentLikes, isLiked && { color: "#FF4B6A" }]}>
              {likesCount}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Comments Section Component
const CommentsSection = ({ isVisible, onClose, postId, comments }: CommentsSectionProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [newComment, setNewComment] = useState('');
  const inputRef = useRef<TextInput>(null);
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Solo activar para movimientos verticales significativos
        return Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) { // Solo permitir deslizar hacia abajo
          scrollOffset.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) { // Si se ha deslizado más de 50px hacia abajo
          onClose();
        } else {
          // Volver a la posición original
          Animated.spring(scrollOffset, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      scrollOffset.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 11
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [isVisible]);

  const handleSendComment = () => {
    if (newComment.trim()) {
      setNewComment('');
      inputRef.current?.blur();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <TouchableOpacity 
        style={[styles.commentsOverlay, { opacity: overlayAnim }]}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View 
        {...panResponder.panHandlers}
        style={[
          styles.commentsSection,
          {
            transform: [
              {
                translateY: Animated.add(
                  slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [SCREEN_HEIGHT, 0]
                  }),
                  scrollOffset
                )
              }
            ]
          }
        ]}
      >
        <View style={styles.commentsPullBar} />
        <View style={styles.commentsHeader}>
          <Text style={styles.commentsTitle}>Comentarios</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView 
          style={styles.commentsScroll}
          contentContainerStyle={styles.commentsContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          keyboardShouldPersistTaps="handled"
          onScroll={({ nativeEvent }) => {
            // Si se hace scroll hacia abajo en la parte superior, cerrar los comentarios
            if (nativeEvent.contentOffset.y < -50) {
              onClose();
            }
          }}
          scrollEventThrottle={16}
        >
          {comments.map(comment => (
            <Comment key={`${postId}-${comment.id}`} comment={comment} />
          ))}
        </ScrollView>
        
        <View style={styles.commentInputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.commentInput}
            placeholder="Añade un comentario..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSendComment}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendComment}
            disabled={!newComment.trim()}
          >
            <MaterialIcons 
              name="send" 
              size={24} 
              color={newComment.trim() ? "#2B64F6" : "rgba(255,255,255,0.3)"} 
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'black',
    position: 'relative',
  },
  media: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'transparent',
  },
  mediaWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButtons: {
    position: 'absolute',
    right: 16,
    bottom: TAB_BAR_HEIGHT + 140, // Subido 20px más arriba
    alignItems: 'center',
    gap: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
    zIndex: 2, // Aseguramos que los botones estén por encima
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'System',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bottomSection: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT + 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    zIndex: 1000,
  },
  profileButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 24, // Volvemos al radio original
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 12,
    height: '100%',
  },
  bottomAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  profileInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  profileName: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileStatus: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  participateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B64F6',
    borderRadius: 24,
    paddingHorizontal: 20,
    height: '100%',
    minWidth: 130,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    paddingHorizontal: 20,
    height: '100%',
    minWidth: 130,
  },
  participateText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  image: {
    flex: 1,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#222',
  },
  caption: {
    position: 'absolute',
    left: 16,
    right: 16, // Ahora usa todo el ancho disponible
    bottom: TAB_BAR_HEIGHT + 76,
    color: 'white',
    fontSize: 15,
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 12,
    borderRadius: 16,
    zIndex: 1, // Aseguramos que el texto esté debajo de los botones
  },
  commentsSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.97)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    height: SCREEN_HEIGHT * 0.7,
    zIndex: 9999,
    elevation: 1000, // Para Android
  },
  commentsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9998,
  },
  commentsPullBar: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  commentsScroll: {
    flex: 1,
  },
  commentsContent: {
    paddingBottom: 20,
  },
  commentsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentTime: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginRight: 16,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentLikes: {
    color: 'white',
    fontSize: 13,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.95)',
    minHeight: 60,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Valor fijo para el padding inferior
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: 'white',
    fontSize: 15,
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  profileInfoOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: TAB_BAR_HEIGHT + 140, // Encima del caption normal
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    borderRadius: 16,
    zIndex: 1,
  },
  profileEducation: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  profileLocation: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 12,
  },
  profileInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default React.memo(MediaItem); // Memoize for performance