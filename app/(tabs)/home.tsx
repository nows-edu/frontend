import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import DynamicIsland from '../../components/Home/DynamicIsland';
import NowsFeed from '../../components/Home/NowsFeed';
import TopBar from '../../components/Home/TopBar';
import * as api from '../../services/api';

// Mock user ID - in a real app this would come from authentication
const CURRENT_USER_ID = 'current-user-123';

export default function HomeScreen() {
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [currentStatement, setCurrentStatement] = useState({
    type: 'Reto' as 'Reto' | 'Opinión' | 'Usuario',
    statement: 'Enseña el spot más infravalorado de tu biblioteca universitaria',
    profileData: undefined as any
  });
  const router = useRouter();

  // Load categories data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [categories, selected] = await Promise.all([
          api.fetchCategories(),
          api.fetchSelectedCategories(CURRENT_USER_ID)
        ]);
        setFilterOptions(categories);
        setSelectedOptions(selected);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleOptionToggle = async (option: string) => {
    setIsUpdating(true);
    
    // Update local state immediately for better UX
    let newSelectedOptions;
    if (selectedOptions.includes(option)) {
      newSelectedOptions = selectedOptions.filter(item => item !== option);
    } else {
      newSelectedOptions = [...selectedOptions, option];
    }
    setSelectedOptions(newSelectedOptions);
    
    try {
      // Send update to backend
      await api.updateSelectedCategories(newSelectedOptions, CURRENT_USER_ID);
    } catch (error) {
      console.error('Error updating categories:', error);
      // Revert to previous state if API call fails
      setSelectedOptions(selectedOptions);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <>
          <NowsFeed 
            selectedCategories={selectedOptions}
            onItemChange={(item) => {
              // Manejar diferentes tipos de contenido
              if (item.contentType === 'user-profile' && item.profileData) {
                setCurrentStatement({
                  type: 'Usuario',
                  statement: item.author.name, // Usar el nombre como "statement"
                  profileData: {
                    education: item.profileData.education,
                    location: item.profileData.location,
                    interests: item.profileData.interests
                  }
                });
              } else if (item.contentType !== 'user-profile' && item.statement) {
                const isChallenge = item.contentType === 'challenge';
                setCurrentStatement({
                  type: isChallenge ? 'Reto' : 'Opinión',
                  statement: item.statement,
                  profileData: undefined
                });
              } else {
                // Limpiar el statement para contenido sin statement
                setCurrentStatement({
                  type: 'Reto',
                  statement: '',
                  profileData: undefined
                });
              }
            }}
          />
          <View style={styles.overlay}>
            <TopBar 
              points={180}
              filterOptions={filterOptions}
              selectedOptions={selectedOptions}
              onOptionToggle={handleOptionToggle}
              isUpdating={isUpdating}
            />
            {/* Solo mostrar DynamicIsland si el item actual tiene contenido válido */}
            {currentStatement.statement && (
              <DynamicIsland
                type={currentStatement.type}
                statement={currentStatement.statement}
                profileData={currentStatement.profileData}
              />
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
