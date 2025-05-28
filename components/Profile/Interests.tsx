import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type InterestItem = string;

type InterestsProps = {
  items?: InterestItem[];
  statusColor?: string;
};

export default function Interests({ 
  items = [],
  statusColor = '#7A9AEC'
}: InterestsProps) {
  const [interests, setInterests] = React.useState(items);
  React.useEffect(() => {
    loadInterests();
  }, []);

  // Recargar intereses cuando el componente recibe el foco
  useFocusEffect(
    React.useCallback(() => {
      loadInterests();
    }, [])
  );

  const loadInterests = async () => {
    try {
      const saved = await AsyncStorage.getItem('userInterests');
      if (saved) {
        setInterests(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading interests:', error);
    }
  };  const handlePress = () => {
    router.push('/edit-interests' as any);
  };

  const getStyles = (color: string) => StyleSheet.create({
    container: {
      backgroundColor: '#000',
      marginHorizontal: SCREEN_WIDTH * 0.04,
      marginTop: SCREEN_WIDTH * 0.03,
      borderRadius: SCREEN_WIDTH * 0.02,
      padding: SCREEN_WIDTH * 0.03,
    },    tagContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: color.startsWith('#') 
        ? `${color}33`
        : color.startsWith('rgb') 
          ? color.replace('rgb', 'rgba').replace(')', ', 0.2)') 
          : `${color}33`,
      borderWidth: 1,
      borderColor: color,
      borderRadius: SCREEN_WIDTH * 0.05,
      paddingVertical: SCREEN_WIDTH * 0.015,
      paddingHorizontal: SCREEN_WIDTH * 0.04,
    },
    interestText: {
      color: 'white',
      fontSize: SCREEN_WIDTH * 0.034,
      fontWeight: '500',
    },
    separator: {
      color: 'white',
      fontSize: SCREEN_WIDTH * 0.034,
      marginHorizontal: SCREEN_WIDTH * 0.04,
      opacity: 0.5,
    },
  });

  const styles = getStyles(statusColor);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>      <View style={styles.tagContainer}>
        {interests.map((interest, index) => (
          <React.Fragment key={index}>
            <Text style={styles.interestText}>{interest}</Text>
            {index < interests.length - 1 && <Text style={styles.separator}>•</Text>}
          </React.Fragment>
        ))}
      </View>
    </TouchableOpacity>
  );
}
