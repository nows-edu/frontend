import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import AmbassadorCTA from '@/components/Experiences/AmbassadorCTA';
import UniversityCard from '@/components/Experiences/UniversityCard';
import Header from '@/components/General/Header';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const universities = [
  {
    name: 'Universitat Autònoma de Barcelona',
    description: '¡Descubre el día a día real de los estudiantes en la UAB! 🎓',
    campusImageUrl: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/UAB-logo-2022.png/640px-UAB-logo-2022.png',
    subtitle: 'UAB',
  },
  {
    name: 'ESADE Business School',
    description: '👀 ¿Curioso por saber cómo es ser estudiante de ESADE? Echa un vistazo...',
    campusImageUrl: 'https://images.pexels.com/photos/207684/pexels-photo-207684.jpeg',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/ESADE_Logo.svg/2560px-ESADE_Logo.svg.png',
    subtitle: 'ESADE',
  },
];

const featuredNows = [
  {
    id: '1',
    username: '@maria_garcia',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    thumbnail: 'https://images.pexels.com/photos/3059748/pexels-photo-3059748.jpeg',
    description: 'Un día en la vida de una estudiante de UAB 📚',
    views: '10.2K',
    duration: '0:45',
  },
  {
    id: '2',
    username: '@alex_estudios',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    thumbnail: 'https://images.pexels.com/photos/6147369/pexels-photo-6147369.jpeg',
    description: 'Tour por el campus de ESADE 🎓',
    views: '8.5K',
    duration: '1:20',
  },
  {
    id: '3',
    username: '@laura_campus',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    thumbnail: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg',
    description: 'Mi experiencia estudiando Business 💼',
    views: '15.3K',
    duration: '0:55',
  },
  {
    id: '4',
    username: '@carlos_uab',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    thumbnail: 'https://images.pexels.com/photos/4778611/pexels-photo-4778611.jpeg',
    description: 'Vida estudiantil en Barcelona 🌆',
    views: '12.8K',
    duration: '1:10',
  },
];

export default function ExperiencesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Experiencias"
        points={780}
        onSearchPress={() => {}}
      />
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Descubre las experiencias</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.universitiesContainer}
        >
          {universities.map((university, index) => (            <UniversityCard
              key={index}
              name={university.name}
              description={university.description}
              campusImageUrl={university.campusImageUrl}
              logoUrl={university.logoUrl}
              subtitle={university.subtitle}
            />
          ))}
        </ScrollView>        <Text style={styles.sectionTitle}>NOWs destacados</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nowsContainer}
        >
          {featuredNows.map((now) => (
            <Pressable key={now.id} style={styles.nowCard}>
              <Image source={{ uri: now.thumbnail }} style={styles.thumbnail} />
              <View style={styles.overlay}>
                <View style={styles.nowHeader}>
                  <Image source={{ uri: now.avatar }} style={styles.avatar} />
                  <Text style={styles.username}>{now.username}</Text>
                </View>
                <View style={styles.nowInfo}>
                  <Text style={styles.description}>{now.description}</Text>
                  <View style={styles.stats}>
                    <View style={styles.stat}>
                      <MaterialIcons name="visibility" size={16} color="white" />
                      <Text style={styles.statText}>{now.views}</Text>
                    </View>
                    <View style={styles.stat}>
                      <MaterialIcons name="schedule" size={16} color="white" />
                      <Text style={styles.statText}>{now.duration}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <AmbassadorCTA />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SCREEN_WIDTH * 0.1,
  },
  sectionTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: '600',
    marginHorizontal: SCREEN_WIDTH * 0.04,
    marginVertical: SCREEN_WIDTH * 0.04,
  },
  universitiesContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
  },  section: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_WIDTH * 0.06,
  },
  nowsContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingBottom: SCREEN_WIDTH * 0.04,
  },  nowCard: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_WIDTH * 0.5,
    marginRight: SCREEN_WIDTH * 0.03,
    borderRadius: SCREEN_WIDTH * 0.02,
    overflow: 'hidden',
    position: 'relative',
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
  nowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: SCREEN_WIDTH * 0.05,
    height: SCREEN_WIDTH * 0.05,
    borderRadius: SCREEN_WIDTH * 0.025,
    borderWidth: 1,
    borderColor: '#7A9AEC',
    marginRight: SCREEN_WIDTH * 0.015,
  },
  username: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.028,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  nowInfo: {
    justifyContent: 'flex-end',
  },
  description: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.026,
    marginBottom: SCREEN_WIDTH * 0.015,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SCREEN_WIDTH * 0.025,
  },
  statText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.026,
    marginLeft: SCREEN_WIDTH * 0.01,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});