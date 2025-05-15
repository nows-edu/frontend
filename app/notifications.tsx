import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NotificationsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.contentContainer}>
        <Ionicons name="notifications" size={SCREEN_WIDTH * 0.2} color="#7A9AEC" />
        <Text style={styles.heading}>Notifications Coming Soon</Text>
        <Text style={styles.text}>
          We're working hard to bring personalized notifications to enhance your experience.
          Stay tuned for updates!
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SCREEN_WIDTH * 0.08,
  },
  heading: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    color: 'white',
    marginTop: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_WIDTH * 0.03,
    textAlign: 'center',
  },
  text: {
    fontSize: SCREEN_WIDTH * 0.045,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: SCREEN_WIDTH * 0.06,
  },
});

export default NotificationsScreen;