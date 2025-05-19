import Header from '@/components/General/Header';
import ProfileBanner from '@/components/Profile/Banner';
import ProfileInfo from '@/components/Profile/Info';
import ProfileStats from '@/components/Profile/Stats';
import ProfileName from '@/components/Profile/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const [status, setStatus] = useState('Estudiante');
  const [statusColor, setStatusColor] = useState('rgb(88, 101, 242)');
  const [profileImage, setProfileImage] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Load saved profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const hasChangedBefore = await AsyncStorage.getItem('userHasChangedStatus');
        if (hasChangedBefore === 'true') {
          const savedStatus = await AsyncStorage.getItem('userStatus');
          const savedColor = await AsyncStorage.getItem('userStatusColor');
          if (savedStatus) setStatus(savedStatus);
          if (savedColor) setStatusColor(savedColor);
        } else if (isFirstLoad) {
          // Si es la primera carga y no hay cambios previos, guardamos los valores predeterminados
          await AsyncStorage.setItem('userStatus', status);
          await AsyncStorage.setItem('userStatusColor', statusColor);
          setIsFirstLoad(false);
        }

        const savedImage = await AsyncStorage.getItem('userProfileImage');
        if (savedImage) setProfileImage(savedImage);
      } catch (error) {
        console.log('Error loading profile data:', error);
      }
    };
    
    loadProfileData();
  }, []);
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
            { type: 'education', text: 'Ingeniería Informática - UAB' },
            { type: 'location', text: 'Sant Cugat del Vallés' }
          ]}
        />
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
