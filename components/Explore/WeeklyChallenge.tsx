import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WeeklyChallengeProps {
  title: string;
  type: 'video' | 'photo';
  onParticipate: () => void;
}

export default function WeeklyChallenge({ title, type, onParticipate }: WeeklyChallengeProps) {
  return (
    <View style={styles.card}>
      <View style={[
        styles.icon,
        { backgroundColor: type === 'video' ? '#7A9AEC' : '#FFC107' }
      ]}>
        {type === 'video' ? (
          <MaterialIcons name="mic" size={24} color="white" />
        ) : (
          <MaterialIcons name="camera-alt" size={24} color="white" />
        )}
      </View>      <Text style={styles.title} numberOfLines={3}>
        {title}
      </Text>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={onParticipate}>
          <Text style={styles.buttonText}>Participar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_WIDTH * 0.4,
    backgroundColor: '#1a1a1a',
    borderRadius: SCREEN_WIDTH * 0.03,
    padding: SCREEN_WIDTH * 0.03,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: SCREEN_WIDTH * 0.11,
    height: SCREEN_WIDTH * 0.11,
    borderRadius: SCREEN_WIDTH * 0.055,
    alignItems: 'center',
    justifyContent: 'center',
  },  title: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.028,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: SCREEN_WIDTH * 0.034,
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.01,
    marginVertical: SCREEN_WIDTH * 0.02,
  },  buttonContainer: {
    width: '100%',
    marginTop: SCREEN_WIDTH * -0.02,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_WIDTH * 0.015,
    borderRadius: SCREEN_WIDTH * 0.02,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.03,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
