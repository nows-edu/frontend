import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Author {
  name: string;
  avatar: string;
}

interface SavedNow {
  id: string;
  prompt: string; // El enunciado/pregunta que están respondiendo
  thumbnail: string; // URL de la miniatura del video/foto
  type: 'video' | 'photo';
  author: Author;
  timestamp: string;
  reactions: number;
  comments: number;
  views: number;
  preview?: string;
  tags?: string[];
}

// Mock data - En producción, esto vendrá de la base de datos
const MOCK_SAVED_NOWS: SavedNow[] = [
  {
    id: '1',
    prompt: '¿Qué consejo le darías a alguien que empieza en tech?',
    thumbnail: 'https://images.pexels.com/photos/3861959/pexels-photo-3861959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    type: 'video',
    author: {
      name: 'Laura García',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    timestamp: '2h',
    reactions: 1208,
    comments: 145,
    views: 15600,
  },
  {
    id: '2',
    prompt: '¿Cómo fue tu experiencia en el bootcamp?',
    thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    type: 'video',
    author: {
      name: 'Carlos Ruiz',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    timestamp: '5h',
    reactions: 856,
    comments: 234,
    views: 12400,
  },
  {
    id: '3',
    prompt: 'Comparte tu historia de fracaso y aprendizaje',
    thumbnail: 'https://images.pexels.com/photos/7114/laptop-mobile.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    type: 'photo',
    author: {
      name: 'Ana Martínez',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    timestamp: '1d',
    reactions: 432,
    comments: 167,
    views: 8900,
  },
  {
    id: '4',
    prompt: '¿Bootcamp o Universidad? Cuenta tu experiencia',
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    type: 'video',
    author: {
      name: 'David López',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    timestamp: '2d',
    reactions: 765,
    comments: 289,
    views: 19800,
  }
];

interface SavedNowsScreenProps {
  savedNows?: SavedNow[];
  isLoading?: boolean;
  error?: string;
}

export default function SavedNowsScreen({ 
  savedNows = MOCK_SAVED_NOWS,
  isLoading = false,
  error 
}: SavedNowsScreenProps) {
  const renderNow = ({ item }: { item: SavedNow }) => (
    <Pressable 
      style={styles.nowCard}
      onPress={() => {
        router.push({
          pathname: '/(tabs)/home',
          params: { nowId: item.id }
        });
      }}
    >
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: item.thumbnail }} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.cardOverlay}>
          <View style={styles.overlayTop}>
            <MaterialIcons 
              name={item.type === 'video' ? 'play-circle-filled' : 'photo-camera'} 
              size={28} 
              color="white" 
            />
            <IconButton
              icon="bookmark"
              iconColor="#7A9AEC"
              size={20}
              onPress={() => {
                console.log('Remove from saved:', item.id);
              }}
            />
          </View>
          <View style={styles.overlayBottom}>
            <Text style={styles.promptText} numberOfLines={2}>{item.prompt}</Text>
            <View style={styles.authorInfo}>
              <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
              <Text style={styles.authorName}>{item.author.name}</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <MaterialIcons name="favorite" size={16} color="white" />
                <Text style={styles.statText}>{item.reactions}</Text>
              </View>
              <View style={styles.stat}>
                <MaterialIcons name="chat-bubble" size={16} color="white" />
                <Text style={styles.statText}>{item.comments}</Text>
              </View>
              <View style={styles.stat}>
                <MaterialIcons name="visibility" size={16} color="white" />
                <Text style={styles.statText}>{item.views}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
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
          <Text style={styles.headerTitle}>Nows guardados</Text>
        </View>
        <View style={styles.divider} />
      </SafeAreaView>      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#7A9AEC" />
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : savedNows.length === 0 ? (
        <View style={styles.centerContent}>
          <MaterialIcons name="bookmark-border" size={48} color="rgba(255,255,255,0.6)" />
          <Text style={styles.emptyText}>No tienes Nows guardados</Text>
          <Text style={styles.emptySubText}>Los Nows que guardes aparecerán aquí</Text>
        </View>
      ) : (
        <FlatList
          data={savedNows}
          renderItem={renderNow}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  },
  headerTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '600',
    marginLeft: SCREEN_WIDTH * 0.02,
  },
  backButton: {
    margin: 0,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  listContent: {
    padding: SCREEN_WIDTH * 0.04,
    gap: SCREEN_WIDTH * 0.04,
  },
  nowCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: SCREEN_WIDTH * 0.03,
    padding: SCREEN_WIDTH * 0.04,
    gap: SCREEN_WIDTH * 0.02,
  },
  thumbnailContainer: {
    position: 'relative',
    borderRadius: SCREEN_WIDTH * 0.03,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: SCREEN_WIDTH * 0.4,
    borderRadius: SCREEN_WIDTH * 0.03,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SCREEN_WIDTH * 0.04,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomLeftRadius: SCREEN_WIDTH * 0.03,
    borderBottomRightRadius: SCREEN_WIDTH * 0.03,
  },
  overlayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlayBottom: {
    marginTop: SCREEN_WIDTH * 0.02,
  },
  promptText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.036,
    lineHeight: SCREEN_WIDTH * 0.05,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.02,
    marginTop: SCREEN_WIDTH * 0.01,
  },
  avatar: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderRadius: SCREEN_WIDTH * 0.05,
  },
  authorName: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.038,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SCREEN_WIDTH * 0.02,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.01,
  },  statText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH * 0.034,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: SCREEN_WIDTH * 0.04,
    textAlign: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '600',
    marginTop: SCREEN_WIDTH * 0.04,
  },
  emptySubText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH * 0.034,
    marginTop: SCREEN_WIDTH * 0.02,
  }
});
