import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

interface ProfileHeaderProps {
  title?: string;
  points?: number;
  showPoints?: boolean;
  pointsColor?: string;
  onSearchPress?: () => void;
  rightIcon?: MaterialIconName;
  onRightPress?: () => void;
}

export default function ProfileHeader({
  title = 'Perfil',
  points = 180,
  showPoints = true,
  pointsColor = 'rgb(239, 248, 255)',
  onSearchPress = () => {},
  rightIcon = 'menu',
  onRightPress = () => {},
}: ProfileHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={28}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.rightContainer}>
        {/* Points bubble */}
        {showPoints && (
          <TouchableOpacity 
            style={[styles.pointsContainer, { backgroundColor: pointsColor + '14' }]}
            onPress={() => router.push('/game')}
          >
            <Ionicons name="bonfire" size={20} color={pointsColor} />
            <Text style={[styles.pointsText, { color: pointsColor }]}>{points}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SCREEN_WIDTH * 0.25,
    paddingTop: SCREEN_WIDTH * 0.15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },    backButton: {
    position: 'absolute',
    left: 0,
    bottom: -SCREEN_WIDTH * 0.01,
    zIndex: 1,
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: SCREEN_WIDTH * 0.1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 10,
  },
  pointsText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '500',
  },
});
