import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type UniversityCardProps = {
  name: string;
  description: string;
  campusImageUrl: string;
  logoUrl: string;
  subtitle?: string;
}

export default function UniversityCard({ 
  name, 
  description, 
  campusImageUrl, 
  logoUrl,
  subtitle 
}: UniversityCardProps) {
  return (    <Pressable 
      style={styles.container}
      onPress={() => router.push('/university-profile')}
    >
      {/* Sección izquierda con imagen y logo */}
      <View style={styles.imageSection}>
        <Image 
          source={{ uri: campusImageUrl }} 
          style={styles.campusImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.imageGradient}
        />
        
        {/* Logo flotante */}
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: logoUrl }} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Nombre de la universidad sobre la imagen */}
        <View style={styles.nameOverlay}>
          <Text style={styles.universityName}>{name}</Text>
          {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
        </View>
      </View>

      {/* Sección derecha con info y CTA */}
      <View style={styles.infoSection}>
        <View style={styles.contentTop}>
          <View style={styles.badge}>
            <MaterialIcons name="verified" size={16} color="#7A9AEC" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>          <Text style={styles.description} numberOfLines={4}>{description}</Text>
        </View>        <Pressable style={styles.button}>
          <MaterialIcons name="remove-red-eye" size={18} color="#999" />
          <Text style={styles.buttonText}>Ver campus</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({  container: {
    width: SCREEN_WIDTH * 0.92,
    height: SCREEN_WIDTH * 0.52,
    backgroundColor: 'rgba(25,25,25,0.8)',
    borderRadius: SCREEN_WIDTH * 0.03,
    marginRight: SCREEN_WIDTH * 0.025,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
  },imageSection: {
    width: '55%',
    height: '100%',
    position: 'relative',
  },
  campusImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },logoContainer: {
    position: 'absolute',
    top: SCREEN_WIDTH * 0.03,
    left: SCREEN_WIDTH * 0.03,
    width: SCREEN_WIDTH * 0.13,
    height: SCREEN_WIDTH * 0.13,
    backgroundColor: 'white',
    borderRadius: SCREEN_WIDTH * 0.025,
    padding: SCREEN_WIDTH * 0.02,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  nameOverlay: {
    position: 'absolute',
    bottom: SCREEN_WIDTH * 0.03,
    left: SCREEN_WIDTH * 0.03,
    right: SCREEN_WIDTH * 0.03,
  },  universityName: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.036,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitleText: {
    color: '#7A9AEC',
    fontSize: SCREEN_WIDTH * 0.03,
    fontWeight: '600',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  infoSection: {
    flex: 1,
    padding: SCREEN_WIDTH * 0.03,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  contentTop: {
    gap: SCREEN_WIDTH * 0.02,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(122,154,236,0.1)',
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    paddingVertical: SCREEN_WIDTH * 0.01,
    borderRadius: SCREEN_WIDTH * 0.01,
    gap: 4,
  },
  verifiedText: {
    color: '#7A9AEC',
    fontSize: SCREEN_WIDTH * 0.028,
    fontWeight: '600',
  },  description: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: SCREEN_WIDTH * 0.032,
    lineHeight: SCREEN_WIDTH * 0.042,
  },button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingVertical: SCREEN_WIDTH * 0.02,
    borderRadius: SCREEN_WIDTH * 0.015,
    gap: SCREEN_WIDTH * 0.02,
  },
  buttonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.028,
    fontWeight: '600',
  },
});