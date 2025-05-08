import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function GiftsScreen() {
  return (
    <ThemedView style={styles.container}>
      <MaterialIcons name="construction" size={64} color="#8B5CF6" />
      <ThemedText type="title">Coming Soon!</ThemedText>
      <ThemedText>This feature is under construction</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
});