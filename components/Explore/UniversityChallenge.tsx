import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface UniversityChallengeProps {
  title: string;
  type: 'video' | 'photo';
  imageUrl: string;
  onParticipate: () => void;
}

export default function UniversityChallenge({ title, type, imageUrl, onParticipate }: UniversityChallengeProps) {
  return (
    <Pressable style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={[
            styles.typeIcon,
            { backgroundColor: type === 'video' ? '#7A9AEC' : '#FFC107' }
          ]}>
            {type === 'video' ? (
              <MaterialIcons name="mic" size={16} color="white" />
            ) : (
              <MaterialIcons name="camera-alt" size={16} color="white" />
            )}
          </View>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Pressable style={styles.button} onPress={onParticipate}>
            <Text style={styles.buttonText}>Participar</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: (SCREEN_WIDTH - SCREEN_WIDTH * 0.12) / 3,
    height: SCREEN_WIDTH * 0.4,
    borderRadius: SCREEN_WIDTH * 0.02,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: SCREEN_WIDTH * 0.02,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  typeIcon: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
    borderRadius: SCREEN_WIDTH * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    justifyContent: 'flex-end',
  },
  title: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.026,
    fontWeight: '600',
    marginBottom: SCREEN_WIDTH * 0.015,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    paddingVertical: SCREEN_WIDTH * 0.01,
    borderRadius: SCREEN_WIDTH * 0.01,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.024,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
