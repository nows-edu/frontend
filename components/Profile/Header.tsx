import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ProfileHeaderProps = {
  title: string;
  showBack?: boolean;
};

export default function ProfileHeader({ title, showBack = true }: ProfileHeaderProps) {
  return (
    <View style={styles.header}>
      {showBack && (
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
      )}
      <Text style={styles.headerTitle}>{title}</Text>
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
});
