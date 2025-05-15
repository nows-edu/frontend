import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, Text as RNText, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * TopBar component — responsive across devices
 */
export default function TopBar({
  points = 0,
  filterOptions = [] as string[],
  selectedOptions = [] as string[],
  onOptionToggle = (_: any) => {},
  onSearchPress = () => router.push('/search'),
  onNotificationsPress = () => router.push('/notifications'),
  isUpdating = false,
}) {
  const [expanded, setExpanded] = useState(false);
  const title = 'Nows';
  const topInset = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: topInset }]}>      
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.titleContainer} onPress={() => setExpanded(v => !v)}>
            <Text style={styles.title}>{title}</Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="white"
            />
          </TouchableOpacity>

          <View style={styles.rightContainer}>
            <TouchableOpacity 
              style={styles.pointsContainer}
              onPress={() => router.push('/game')}
            >
              <Ionicons name="bonfire" size={20} color="#007AFF" />
              <Text style={styles.pointsText}>{points}</Text>
            </TouchableOpacity>
            <IconButton
              style={styles.icon}
              icon="magnify"
              iconColor="white"
              size={24}
              onPress={() => router.push('/search')}
            />
            <IconButton
              style={styles.icon}
              icon="bell-outline"
              iconColor="white"
              size={24}
              onPress={() => router.push('/notifications')}
            />
          </View>
        </View>

        {expanded && (
          <View style={styles.dropdown}>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>Selecciona lo que te recomendamos:</Text>
              {isUpdating && <ActivityIndicator size="small" color="#7A9AEC" style={styles.indicator} />}
            </View>
            <View style={styles.tagsWrapper}>
              {filterOptions.map(option => {
                const selected = selectedOptions.includes(option);
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.tag,
                      selected ? styles.tagSelected : styles.tagUnselected,
                      isUpdating ? { opacity: 0.7 } : {}
                    ]}
                    onPress={() => onOptionToggle(option)}
                    disabled={isUpdating}
                  >
                    <RNText style={[
                      styles.tagText,
                      selected ? styles.tagTextSelected : styles.tagTextUnselected
                    ]}>
                      {option}
                    </RNText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: 'transparent' },
  wrapper: {
    marginHorizontal: SCREEN_WIDTH * 0.04,
    position: 'relative',
  },  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SCREEN_WIDTH * 0.02,
    paddingLeft: SCREEN_WIDTH * 0.04,
    paddingRight: SCREEN_WIDTH * 0.02, // Menos padding a la derecha
    backgroundColor: 'rgba(25,25,25,0.6)',
    borderRadius: SCREEN_WIDTH * 0.03,
  },
  titleContainer: { flexDirection: 'row', alignItems: 'center' },
  title: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.055,
    fontWeight: 'bold',
    marginRight: SCREEN_WIDTH * 0.02,
  },
  rightContainer: { flexDirection: 'row', alignItems: 'center' },
  pointsContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white', borderRadius: SCREEN_WIDTH * 0.04,
    paddingHorizontal: SCREEN_WIDTH * 0.025,
    paddingVertical: SCREEN_WIDTH * 0.015,
    marginRight: SCREEN_WIDTH * 0.02,
  },
  pointsText: {
    marginLeft: SCREEN_WIDTH * 0.015,
    color: '#007AFF', fontWeight: 'bold', fontSize: SCREEN_WIDTH * 0.035,
  },
  icon: { marginHorizontal: SCREEN_WIDTH * 0.005 },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(25,25,25,0.6)',
    borderRadius: SCREEN_WIDTH * 0.03,
    paddingVertical: SCREEN_WIDTH * 0.03,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_WIDTH * 0.02,
    zIndex: 10,
  },  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SCREEN_WIDTH * 0.04,
  },
  subtitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.038,
    fontWeight: '600',
  },
  indicator: {
    marginLeft: SCREEN_WIDTH * 0.02,
  },  tagsWrapper: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.01, // Reducido el espacio entre tags
  },
  tag: {
    borderRadius: SCREEN_WIDTH * 0.06,
    paddingHorizontal: SCREEN_WIDTH * 0.035,
    paddingVertical: SCREEN_WIDTH * 0.015,
    margin: SCREEN_WIDTH * 0.005, // Reducido el margen
  },tagSelected: {
    backgroundColor: 'rgba(122,154,236,0.2)',
    borderWidth: 1,
    borderColor: '#7A9AEC',
  },
  tagUnselected: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tagText: { fontSize: SCREEN_WIDTH * 0.035 },
  tagTextSelected: {
    color: '#7A9AEC',
    fontWeight: 'bold',
  },
  tagTextUnselected: {
    color: 'white',
    fontWeight: '500',
  },
});
