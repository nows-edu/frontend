import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import DynamicIsland from '../../components/Home/DynamicIsland';
import NowsFeed from '../../components/Home/NowsFeed';
import TopBar from '../../components/Home/TopBar';
import * as api from '../../services/api';

// Mock data para los enunciados
const MOCK_STATEMENTS = {
  challenges: [
    "Enseña el spot más infravalorado de la Universidad Autónoma de Barcelona.",
    "Muestra el rincón más fotogénico del campus.",
    "¿Cuál es el mejor lugar para estudiar en la biblioteca?",
  ],
  opinions: [
    "¿Qué opinas sobre las clases híbridas?",
    "¿Cómo mejorarías los espacios de estudio?",
    "¿Qué cambiarías del sistema de evaluación?",
  ]
};

// Mock user ID - in a real app this would come from authentication
const CURRENT_USER_ID = 'current-user-123';

export default function HomeScreen() {
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [currentStatement, setCurrentStatement] = useState({
    type: 'Reto' as 'Reto' | 'Opinión',
    statement: MOCK_STATEMENTS.challenges[0]
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
              const isChallenge = item.contentType === 'challenge';
              const statements = isChallenge ? MOCK_STATEMENTS.challenges : MOCK_STATEMENTS.opinions;
              setCurrentStatement({
                type: isChallenge ? 'Reto' : 'Opinión',
                statement: statements[Math.floor(Math.random() * statements.length)]
              });
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
            <DynamicIsland
              type={currentStatement.type}
              statement={currentStatement.statement}
            />
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
