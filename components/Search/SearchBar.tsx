import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type SearchBarProps = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder = "Buscar usuarios..." }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={SCREEN_WIDTH * 0.045} color="rgba(255,255,255,0.6)" style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.6)"
        style={styles.input}
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value ? (
        <Ionicons
          name="close-circle"
          size={SCREEN_WIDTH * 0.045}
          color="rgba(255,255,255,0.4)"
          style={styles.clearIcon}
          onPress={() => onChange('')}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: SCREEN_WIDTH * 0.05,
    paddingHorizontal: SCREEN_WIDTH * 0.035,
    height: SCREEN_WIDTH * 0.085,
    width: SCREEN_WIDTH * 0.93,
    alignSelf: 'center',
    marginBottom: SCREEN_WIDTH * 0.03,
    marginTop: SCREEN_WIDTH * 0.02,
  },
  clearIcon: {
    marginLeft: SCREEN_WIDTH * 0.02,
    opacity: 0.8,
  },
  icon: {
    marginRight: SCREEN_WIDTH * 0.02,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.035,
    height: '100%',
  },
});
