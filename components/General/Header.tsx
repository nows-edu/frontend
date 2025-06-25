import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * ProfileHeader component
 * @param {string} title - Header title ('Perfil', 'Mensajes', etc.)
 * @param {number} points - Points count to display
 * @param {() => void} onSearchPress - Callback when search icon pressed
 * @param {string} rightIcon - Name of the rightmost icon (MaterialIcons)
 * @param {() => void} onRightPress - Callback when rightmost icon pressed
 */
import type { ComponentProps } from 'react';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

interface ProfileHeaderProps {
  title?: string;
  points?: number;
  onSearchPress?: () => void;
  rightIcon?: MaterialIconName;
  onRightPress?: () => void;
}

export default function ProfileHeader({
  title = 'Perfil',
  points = 0,
  onSearchPress = () => {},
  rightIcon = 'menu',
  onRightPress = () => {},
}: ProfileHeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        <View style={styles.rightContainer}>
          {/* Points bubble */}
          <TouchableOpacity 
            style={styles.pointsContainer}
            onPress={() => router.push('/game')}
          >
            <Ionicons name="bonfire" size={20} color='rgb(239, 248, 255)' />
            <Text style={styles.pointsText}>{points}</Text>
          </TouchableOpacity>

          {/* Search icon */}
          <IconButton
            style={styles.icon}
            icon="magnify"
            size={24}
            iconColor="white"
            onPress={onSearchPress}
          />

          {/* Rightmost button */}
          <TouchableOpacity onPress={onRightPress}>
            <MaterialIcons
              name="menu"
              size={28}
              color="white"
              style={[styles.icon, { padding: 8 }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
    marginHorizontal: SCREEN_WIDTH * 0.03,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SCREEN_WIDTH * 0.015,
    paddingLeft: SCREEN_WIDTH * 0.04,
    paddingRight: SCREEN_WIDTH * 0.02,
    borderRadius: SCREEN_WIDTH * 0.03,
  },
  title: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(44, 44, 44, 0.6)',
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
  icon: {
    marginHorizontal: SCREEN_WIDTH * 0.005,
  },
});
