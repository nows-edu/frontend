import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TagProps {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  selectable?: boolean;
  onPress?: () => void;
  style?: object;
  textStyle?: object;
}

export default function Tag({
  label,
  icon,
  selected = false,
  disabled = false,
  selectable = true,
  onPress,
  style,
  textStyle
}: TagProps) {
  const Container = selectable ? TouchableOpacity : View;
  
  return (
    <Container
      style={[
        styles.tag,
        selected ? styles.tagSelected : styles.tagUnselected,
        disabled ? { opacity: 0.7 } : {},
        style
      ]}      onPress={selectable ? onPress : undefined}
      disabled={disabled || !selectable}
    >
      <View style={styles.tagContentContainer}>
        {icon}
        {icon && <View style={{ width: SCREEN_WIDTH * 0.015 }} />}
        <Text 
          style={[
            styles.tagText,
            selected ? styles.tagTextSelected : styles.tagTextUnselected,
            textStyle
          ]}
        >
          {label}
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  tagContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },  tag: {
    borderRadius: SCREEN_WIDTH * 0.06,
    paddingHorizontal: SCREEN_WIDTH * 0.025,
    paddingVertical: SCREEN_WIDTH * 0.01,
    margin: 0,
  },
  tagSelected: {
    backgroundColor: 'rgba(160, 187, 255, 0.32)',
    borderWidth: 2,
    borderColor: '#7A9AEC',
  },
  tagUnselected: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tagText: { 
    fontSize: SCREEN_WIDTH * 0.031 
  },
  tagTextSelected: {
    color: 'rgb(255, 255, 255)',
    fontWeight: 'bold',
  },
  tagTextUnselected: {
    color: 'white',
    fontWeight: '400',
  },
});
