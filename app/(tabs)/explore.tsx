import UniversityChallenge from '@/components/Explore/UniversityChallenge';
import WeeklyChallenge from '@/components/Explore/WeeklyChallenge';
import Tag from '@/components/General/Tag';
import SearchBar from '@/components/Search/SearchBar';
import { Challenge as ChallengeType } from '@/types/challenges';
import { MaterialIcons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Dimensions, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Material icons type for type safety
type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

type LocalChallengeType = 'photo' | 'video';

interface LocalChallenge {
  id: string;
  title: string;
  type: LocalChallengeType;
  icon: string;
}

// Available filters
const FILTERS: Array<{label: string, icon?: MaterialIconName}> = [
  { label: 'Filtros', icon: 'tune' },
  { label: 'Estudios' },
  { label: 'Universidad' }
];

// Weekly challenges data
const WEEKLY_CHALLENGES: LocalChallenge[] = [
  {
    id: '1',
    title: 'Foto en la universidad',
    type: 'photo',
    icon: '⚡️',
  },
  {
    id: '2',
    title: 'Mejores optativas de Ingeniería Informática',
    type: 'video',
    icon: '🎤',
  },
  {
    id: '3',
    title: 'Cómo es el primer curso de Ingeniería Informática',
    type: 'video',
    icon: '🎤',
  },
];

// University-related challenges
const UNIVERSITY_CHALLENGES: LocalChallenge[] = [
  {
    id: '4',
    title: 'Tips para el primer día',
    type: 'video',
    icon: '🎤',
  },
  {
    id: '5',
    title: 'Cuáles son los mejores eventos de la UAB',
    type: 'video',
    icon: '🎤',
  },
  {
    id: '6',
    title: 'Muestra tu spot favorito',
    type: 'photo',
    icon: '⚡️',
  },
];

export default function ExploreScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [randomChallenge, setRandomChallenge] = useState<LocalChallenge | null>(null);
  const [showRandomModal, setShowRandomModal] = useState(false);  const handleParticipate = useCallback(async (challenge?: LocalChallenge) => {
    const { status } = await requestPermission();
    if (status !== 'granted') {
      // TODO: Mostrar mensaje de error
      return;
    }
    
    if (challenge) {
      // Convert LocalChallenge to ChallengeType for navigation
      const challengeData: ChallengeType = {
        id: challenge.id,
        title: challenge.title,
        type: challenge.type,
        icon: challenge.icon,
      };
      
      // Navigate to create-now with challenge context
      router.push({
        pathname: '/create-now',
        params: {
          challengeData: JSON.stringify(challengeData),
        },
      });
    } else {
      // Navigate to create-now without challenge context
      router.push('/create-now');
    }
  }, [requestPermission]);

  const handleRandomChallenge = useCallback(() => {
    const allChallenges = [...WEEKLY_CHALLENGES, ...UNIVERSITY_CHALLENGES];
    const randomIndex = Math.floor(Math.random() * allChallenges.length);
    setRandomChallenge(allChallenges[randomIndex]);
    setShowRandomModal(true);
    setSelectedFilter(null);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <Text style={styles.title}>Descubrir</Text>

      <View style={styles.searchContainer}>        <View style={styles.searchBarContainer}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar challenges, categorías, etc..."
            style={styles.searchBar}
          />
          <Pressable style={styles.diceButton} onPress={handleRandomChallenge}>
            <MaterialIcons name="casino" size={24} color="white" />
          </Pressable>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTERS.map((filter) => (
            <Tag
              key={filter.label}
              label={filter.label}
              icon={filter.icon ? <MaterialIcons name={filter.icon} size={18} color="white" /> : undefined}
              selected={selectedFilter === filter.label}
              onPress={() => setSelectedFilter(filter.label === selectedFilter ? null : filter.label)}
              style={styles.filterTag}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Challenges semanales</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.challengesRow}
        >          {WEEKLY_CHALLENGES.map((challenge) => (
            <WeeklyChallenge
              key={challenge.id}
              title={challenge.title}
              type={challenge.type}
              onParticipate={() => handleParticipate(challenge)}
            />
          ))}
        </ScrollView>        <Text style={styles.sectionTitle}>Sobre tu universidad</Text>
        <View style={styles.universityGrid}>
          {UNIVERSITY_CHALLENGES.map((challenge) => (
            <UniversityChallenge
              key={challenge.id}
              title={challenge.title}
              type={challenge.type}
              imageUrl="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg"
              onParticipate={() => handleParticipate(challenge)}
            />
          ))}
        </View>
      </ScrollView>
      <Modal
        visible={showRandomModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRandomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="casino" size={24} color="white" />
              <Text style={styles.modalTitle}>Challenge Aleatorio</Text>
              <Pressable onPress={() => setShowRandomModal(false)}>
                <MaterialIcons name="close" size={24} color="white" />
              </Pressable>
            </View>
            
            {randomChallenge && (
              <View style={styles.modalChallenge}>
                <View style={[
                  styles.challengeTypeIcon,
                  { backgroundColor: randomChallenge.type === 'video' ? '#7A9AEC' : '#FFC107' }
                ]}>
                  {randomChallenge.type === 'video' ? (
                    <MaterialIcons name="mic" size={20} color="white" />
                  ) : (
                    <MaterialIcons name="camera-alt" size={20} color="white" />
                  )}
                </View>
                <Text style={styles.challengeTitle}>{randomChallenge.title}</Text>
                
                <View style={styles.modalActions}>
                  <Pressable 
                    style={[styles.modalButton, styles.saveButton]} 
                    onPress={() => {
                      // TODO: Implementar guardar challenge
                      setShowRandomModal(false);
                    }}
                  >
                    <MaterialIcons name="bookmark-border" size={20} color="white" />
                    <Text style={styles.buttonText}>Guardar</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.modalButton, styles.participateButton]}
                    onPress={() => {
                      handleParticipate(randomChallenge || undefined);
                      setShowRandomModal(false);
                    }}
                  >
                    <MaterialIcons name="add-circle-outline" size={20} color="white" />
                    <Text style={styles.buttonText}>Participar</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: '600',
    marginHorizontal: SCREEN_WIDTH * 0.04,
    marginVertical: SCREEN_WIDTH * 0.02,
  },  searchContainer: {
    marginBottom: SCREEN_WIDTH * 0.02,
  },  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SCREEN_WIDTH * 0.04,
    gap: SCREEN_WIDTH * 0.02,
    marginBottom: SCREEN_WIDTH * 0.01,
  },
  searchBar: {
    flex: 1,
  },  diceButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SCREEN_WIDTH * 0.01,
  },  filtersContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    gap: SCREEN_WIDTH * 0.015,
  },filterTag: {
    marginRight: 0,
  },
  content: {
    flex: 1,
  },  sectionTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '600',
    marginLeft: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_WIDTH * 0.02,
    marginBottom: SCREEN_WIDTH * 0.03,
  },  challengesRow: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingBottom: SCREEN_WIDTH * 0.04,
    gap: SCREEN_WIDTH * 0.03,
  },universityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    gap: SCREEN_WIDTH * 0.02,
  },modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: '#1a1a1a',
    borderRadius: SCREEN_WIDTH * 0.03,
    padding: SCREEN_WIDTH * 0.04,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SCREEN_WIDTH * 0.04,
  },
  modalTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '600',
  },
  modalChallenge: {
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.03,
  },
  challengeTypeIcon: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: SCREEN_WIDTH * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SCREEN_WIDTH * 0.03,
    marginTop: SCREEN_WIDTH * 0.02,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SCREEN_WIDTH * 0.02,
    paddingVertical: SCREEN_WIDTH * 0.025,
    borderRadius: SCREEN_WIDTH * 0.02,
  },
  saveButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  participateButton: {
    backgroundColor: '#7A9AEC',
  },
  buttonText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '600',
  },
});
