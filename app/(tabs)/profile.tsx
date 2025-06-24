import Header from '@/components/General/Header';
import ProfileBanner from '@/components/Profile/Banner';
import Career from '@/components/Profile/Career';
import CareerModal from '@/components/Profile/CareerModal';
import { EmptyAgenda, EmptyNows } from '@/components/Profile/EmptyStates';
import FollowButton from '@/components/Profile/FollowButton';
import ProfileInfo from '@/components/Profile/Info';
import Interests from '@/components/Profile/Interests';
import ProfileStats from '@/components/Profile/Stats';
import TabSlider, { TabOption } from '@/components/Profile/TabSlider';
import UserDisplay from '@/components/Profile/UserDisplay';
import { CareerItem } from '@/types/career';
import { followService } from '@/utils/followService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock profiles data (this would come from your API in a real app)
const MOCK_PROFILES = {
  '1': {
    name: 'Aina F.C.',
    username: 'aina.fc',
    status: 'DIVA',
    statusColor: 'rgb(250, 38, 38)',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    following: 234,
    followers: 1892,
    visits: 3478,
    education: 'Ingeniería Informática - UPC',
    location: 'Barcelona, España',
    interests: ['Tecnología', 'Apps', 'Música'],    career: [
      { 
        year: '2023', 
        achievement: 'Presidenta ELSA SPAIN',
        description: 'Liderazgo de la asociación europea de estudiantes de derecho en España. Gestión de equipos, organización de eventos y representación internacional.'
      },
      { 
        year: '2022', 
        achievement: 'Miembro activo del Club de Debate',
        description: 'Participación en torneos nacionales e internacionales de debate universitario. Desarrollo de habilidades de argumentación y oratoria.'
      },
      { 
        year: '2021', 
        achievement: 'Delegada de curso',
        description: 'Representante estudiantil del grado en ADE + Derecho. Coordinación con profesorado y mediación en asuntos académicos.'
      },
      { 
        year: '2019', 
        achievement: 'Inicio ADE + Derecho (UAB)',
        description: 'Comienzo del doble grado en Administración y Dirección de Empresas y Derecho en la Universidad Autónoma de Barcelona.'
      }
    ]
  },
  '2': {
    name: 'Jan G.S.',
    username: 'jan.gs',
    status: '🎵 Music Producer',
    statusColor: 'rgb(88, 101, 242)',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    following: 567,
    followers: 2341,
    visits: 5432,
    education: 'Producción Musical - ESMUC',
    location: 'Barcelona, España',
    interests: ['Música', 'DJ', 'Instrumentos'],
    career: [
      { year: '2023', achievement: 'Productor en Universal Music' },
      { year: '2021', achievement: 'DJ Residente en Club XYZ' },
      { year: '2020', achievement: 'Productor Independiente' }
    ]
  },
};

export default function ProfileScreen() {
  const params = useLocalSearchParams();
  const userId = typeof params.userId === 'string' ? params.userId : Array.isArray(params.userId) ? params.userId[0] : undefined;
  const [status, setStatus] = useState('Estudiante');
  const [statusColor, setStatusColor] = useState('rgb(88, 101, 242)');
  const [profileImage, setProfileImage] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [education, setEducation] = useState('');
  const [degree, setDegree] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTab, setSelectedTab] = useState<TabOption>('nows');
  const [careerItems, setCareerItems] = useState<Array<{ year: string; achievement: string; description?: string; }>>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [editingItem, setEditingItem] = useState<{ index: number; item: CareerItem } | null>(null);

  const isOwnProfile = !userId;
  const currentUserId = 'carol'; // For now, hardcoded as 'carol'
  const otherUserProfile = userId ? MOCK_PROFILES[userId as keyof typeof MOCK_PROFILES] : null;

  // Load follow stats
  const loadFollowStats = useCallback(async () => {
    if (!isOwnProfile && userId) {
      try {
        // Check if current user is following the profile user
        const following = await followService.isFollowing(currentUserId, userId);
        setIsFollowing(following);

        // Get stats
        const stats = await followService.getUserStats(userId);
        setFollowerCount(stats.followers);
        setFollowingCount(stats.following);
        setVisitCount(stats.visits);

        // Record visit
        await followService.recordVisit(currentUserId, userId);
      } catch (error) {
        console.error('Error loading follow stats:', error);
      }
    } else if (isOwnProfile) {
      try {
        const stats = await followService.getUserStats(currentUserId);
        setFollowerCount(stats.followers);
        setFollowingCount(stats.following);
        setVisitCount(stats.visits);
      } catch (error) {
        console.error('Error loading own stats:', error);
      }
    }
  }, [isOwnProfile, userId]);

  useEffect(() => {
    loadFollowStats();
  }, [loadFollowStats]);

  useFocusEffect(
    useCallback(() => {
      loadFollowStats();
    }, [loadFollowStats])
  );
  const handleSaveCareerItem = async (item: { year: string; achievement: string; description: string }) => {
    let updatedItems;
    
    if (editingItem !== null) {
      // Update existing item
      updatedItems = careerItems.map((oldItem, index) => 
        index === editingItem.index ? item : oldItem
      );
      setEditingItem(null);
    } else {
      // Add new item
      updatedItems = [...careerItems, item];
    }
    
    setCareerItems(updatedItems);
    try {
      await AsyncStorage.setItem('userCareerItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving career item:', error);
    }
  };

  const handleToggleFollow = async () => {
    if (!userId) return;
    
    try {
      if (isFollowing) {
        await followService.unfollowUser(currentUserId, userId);
        setFollowerCount(prev => prev - 1);
      } else {
        await followService.followUser(currentUserId, userId);
        setFollowerCount(prev => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const loadProfileData = async () => {
    if (isOwnProfile) {
      try {
        const [
          hasChangedBefore,
          savedStatus,
          savedColor,
          savedImage,
          savedEducation,
          savedDegree,
          savedLocation,
          savedCareerItems
        ] = await Promise.all([
          AsyncStorage.getItem('userHasChangedStatus'),
          AsyncStorage.getItem('userStatus'),
          AsyncStorage.getItem('userStatusColor'),
          AsyncStorage.getItem('userProfileImage'),
          AsyncStorage.getItem('userEducation'),
          AsyncStorage.getItem('userDegree'),
          AsyncStorage.getItem('userLocation'),
          AsyncStorage.getItem('userCareerItems')
        ]);

        if (hasChangedBefore === 'true') {
          if (savedStatus) setStatus(savedStatus);
          if (savedColor) setStatusColor(savedColor);
        } else if (isFirstLoad) {
          await AsyncStorage.setItem('userStatus', status);
          await AsyncStorage.setItem('userStatusColor', statusColor);
          setIsFirstLoad(false);
        }

        if (savedImage) setProfileImage(savedImage);
        if (savedEducation) setEducation(savedEducation);
        if (savedDegree) setDegree(savedDegree);
        if (savedLocation) setLocation(savedLocation);
        if (savedCareerItems) setCareerItems(JSON.parse(savedCareerItems));
      } catch (error) {
        console.log('Error loading profile data:', error);
      }
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [isOwnProfile]);

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [isOwnProfile])
  );

  const handleStatusChange = async (newStatus: string, newColor: string) => {
    setStatus(newStatus);
    setStatusColor(newColor);
    try {
      await AsyncStorage.setItem('userStatus', newStatus);
      await AsyncStorage.setItem('userStatusColor', newColor);
      await AsyncStorage.setItem('userHasChangedStatus', 'true');
    } catch (error) {
      console.log('Error saving status:', error);
    }
  };

  const handleImageChange = async (uri: string) => {
    setProfileImage(uri);
    try {
      await AsyncStorage.setItem('userProfileImage', uri);
    } catch (error) {
      console.log('Error saving profile image:', error);
    }
  };

  const handleAddCareerItem = (item: { year: string; achievement: string; description: string }) => {
    setCareerItems(prev => [...prev, item]);
    // TODO: Persist to AsyncStorage in a real implementation
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

  if (otherUserProfile) {
    const tabs: TabOption[] = ['nows', 'career'];

    return (
      <>
        <View style={styles.container}>
          <SafeAreaView edges={['top']} style={styles.header}>
            <View style={styles.headerContent}>
              <IconButton
                icon="arrow-left"
                iconColor="white"
                size={24}
                onPress={() => router.back()}
                style={styles.backButton}
              />
              <View style={{ width: 40 }} />
            </View>
            <View style={styles.divider} />
          </SafeAreaView>          <ScrollView style={styles.content}>            <ProfileBanner
              statusText={otherUserProfile.status}
              statusColor={otherUserProfile.statusColor}
              imageUri={otherUserProfile.avatarUrl}
              isEditable={false}
            />            <UserDisplay
              name={otherUserProfile.name}
              username={otherUserProfile.username}
              rightContent={
                <FollowButton
                  isFollowing={isFollowing}
                  onToggleFollow={handleToggleFollow}
                />
              }
            />
            <ProfileStats
              following={followingCount}
              followers={followerCount}
              visits={visitCount}
              showBackground={false}
              userId={userId as string}
            />
            <ProfileInfo
              items={[
                { type: 'education', text: otherUserProfile.education },
                { type: 'location', text: otherUserProfile.location }
              ]}
            />
            <Interests 
              items={otherUserProfile.interests}
              statusColor={otherUserProfile.statusColor}
              isEditable={false}
            />            <TabSlider 
              onTabChange={setSelectedTab}
              initialTab={selectedTab}
              tabs={tabs}
              labels={{
                nows: 'Nows',
                career: 'Trayectoria'
              }}
            />
            
            {selectedTab === 'nows' ? (              <EmptyNows isOwnProfile={false} />
            ) : (
              <Career items={otherUserProfile.career} color={otherUserProfile.statusColor} />
            )}
          </ScrollView>
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Perfil"
        points={1250}
        onSearchPress={() => router.push('/search')}
        rightIcon="settings"
        onRightPress={() => console.log('Settings pressed')}
      />      <ScrollView style={styles.content}>        <ProfileBanner
          statusText={status}
          statusColor={statusColor}
          imageUri={profileImage}
          isEditable={true}
          onStatusChange={handleStatusChange}
          onImageChange={handleImageChange}
        />
        <UserDisplay
          name="Carol B.G."
          username="carool.bg"
        />          <ProfileStats
          following={followingCount}
          followers={followerCount}
          visits={visitCount}
          showBackground={false}
          userId={currentUserId}
        /><ProfileInfo
          items={[
            { type: 'education', text: education || degree },
            { type: 'location', text: location }
          ]}          isEditable={true}
        />
        <Interests
          statusColor={statusColor}
          isEditable={true}
        />        <TabSlider
          onTabChange={setSelectedTab}
          initialTab={selectedTab}
          tabs={['nows', 'career', 'agenda']}
          labels={{
            nows: 'Nows',
            career: 'Trayectoria',
            agenda: 'Agenda'
          }}
        />
        {selectedTab === 'nows' ? (
          <EmptyNows />        ) : selectedTab === 'career' ? (
          <>            <Career 
              items={careerItems} 
              color={statusColor}
              isEditable={true}
              onAddItem={() => {
                setEditingItem(null);
                setIsModalVisible(true);
              }}
              onEditItem={handleEditCareerItem}
              onDeleteItem={handleDeleteCareerItem}
            />            <CareerModal
              visible={isModalVisible}
              onClose={() => {
                setIsModalVisible(false);
                setEditingItem(null);
              }}
              onSave={handleSaveCareerItem}
              color={statusColor}
              initialValues={editingItem?.item}
              isEditing={!!editingItem}
              onDelete={editingItem ? () => handleDeleteCareerItem(editingItem.index) : undefined}
            />
          </>
        ) : (
          <EmptyAgenda text="Aquí podrás ver tus actividades y eventos" />
        )}
      </ScrollView>
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
    height: SCREEN_WIDTH * 0.1,
  },
  backButton: {
    margin: 0,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flex: 1,
  },
});
