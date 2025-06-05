import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type UserDisplayProps = {
  name: string;
  username: string;
  rightContent?: React.ReactNode;
};

export default function UserDisplay({ name, username, rightContent }: UserDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.nameRow}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.rightContentContainer}>{rightContent}</View>
      </View>
      <Text style={styles.username}>@{username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({  container: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: 32,
    flexWrap: 'nowrap',
  },  nameContainer: {
    marginRight: SCREEN_WIDTH * 0.06, // Un poco más de espacio
  },  rightContentContainer: {
    marginLeft: 0,
    marginTop: SCREEN_WIDTH * 0.02,
  },  name: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '600',
    color: 'white',
    marginBottom: -4,
  },
  username: {
    fontSize: SCREEN_WIDTH * 0.03,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
