import Header from '@/components/General/Header';
import ProfileBanner from '@/components/Profile/Banner';
import { EmptyAgenda, EmptyNows } from '@/components/Profile/EmptyStates';
import ProfileInfo from '@/components/Profile/Info';
import Interests from '@/components/Profile/Interests';
import ProfileStats from '@/components/Profile/Stats';
import TabSlider, { TabOption } from '@/components/Profile/TabSlider';
import ProfileName from '@/components/Profile/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const [status, setStatus] = useState('Estudiante');
  const [statusColor, setStatusColor] = useState('rgb(88, 101, 242)');
  const [profileImage, setProfileImage] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [education, setEducation] = useState('');
  const [degree, setDegree] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTab, setSelectedTab] = useState<TabOption>('nows');

  const loadProfileData = async () => {
    try {
      const [
        hasChangedBefore,
        savedStatus,
        savedColor,
        savedImage,
        savedEducation,
        savedDegree,
        savedLocation
      ] = await Promise.all([
        AsyncStorage.getItem('userHasChangedStatus'),
        AsyncStorage.getItem('userStatus'),
        AsyncStorage.getItem('userStatusColor'),
        AsyncStorage.getItem('userProfileImage'),
        AsyncStorage.getItem('userEducation'),
        AsyncStorage.getItem('userDegree'),
        AsyncStorage.getItem('userLocation')
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
    } catch (error) {
      console.log('Error loading profile data:', error);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadProfileData();
  }, []);

  // Recargar datos cuando la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  // Handle status and color changes
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

  // Handle profile image changes
  const handleImageChange = async (uri: string) => {
    setProfileImage(uri);
    try {
      await AsyncStorage.setItem('userProfileImage', uri);
    } catch (error) {
      console.log('Error saving profile image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Perfil"
        points={1250}
        onSearchPress={() => router.push('/search')}
        rightIcon="settings"
        onRightPress={() => console.log('Settings pressed')}
      />
      <View style={styles.content}>
        <ProfileBanner
          statusText={status}
          statusColor={statusColor}
          onStatusChange={handleStatusChange}
          imageUri={profileImage}
          onImageChange={handleImageChange}
        />
        <ProfileName
          name="Carolina B.G."
          username="carool.bg"
        />
        <ProfileStats
          following={125}
          followers={1430}
          visits={2891}
        />
        <ProfileInfo
          items={[
            { type: 'education', text: degree && education ? `${degree} - ${education.split(' - ')[0]}` : 'Sin universidad' },
            { type: 'location', text: location || 'Sin ubicación' }
          ]}
        />
        <Interests statusColor={statusColor} />
        <TabSlider 
          onTabChange={setSelectedTab} 
          initialTab={selectedTab}
        />
        {selectedTab === 'nows' ? <EmptyNows /> : <EmptyAgenda />}
      </View>
    </View>
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
