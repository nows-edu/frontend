import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ProfileInfoItem = {
  type: 'education' | 'location' | string;
  text: string;
};

type ProfileInfoProps = {
  items?: ProfileInfoItem[];
  isEditable?: boolean;
};

/**
 * ProfileInfo component
 * @param items List of info items, each with a type determining icon and display text.
 * @param isEditable Whether the info can be edited (determines if it's clickable)
 */
export default function ProfileInfo({ items = [], isEditable = false }: ProfileInfoProps) {
  const handlePress = () => {
    if (isEditable) {
      router.push('/edit-info');
    }
  };

  const Wrapper = isEditable ? TouchableOpacity : View;

  return (
    <Wrapper style={styles.container} {...(isEditable ? { onPress: handlePress } : {})}>
      {items.map((item, index) => {
        const iconName = item.type === 'education'
          ? 'school'
          : item.type === 'location'
            ? 'location-sharp'
            : 'information-circle';
        return (
          <View key={index} style={[
            styles.row,
            index < items.length - 1 && { marginBottom: SCREEN_WIDTH * 0.015 }
          ]}>
            <View style={styles.iconWrapper}>
              <Ionicons name={iconName} size={SCREEN_WIDTH * 0.05} color="white" />
            </View>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        );
      })}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: SCREEN_WIDTH * 0.02,
    paddingVertical: SCREEN_WIDTH * 0.03,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    marginHorizontal: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_WIDTH * 0.035,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: SCREEN_WIDTH * 0.07,
    alignItems: 'center',
    marginRight: SCREEN_WIDTH * 0.03,
  },
  text: {
    flex: 1,
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.034,
    fontWeight: '400',
  },
});