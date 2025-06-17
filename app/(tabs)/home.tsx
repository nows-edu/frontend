import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import NowsFeed from '../../components/Home/NowsFeed';
import TopBar from '../../components/Home/TopBar';



// Simulated API functions
const fetchCategoriesFromAPI = async () => {
  // Simulating API request with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return ['Retos', 'Opiniones', 'Usuarios', 'Clubes', 'Comunidades', 'Actividades'];
};

const fetchSelectedCategoriesFromAPI = async () => {
  // Simulating API request with a delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return ['Populares', 'Nuevos'];
};

const updateSelectedCategoriesInAPI = async (categories: string[]) => {
  // Simulating API request with a delay
  await new Promise(resolve => setTimeout(resolve, 700));
  console.log('Categories updated in backend:', categories);
  return true;
};

export default function HomeScreen() {
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Load categories data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [categories, selected] = await Promise.all([
          fetchCategoriesFromAPI(),
          fetchSelectedCategoriesFromAPI()
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
      await updateSelectedCategoriesInAPI(newSelectedOptions);
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
      <NowsFeed selectedCategories={selectedOptions} />

      <View style={styles.topBarContainer}>
        {isLoading ? (
            <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#7A9AEC"  />
        ) : (
          <TopBar
            points={1250}
            filterOptions={filterOptions}
            selectedOptions={selectedOptions}
            onOptionToggle={handleOptionToggle}
            isUpdating={isUpdating}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // The background is transparent, so it floats over the feed
  },

});
