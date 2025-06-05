import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = Math.min(120, SCREEN_WIDTH * 0.3); // Match the size from Banner component
const BANNER_HEIGHT = IMAGE_SIZE * 0.6; // Match the height from Banner component

type ProfileInfoProps = {
  name: string;
  username: string;
  rightContent?: React.ReactNode;
};

export default function ProfileInfo({ name, username, rightContent }: ProfileInfoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        <View style={styles.textContainer}>          <View style={styles.nameRow}>
            <View style={styles.leftSection}>
              <Text style={styles.name}>{name}</Text>
            </View>
            <View style={styles.centerSection}>
              {rightContent}
            </View>
          </View>
          <Text style={styles.username}>@{username}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({  container: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginTop: -BANNER_HEIGHT * 0.5,
    marginBottom: SCREEN_WIDTH * 0.02,
    alignItems: 'center',
  },
  mainRow: {
    width: '100%',
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  leftSection: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  centerSection: {
    width: '100%',
    alignItems: 'center',
  },
  name: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: '700',
    color: 'white',
  },
  username: {
    fontSize: SCREEN_WIDTH * 0.035,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
});
