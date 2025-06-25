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
  isEditable?: boolean;
};

export default function Interests(props: InterestsProps) {
  const {
    items = [],
    statusColor = '#7A9AEC',
    isEditable = true
  } = props;
  const [interests, setInterests] = React.useState<InterestItem[]>([]);

  React.useEffect(() => {
    if (isEditable) {
      loadInterests();
    } else {
      // Para perfiles externos, usar solo los items de las props
      setInterests(items);
    }
  }, [isEditable, items]);

  // Recargar intereses cuando el componente recibe el foco (solo si es editable)
  useFocusEffect(
    React.useCallback(() => {
      if (isEditable) {
        loadInterests();
      } else {
        // Asegurar que los perfiles externos siempre usen los items de las props
        setInterests(items);
      }
    }, [isEditable, items])
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
  };

  const handlePress = () => {
    if (isEditable) {
      router.push('/edit-interests');
    }
  };

  const getStyles = (color: string) => StyleSheet.create({
    container: {
      backgroundColor: '#000',
      marginHorizontal: SCREEN_WIDTH * 0.04,
      marginTop: SCREEN_WIDTH * 0.01,
      borderRadius: SCREEN_WIDTH * 0.02,
      padding: SCREEN_WIDTH * 0.03,
    },
    tagContainer: {
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
  const Container = isEditable ? TouchableOpacity : View;

  return (
    <Container style={styles.container} {...(isEditable ? { onPress: handlePress } : {})}>
      <View style={styles.tagContainer}>
        {interests.map((interest, index) => (
          <React.Fragment key={index}>
            <Text style={styles.interestText}>{interest}</Text>
            {index < interests.length - 1 && <Text style={styles.separator}>•</Text>}
          </React.Fragment>
        ))}
      </View>
    </Container>
  );
}
