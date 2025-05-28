import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Text, TextInput } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Simulación de datos de universidad y carreras (en el futuro vendrá de la BBDD)
const universities = ['UAB - Universitat Autònoma de Barcelona'];
const degrees = ['Ingeniería Informática'];

export default function EditInfoScreen() {
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [location, setLocation] = useState('');
  const [showUniversityList, setShowUniversityList] = useState(false);
  const [showDegreeList, setShowDegreeList] = useState(false);

  // Cargar datos guardados al montar el componente
  useEffect(() => {    const loadSavedInfo = async () => {
      try {
        const [savedEducation, savedDegree, savedLocation] = await Promise.all([
          AsyncStorage.getItem('userEducation'),
          AsyncStorage.getItem('userDegree'),
          AsyncStorage.getItem('userLocation')
        ]);
        
        if (savedEducation) setUniversity(savedEducation);
        if (savedDegree) setDegree(savedDegree);
        if (savedLocation) setLocation(savedLocation);
      } catch (error) {
        console.error('Error loading saved info:', error);
      }
    };

    loadSavedInfo();
  }, []);
  const handleSave = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('userEducation', university),
        AsyncStorage.setItem('userDegree', degree),
        AsyncStorage.setItem('userLocation', location)
      ]);
      router.back();
    } catch (error) {
      console.error('Error saving info:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con flecha de retorno */}      <View style={styles.header}>
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
        <Text style={styles.headerTitle}>Editar información</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Guardar</Text>
        </TouchableOpacity>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        <Text style={styles.label}>Universidad</Text>
        <TextInput
          value={university}
          onChangeText={setUniversity}
          onFocus={() => {
            setShowUniversityList(true);
            setShowDegreeList(false);
          }}
          placeholder="Buscar universidad..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          style={styles.input}
          textColor="white"
        />
        
        {/* Lista de universidades sugeridas */}        {showUniversityList && (
          <View style={styles.suggestionsList}>
            {universities
              .filter(uni => uni.toLowerCase().includes(university.toLowerCase()))
              .map((uni, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setUniversity(uni);
                    setShowUniversityList(false);
                  }}
                >
                  <Text style={styles.suggestionText}>{uni}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}

        <Text style={[styles.label, { marginTop: 20 }]}>Carrera</Text>
        <TextInput
          value={degree}
          onChangeText={setDegree}
          onFocus={() => {
            setShowDegreeList(true);
            setShowUniversityList(false);
          }}
          placeholder="Selecciona tu carrera..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          style={styles.input}
          textColor="white"
        />

        {/* Lista de carreras sugeridas */}
        {showDegreeList && (
          <View style={styles.suggestionsList}>
            {degrees
              .filter(deg => deg.toLowerCase().includes(degree.toLowerCase()))
              .map((deg, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setDegree(deg);
                    setShowDegreeList(false);
                  }}
                >
                  <Text style={styles.suggestionText}>{deg}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}

        <Text style={[styles.label, { marginTop: 20 }]}>Ubicación</Text>
        <TextInput
          value={location}
          onChangeText={(text) => {
            setLocation(text);
            setShowUniversityList(false);
            setShowDegreeList(false);
          }}
          placeholder="¿Dónde vives?"
          placeholderTextColor="rgba(255,255,255,0.5)"
          style={styles.input}
          textColor="white"
          left={<TextInput.Icon icon="map-marker" color="white" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },  header: {
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
  form: {
    padding: SCREEN_WIDTH * 0.04,
  },
  label: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_WIDTH * 0.02,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    fontSize: SCREEN_WIDTH * 0.04,
    height: SCREEN_WIDTH * 0.12,
  },
  suggestionsList: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginTop: 4,
  },
  suggestionItem: {
    padding: SCREEN_WIDTH * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  suggestionText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.035,
  },
});
