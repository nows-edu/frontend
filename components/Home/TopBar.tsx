import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Tag from '../General/Tag';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper function to ensure consistent navigation
const navigateTo = (path: Href) => {
  try {
    router.push(path);
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback navigation
    setTimeout(() => {
      router.navigate(path);
    }, 0);
  }
};

/**
 * TopBar component — responsive across devices
 */
export default function TopBar({
  points = 0,
  filterOptions = [] as string[],
  selectedOptions = [] as string[],
  onOptionToggle = (_: any) => {},
  onSearchPress = () => navigateTo('/search'),
  onNotificationsPress = () => navigateTo('/notifications'),
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
              onPress={() => navigateTo('/game')}
            >
              <Ionicons name="bonfire" size={20} color="rgb(239, 248, 255)" />
              <Text style={styles.pointsText}>{points}</Text>
            </TouchableOpacity>
            <IconButton
              style={styles.icon}
              icon="magnify"
              iconColor="white"
              size={24}
              onPress={onSearchPress}
            />
            <IconButton
              style={styles.icon}
              icon="bell-outline"
              iconColor="white"
              size={24}
              onPress={onNotificationsPress}
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
              {filterOptions.map(option => (
                <Tag
                  key={option}
                  label={option}
                  selected={selectedOptions.includes(option)}
                  disabled={isUpdating}
                  onPress={() => onOptionToggle(option)}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({  safeArea: { 
    backgroundColor: 'transparent',
    width: '100%',
  },  wrapper: {
    marginHorizontal: SCREEN_WIDTH * 0.035,
    position: 'relative',
  },  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SCREEN_WIDTH * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.025,
    paddingLeft: SCREEN_WIDTH * 0.04,
    backgroundColor: 'rgba(25,25,25,0.6)',
    borderRadius: SCREEN_WIDTH * 0.02,
    width: '100%',
  },
  titleContainer: { flexDirection: 'row', alignItems: 'center' },
  title: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
    marginRight: SCREEN_WIDTH * 0.02,
  },
  rightContainer: { flexDirection: 'row', alignItems: 'center' },  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 25, 25, 0.8)',
    borderRadius: SCREEN_WIDTH * 0.04,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingVertical: SCREEN_WIDTH * 0.015,
    marginRight: SCREEN_WIDTH * 0.02,
  },
  pointsText: {
    marginLeft: SCREEN_WIDTH * 0.015,
    color: 'rgb(239, 248, 255)',
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.035,
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
    fontSize: SCREEN_WIDTH * 0.034,
    fontWeight: '600',
  },
  indicator: {
    marginLeft: SCREEN_WIDTH * 0.02,
  },  tagsWrapper: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.01,
  },
});
