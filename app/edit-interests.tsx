import Tag from '@/components/General/Tag';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AVAILABLE_INTERESTS = [
  { emoji: '🎵', name: 'Música' },
  { emoji: '📸', name: 'Fotografía' },
  { emoji: '✈️', name: 'Viajes' },
  { emoji: '📚', name: 'Lectura' },
  { emoji: '🎮', name: 'Videojuegos' },
  { emoji: '🎨', name: 'Arte' },
  { emoji: '🎬', name: 'Cine' },
  { emoji: '🏃', name: 'Deporte' },
  { emoji: '🍳', name: 'Cocina' },
  { emoji: '🌱', name: 'Naturaleza' },
  { emoji: '💻', name: 'Tecnología' },
  { emoji: '🎭', name: 'Teatro' },
  { emoji: '📱', name: 'Apps' },
  { emoji: '🎸', name: 'Instrumentos' },
  { emoji: '🎧', name: 'DJ' },
  { emoji: '⚽', name: 'Fútbol' },
  { emoji: '🏀', name: 'Baloncesto' },
  { emoji: '🎾', name: 'Tenis' },
  { emoji: '🏊', name: 'Natación' },
  { emoji: '🧘', name: 'Yoga' },
  { emoji: '✍️', name: 'Escritura' },
  { emoji: '🎤', name: 'Karaoke' },
  { emoji: '🎯', name: 'Dardos' },
  { emoji: '🎲', name: 'Juegos mesa' },
  { emoji: '🏃‍♀️', name: 'Running' },
  { emoji: '🚴', name: 'Ciclismo' },
  { emoji: '🎪', name: 'Circo' },
  { emoji: '🎹', name: 'Piano' },
  { emoji: '🎨', name: 'Pintura' },
  { emoji: '📷', name: 'Cámaras' },
];

export default function EditInterestsScreen() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    loadSavedInterests();
  }, []);

  const loadSavedInterests = async () => {
    try {
      const saved = await AsyncStorage.getItem('userInterests');
      if (saved) {
        setSelectedInterests(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading interests:', error);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, interest];
    });
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('userInterests', JSON.stringify(selectedInterests));
      router.back();
    } catch (error) {
      console.error('Error saving interests:', error);
    }
  };

  const isInterestSelected = (interest: string) => selectedInterests.includes(interest);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconButton
            icon="chevron-left"
            iconColor="white"
            size={28}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar intereses</Text>
        <TouchableOpacity 
          onPress={handleSave}
          disabled={selectedInterests.length !== 3}
        >
          <Text style={[
            styles.saveButton,
            selectedInterests.length !== 3 && styles.saveButtonDisabled
          ]}>
            Guardar
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>
        Selecciona 3 intereses que te definan
      </Text>

      <ScrollView style={styles.scrollView}>
        <View style={styles.tagsContainer}>          {AVAILABLE_INTERESTS.map((interest, index) => (            <Tag
              key={index}
              label={`${interest.emoji} ${interest.name}`}
              selected={isInterestSelected(interest.name)}
              onPress={() => toggleInterest(interest.name)}
              disabled={selectedInterests.length >= 3 && !isInterestSelected(interest.name)}
              textStyle={{ fontSize: SCREEN_WIDTH * 0.033}}
            />
          ))}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: SCREEN_WIDTH * 0.04,
    height: SCREEN_WIDTH * 0.13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    marginLeft: -SCREEN_WIDTH * 0.02,
  },
  headerTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '500',
  },
  saveButton: {
    color: '#7A9AEC',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  description: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '400',
    marginTop: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_WIDTH * 0.02,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    marginTop: SCREEN_WIDTH * 0.04,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    gap: SCREEN_WIDTH * 0.02,
  },  // Los estilos de los tags ahora vienen del componente Tag
});
