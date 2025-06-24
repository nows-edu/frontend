import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
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

      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => router.push('/create-now')}
      >
        <Text style={styles.createButtonText}>+ NOW</Text>
      </TouchableOpacity>
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
  createButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    zIndex: 1000,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
