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
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock profile data for current user
const CURRENT_USER_PROFILE = {
  name: 'Aina F.C.',
  username: 'aina.fc',
  status: 'DIVA',
  statusColor: 'rgb(250, 38, 38)',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  interests: ['Tecnología', 'Apps', 'Música'],
};

export default function ProfileScreen() {
  // Estado para el perfil del usuario actual
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
        savedEducation,
        savedDegree,
        savedLocation,
        savedCareerItems,
      ] = await Promise.all([
        AsyncStorage.getItem('hasChangedBefore'),
        AsyncStorage.getItem('userStatus'),
        AsyncStorage.getItem('userStatusColor'),
        AsyncStorage.getItem('userProfileImage'),
        AsyncStorage.getItem('userEducation'),
        AsyncStorage.getItem('userDegree'),
        AsyncStorage.getItem('userLocation'),
        AsyncStorage.getItem('userCareerItems'),
      ]);

      if (hasChangedBefore === null) {
        await AsyncStorage.setItem('hasChangedBefore', 'true');
        setIsFirstLoad(false);
      }

      if (savedStatus) setStatus(savedStatus);
      if (savedColor) setStatusColor(savedColor);
      if (savedImage) setProfileImage(savedImage);
      if (savedEducation) setEducation(savedEducation);
      if (savedDegree) setDegree(savedDegree);
      if (savedLocation) setLocation(savedLocation);
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
      loadProfileData();
      setRefreshKey(prev => prev + 1); // Force component refresh
    }, [])
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

  return (
    <>
      <View style={styles.container}>
        <Header title="Perfil" points={350} />
        <ScrollView style={styles.content}>
          <ProfileBanner
            key={`banner-${refreshKey}`}
            statusText={status}
            statusColor={statusColor}
            onStatusChange={handleStatusChange}
            imageUri={profileImage}
            onImageChange={handleImageChange}
            isEditable={true}
          />
          <UserDisplay
            name={CURRENT_USER_PROFILE.name}
            username={CURRENT_USER_PROFILE.username}
          />
          <ProfileStats
            following={followingCount}
            followers={followerCount}
            visits={visitCount}
            userId={currentUserId}
          />
          <ProfileInfo
            key={`info-${refreshKey}`}
            items={[
              { type: 'education', text: education },
              { type: 'degree', text: degree },
              { type: 'location', text: location }
            ]}
            isEditable={true}
          />
          <Interests
            key={`interests-${refreshKey}`}
            items={CURRENT_USER_PROFILE.interests}
            statusColor={statusColor}
            isEditable={true}
          />
          <TabSlider onTabChange={setSelectedTab} initialTab={selectedTab} />
          {selectedTab === 'nows' && <EmptyNows isOwnProfile={true} />}
          {selectedTab === 'agenda' && <EmptyAgenda />}
          {selectedTab === 'career' && (
            <Career
              items={careerItems}
              color={statusColor}
              onAddItem={() => setIsModalVisible(true)}
              onEditItem={handleEditCareerItem}
              onDeleteItem={handleDeleteCareerItem}
            />
          )}
        </ScrollView>
      </View>
      <CareerModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingItem(null);
        }}
        onSave={handleSaveCareerItem}
        color={statusColor}
        initialValues={editingItem?.item}
        isEditing={!!editingItem}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
});
