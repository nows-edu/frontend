import Header from '@/components/General/Header';
import ProfileBanner from '@/components/Profile/Banner';
import Career from '@/components/Profile/Career';
import CareerModal from '@/components/Profile/CareerModal';
import { EmptyAgenda, EmptyNows } from '@/components/Profile/EmptyStates';
import ProfileInfo from '@/components/Profile/Info';
import Interests from '@/components/Profile/Interests';
import ProfileStats from '@/components/Profile/Stats';
import TabSlider, { TabOption } from '@/components/Profile/TabSlider';
import UserDisplay from '@/components/Profile/UserDisplay';
import { CareerItem } from '@/types/career';
import { followService } from '@/utils/followService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock profile data for current user
const CURRENT_USER_PROFILE = {
  name: 'Aina F.C.',
  username: 'aina.fc',
  status: 'DIVA',
  statusColor: 'rgb(250, 38, 38)',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  interests: ['Tecnología', 'Apps', 'Música'],
  university: 'Universidad Politécnica de Catalunya',
  universityAcronym: 'UPC',
  degree: 'Ingeniería Informática',
  location: 'Barcelona, España',
};

export default function ProfileScreen() {
  // Estado para el perfil del usuario actual
  const [status, setStatus] = useState(CURRENT_USER_PROFILE.status);
  const [statusColor, setStatusColor] = useState(CURRENT_USER_PROFILE.statusColor);
  const [profileImage, setProfileImage] = useState(CURRENT_USER_PROFILE.avatarUrl);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [university, setUniversity] = useState(CURRENT_USER_PROFILE.university);
  const [universityAcronym, setUniversityAcronym] = useState(CURRENT_USER_PROFILE.universityAcronym);
  const [degree, setDegree] = useState(CURRENT_USER_PROFILE.degree);
  const [location, setLocation] = useState(CURRENT_USER_PROFILE.location);
  const [selectedTab, setSelectedTab] = useState<TabOption>('nows');
  const [careerItems, setCareerItems] = useState<CareerItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [editingItem, setEditingItem] = useState<{ index: number; item: CareerItem } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Key to force component re-render

  const currentUserId = 'carol'; // ID del usuario actual

  // Cargar estadísticas del usuario actual
  const loadFollowStats = useCallback(async () => {
    try {
      const stats = await followService.getUserStats(currentUserId);
      setFollowerCount(stats.followers);
      setFollowingCount(stats.following);
      setVisitCount(stats.visits);
    } catch (error) {
      console.error('Error loading own stats:', error);
    }
  }, [currentUserId]);

  useEffect(() => {
    loadFollowStats();
  }, [loadFollowStats]);

  const handleSaveCareerItem = async (item: CareerItem) => {
    if (editingItem) {
      // Editar item existente
      const updatedItems = [...careerItems];
      updatedItems[editingItem.index] = item;
      setCareerItems(updatedItems);
      try {
        await AsyncStorage.setItem('userCareerItems', JSON.stringify(updatedItems));
      } catch (error) {
        console.error('Error updating career item:', error);
      }
      setEditingItem(null);
    } else {
      // Añadir nuevo item
      const newItems = [...careerItems, item];
      setCareerItems(newItems);
      try {
        await AsyncStorage.setItem('userCareerItems', JSON.stringify(newItems));
      } catch (error) {
        console.error('Error saving career item:', error);
      }
    }
    setIsModalVisible(false);
  };

  const loadProfileData = async () => {
    try {
      const [
        hasChangedBefore,
        savedStatus,
        savedColor,
        savedImage,
        savedUniversity,
        savedUniversityAcronym,
        savedDegree,
        savedLocation,
        savedCareerItems,
      ] = await Promise.all([
        AsyncStorage.getItem('hasChangedBefore'),
        AsyncStorage.getItem('userStatus'),
        AsyncStorage.getItem('userStatusColor'),
        AsyncStorage.getItem('userProfileImage'),
        AsyncStorage.getItem('userUniversity'),
        AsyncStorage.getItem('userUniversityAcronym'),
        AsyncStorage.getItem('userDegree'),
        AsyncStorage.getItem('userLocation'),
        AsyncStorage.getItem('userCareerItems'),
      ]);

      if (hasChangedBefore === null) {
        await AsyncStorage.setItem('hasChangedBefore', 'true');
        setIsFirstLoad(false);
      }

      if (savedStatus) setStatus(savedStatus);
      else setStatus(CURRENT_USER_PROFILE.status);
      
      if (savedColor) setStatusColor(savedColor);
      else setStatusColor(CURRENT_USER_PROFILE.statusColor);
      
      if (savedImage) setProfileImage(savedImage);
      else setProfileImage(CURRENT_USER_PROFILE.avatarUrl);
      
      if (savedUniversity) setUniversity(savedUniversity);
      else setUniversity(CURRENT_USER_PROFILE.university);
      
      if (savedUniversityAcronym) setUniversityAcronym(savedUniversityAcronym);
      else setUniversityAcronym(CURRENT_USER_PROFILE.universityAcronym);
      
      if (savedDegree) setDegree(savedDegree);
      else setDegree(CURRENT_USER_PROFILE.degree);
      
      if (savedLocation) setLocation(savedLocation);
      else setLocation(CURRENT_USER_PROFILE.location);
      if (savedCareerItems) {
        setCareerItems(JSON.parse(savedCareerItems));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Asegurar que estamos en el perfil propio
      console.log('ProfileScreen focused - loading own profile data');
      loadProfileData();
      loadFollowStats();
      setRefreshKey(prev => prev + 1); // Force component refresh
    }, [loadFollowStats])
  );

  const handleStatusChange = async (newStatus: string, newColor: string) => {
    setStatus(newStatus);
    setStatusColor(newColor);
    try {
      await AsyncStorage.setItem('userStatus', newStatus);
      await AsyncStorage.setItem('userStatusColor', newColor);
    } catch (error) {
      console.error('Error saving status:', error);
    }
  };

  const handleImageChange = async (uri: string) => {
    setProfileImage(uri);
    try {
      await AsyncStorage.setItem('userProfileImage', uri);
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  const handleEditCareerItem = (index: number, item: CareerItem) => {
    setEditingItem({ index, item });
    setIsModalVisible(true);
  };

  const handleDeleteCareerItem = async (index: number) => {
    const updatedItems = careerItems.filter((_, i) => i !== index);
    setCareerItems(updatedItems);
    try {
      await AsyncStorage.setItem('userCareerItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error deleting career item:', error);
    }
  };

  const profileInfo = [
    {
      type: 'education',
      text: `${universityAcronym} - ${degree}`,
    },
    {
      type: 'location',
      text: location,
    },
  ];

  // Cargar datos iniciales de ejemplo para la trayectoria
  const loadInitialCareerItems = async () => {
    const initialItems: CareerItem[] = [
      {
        year: '2025',
        university: 'Universidad Politécnica de Catalunya',
        universityAcronym: 'UPC',
        degree: 'Grado en Ingeniería Informática',
        achievement: 'Especialización en Software y Mobile',
        description: 'Cursando último año del grado. Especialización en Ingeniería del Software y desarrollo de aplicaciones móviles. Participación activa en proyectos de innovación universitaria.'
      },
      {
        year: '2024',
        university: 'Technische Universität München',
        universityAcronym: 'TUM',
        degree: 'Erasmus en Computer Science',
        achievement: 'Foco en AI y Cloud Computing',
        description: 'Programa de intercambio Erasmus+. Foco en Inteligencia Artificial y Computación en la Nube. Participación en el hackathon TUM.ai y desarrollo de proyectos de machine learning.'
      },
      {
        year: '2023',
        university: 'Universidad Politécnica de Catalunya',
        universityAcronym: 'UPC',
        degree: 'Ingreso en Ingeniería Informática',
        achievement: 'Primer año con excelencia',
        description: 'Inicio del grado con excelencia académica. Participación en el programa de mentoring para nuevos estudiantes. Desarrollo de una aplicación de gestión académica que se implementó en la facultad.'
      }
    ];

    try {
      const existingItems = await AsyncStorage.getItem('userCareerItems');
      if (!existingItems) {
        setCareerItems(initialItems);
        await AsyncStorage.setItem('userCareerItems', JSON.stringify(initialItems));
      }
    } catch (error) {
      console.error('Error loading initial career items:', error);
    }
  };

  useEffect(() => {
    loadInitialCareerItems();
  }, []);

  return (
    <View style={styles.container}>
      <Header points={180} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileBanner 
          imageUri={profileImage}
          statusColor={statusColor}
          statusText={status}
          isEditable={true}
          onStatusChange={(newStatus, newColor) => {
            setStatus(newStatus);
            setStatusColor(newColor);
          }}
          onImageChange={setProfileImage}
        />
        <View style={styles.contentWrapper}>
          <UserDisplay
            name={CURRENT_USER_PROFILE.name}
            username={CURRENT_USER_PROFILE.username}
            isEditable={true}
          />
          <ProfileStats
            following={followingCount}
            followers={followerCount}
            visits={visitCount}
            userId={CURRENT_USER_PROFILE.username}
          />
          <ProfileInfo
            items={profileInfo}
            isEditable={true}
          />
          <Interests
            key={`interests-${refreshKey}`}
            items={CURRENT_USER_PROFILE.interests}
            statusColor={statusColor}
            isEditable={true}
          />
          <TabSlider
            onTabChange={setSelectedTab}
            initialTab={selectedTab}
            tabs={['nows', 'career', 'agenda']}
          />

          {selectedTab === 'nows' && (
            <View style={styles.sectionContainer}>
              <EmptyNows />
            </View>
          )}

          {selectedTab === 'agenda' && (
            <View style={styles.sectionContainer}>
              <EmptyAgenda />
            </View>
          )}

          {selectedTab === 'career' && (
            <View style={styles.sectionContainer}>
              <Career
                items={careerItems}
                color={statusColor}
                isEditable={true}
                onAddItem={() => {
                  setEditingItem(null);
                  setIsModalVisible(true);
                }}
                onEditItem={handleEditCareerItem}
                onDeleteItem={handleDeleteCareerItem}
              />
            </View>
          )}

          <CareerModal
            visible={isModalVisible}
            onClose={() => {
              setIsModalVisible(false);
              setEditingItem(null);
            }}
            onSave={handleSaveCareerItem}
            onDelete={editingItem ? () => {
              handleDeleteCareerItem(editingItem.index);
              setIsModalVisible(false);
              setEditingItem(null);
            } : undefined}
            color={statusColor}
            initialValues={editingItem?.item}
            isEditing={!!editingItem}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 80 : 60, // Más padding para bajar todo el contenido aún más
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
});
