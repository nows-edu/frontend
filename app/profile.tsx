import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importar componentes del perfil existente
import ProfileBanner from '@/components/Profile/Banner';
import Career from '@/components/Profile/Career';
import { EmptyAgenda, EmptyNows } from '@/components/Profile/EmptyStates';
import FollowButton from '@/components/Profile/FollowButton';
import ProfileInfo from '@/components/Profile/Info';
import Interests from '@/components/Profile/Interests';
import ProfileStats from '@/components/Profile/Stats';
import TabSlider, { TabOption } from '@/components/Profile/TabSlider';
import UserDisplay from '@/components/Profile/UserDisplay';
import { followService } from '@/utils/followService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock profiles data (expanded for all users)
const MOCK_PROFILES = {
  '1': {
    name: 'Aina F.C.',
    username: 'aina.fc',
    status: 'DIVA',
    statusColor: 'rgb(250, 38, 38)',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    following: 234,
    followers: 1892,
    visits: 3478,
    education: 'Ingeniería Informática - UPC',
    location: 'Barcelona, España',
    interests: ['Tecnología', 'Apps', 'Música'],
    career: [
      { 
        year: '2023', 
        achievement: 'Presidenta ELSA SPAIN',
        description: 'Liderazgo de la asociación europea de estudiantes de derecho en España. Gestión de equipos, organización de eventos y representación internacional.'
      },
      { 
        year: '2022', 
        achievement: 'Miembro activo del Club de Debate',
        description: 'Participación en torneos nacionales e internacionales de debate universitario. Desarrollo de habilidades de argumentación y oratoria.'
      },
      { 
        year: '2021', 
        achievement: 'Delegada de curso',
        description: 'Representante estudiantil del grado en ADE + Derecho. Coordinación con profesorado y mediación en asuntos académicos.'
      },
      { 
        year: '2019', 
        achievement: 'Inicio ADE + Derecho (UAB)',
        description: 'Comienzo del doble grado en Administración y Dirección de Empresas y Derecho en la Universidad Autónoma de Barcelona.'
      }
    ]
  },
  '2': {
    name: 'Jan G.S.',
    username: 'jan.gs',
    status: '🎵 Music Producer',
    statusColor: 'rgb(88, 101, 242)',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    following: 567,
    followers: 2341,
    visits: 5432,
    education: 'Producción Musical - ESMUC',
    location: 'Barcelona, España',
    interests: ['Música', 'DJ', 'Instrumentos'],
    career: [
      { year: '2023', achievement: 'Productor en Universal Music', description: 'Producción musical profesional en una de las discográficas más importantes del mundo.' },
      { year: '2021', achievement: 'DJ Residente en Club XYZ', description: 'DJ oficial en uno de los clubs más reconocidos de Barcelona.' },
      { year: '2020', achievement: 'Productor Independiente', description: 'Inicio como productor musical independiente, trabajando con artistas locales.' }
    ]
  },
  'u1': {
    name: 'Elena García',
    username: 'elena_g',
    status: 'Estudiante Arquitectura',
    statusColor: 'rgb(34, 197, 94)',
    avatarUrl: 'https://i.pravatar.cc/150?u=elena',
    following: 145,
    followers: 892,
    visits: 1234,
    education: 'Arquitectura - UPC',
    location: 'Barcelona, España',
    interests: ['Diseño', 'Arte', 'Viajes'],
    career: [
      { year: '2023', achievement: 'Prácticas en Foster + Partners', description: 'Prácticas profesionales en uno de los estudios de arquitectura más prestigiosos del mundo.' },
      { year: '2022', achievement: 'Proyecto destacado en concurso estudiantil', description: 'Reconocimiento por proyecto innovador de vivienda sostenible.' }
    ]
  },
  'u2': {
    name: 'Carlos López',
    username: 'carlos_l',
    status: 'Future Engineer',
    statusColor: 'rgb(168, 85, 247)',
    avatarUrl: 'https://i.pravatar.cc/150?u=carlos',
    following: 234,
    followers: 567,
    visits: 890,
    education: 'Ingeniería Industrial - ETSEIB',
    location: 'Barcelona, España',
    interests: ['Tecnología', 'Innovación', 'Startups'],
    career: [
      { year: '2023', achievement: 'Intern at Tesla', description: 'Prácticas en Tesla Motors en el departamento de manufactura.' },
      { year: '2022', achievement: 'Winner Hackathon Barcelona', description: 'Primer lugar en hackathon de tecnología sostenible.' }
    ]
  },
  'u3': {
    name: 'Ana Martínez',
    username: 'ana_m',
    status: 'Med Student',
    statusColor: 'rgb(239, 68, 68)',
    avatarUrl: 'https://i.pravatar.cc/150?u=ana',
    following: 189,
    followers: 434,
    visits: 567,
    education: 'Medicina - UAB',
    location: 'Cerdanyola del Vallès',
    interests: ['Medicina', 'Investigación', 'Voluntariado'],
    career: [
      { year: '2023', achievement: 'Voluntaria en Médicos sin Fronteras', description: 'Participación en misiones humanitarias locales.' },
      { year: '2022', achievement: 'Beca de investigación', description: 'Beca para proyecto de investigación en cardiología.' }
    ]
  },
  'u4': {
    name: 'Miguel Torres',
    username: 'miguel_t',
    status: 'Creative Mind',
    statusColor: 'rgb(251, 146, 60)',
    avatarUrl: 'https://i.pravatar.cc/150?u=miguel',
    following: 345,
    followers: 789,
    visits: 1234,
    education: 'Diseño Gráfico - ELISAVA',
    location: 'Barcelona, España',
    interests: ['Diseño', 'Arte Digital', 'UX/UI'],
    career: [
      { year: '2023', achievement: 'Freelance Designer', description: 'Diseñador freelance para startups tecnológicas.' },
      { year: '2022', achievement: 'Premio mejor proyecto final', description: 'Reconocimiento al mejor proyecto de fin de carrera.' }
    ]
  },
  'u5': {
    name: 'Laura Sánchez',
    username: 'laura_s',
    status: 'Global Citizen',
    statusColor: 'rgb(168, 85, 247)',
    avatarUrl: 'https://i.pravatar.cc/150?u=laura',
    following: 123,
    followers: 456,
    visits: 678,
    education: 'Relaciones Internacionales - UPF',
    location: 'Barcelona, España',
    interests: ['Política', 'Idiomas', 'Culturas'],
    career: [
      { year: '2023', achievement: 'Erasmus en París', description: 'Intercambio académico en Sciences Po París.' },
      { year: '2022', achievement: 'Modelo de Naciones Unidas', description: 'Participación en MUN Barcelona como delegada.' }
    ]
  },
  'u6': {
    name: 'Diego Ruiz',
    username: 'diego_r',
    status: 'Athlete Mode',
    statusColor: 'rgb(34, 197, 94)',
    avatarUrl: 'https://i.pravatar.cc/150?u=diego',
    following: 456,
    followers: 1234,
    visits: 2345,
    education: 'Ciencias del Deporte - INEFC',
    location: 'Barcelona, España',
    interests: ['Fútbol', 'Fitness', 'Nutrición'],
    career: [
      { year: '2023', achievement: 'Entrenador personal certificado', description: 'Certificación como entrenador personal especializado en deportes de equipo.' },
      { year: '2022', achievement: 'Capitán equipo universitario', description: 'Capitán del equipo de fútbol de la universidad.' }
    ]
  },
  'u7': {
    name: 'Sofia Pérez',
    username: 'sofia_p',
    status: 'Bookworm',
    statusColor: 'rgb(168, 85, 247)',
    avatarUrl: 'https://i.pravatar.cc/150?u=sofia',
    following: 89,
    followers: 234,
    visits: 345,
    education: 'Filología Hispánica - UB',
    location: 'Barcelona, España',
    interests: ['Literatura', 'Escritura', 'Teatro'],
    career: [
      { year: '2023', achievement: 'Editora revista universitaria', description: 'Editora jefe de la revista literaria de la universidad.' },
      { year: '2022', achievement: 'Premio de poesía joven', description: 'Ganadora del concurso de poesía joven de Catalunya.' }
    ]
  },
  'u8': {
    name: 'Javier Morales',
    username: 'javier_m',
    status: 'Entrepreneur',
    statusColor: 'rgb(251, 146, 60)',
    avatarUrl: 'https://i.pravatar.cc/150?u=javier',
    following: 567,
    followers: 890,
    visits: 1123,
    education: 'Administración de Empresas - ESADE',
    location: 'Barcelona, España',
    interests: ['Negocios', 'Innovación', 'Inversión'],
    career: [
      { year: '2023', achievement: 'Co-fundador startup EdTech', description: 'Co-fundación de startup enfocada en educación digital.' },
      { year: '2022', achievement: 'Incubadora ESADE BAN', description: 'Seleccionado para programa de incubación de empresas.' }
    ]
  },
  'u9': {
    name: 'Carmen Flores',
    username: 'carmen_f',
    status: 'Eco Warrior',
    statusColor: 'rgb(34, 197, 94)',
    avatarUrl: 'https://i.pravatar.cc/150?u=carmen',
    following: 234,
    followers: 567,
    visits: 789,
    education: 'Ciencias Ambientales - UAB',
    location: 'Cerdanyola del Vallès',
    interests: ['Sostenibilidad', 'Naturaleza', 'Activismo'],
    career: [
      { year: '2023', achievement: 'Investigación en cambio climático', description: 'Participación en proyecto de investigación sobre impacto del cambio climático.' },
      { year: '2022', achievement: 'Activista Fridays for Future', description: 'Coordinadora local del movimiento climático juvenil.' }
    ]
  },
  'u10': {
    name: 'Roberto Silva',
    username: 'roberto_s',
    status: 'Code Ninja',
    statusColor: 'rgb(88, 101, 242)',
    avatarUrl: 'https://i.pravatar.cc/150?u=roberto',
    following: 345,
    followers: 678,
    visits: 901,
    education: 'Ingeniería Informática - UPC',
    location: 'Barcelona, España',
    interests: ['Programación', 'AI/ML', 'Open Source'],
    career: [
      { year: '2023', achievement: 'Desarrollador en Google Summer of Code', description: 'Participación en programa de desarrollo de código abierto de Google.' },
      { year: '2022', achievement: 'Hackathon winner', description: 'Ganador del hackathon de inteligencia artificial de la UPC.' }
    ]
  },
};

const ProfileScreen = () => {
  const params = useLocalSearchParams();
  const userId = typeof params.userId === 'string' ? params.userId : Array.isArray(params.userId) ? params.userId[0] : undefined;
  const insets = useSafeAreaInsets();
  
  const [selectedTab, setSelectedTab] = useState<TabOption>('nows');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);

  const currentUserId = 'carol'; // Current user ID
  const userProfile = userId ? MOCK_PROFILES[userId as keyof typeof MOCK_PROFILES] : null;

  // Load follow stats
  const loadFollowStats = useCallback(async () => {
    if (userId && userProfile) {
      try {
        // Check if current user is following the profile user
        const following = await followService.isFollowing(currentUserId, userId);
        setIsFollowing(following);

        // Get stats
        const stats = await followService.getUserStats(userId);
        setFollowerCount(userProfile.followers || stats.followers);
        setFollowingCount(userProfile.following || stats.following);
        setVisitCount(userProfile.visits || stats.visits);

        // Record visit
        await followService.recordVisit(currentUserId, userId);
      } catch (error) {
        console.error('Error loading follow stats:', error);
        // Fallback to mock data
        setFollowerCount(userProfile.followers || 0);
        setFollowingCount(userProfile.following || 0);
        setVisitCount(userProfile.visits || 0);
      }
    }
  }, [userId, userProfile]);

  useEffect(() => {
    loadFollowStats();
  }, [loadFollowStats]);

  const handleToggleFollow = async () => {
    if (!userId) return;
    
    try {
      if (isFollowing) {
        await followService.unfollowUser(currentUserId, userId);
        setFollowerCount(prev => prev - 1);
      } else {
        await followService.followUser(currentUserId, userId);
        setFollowerCount(prev => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.backButtonContainer}>
          <IconButton
            icon="arrow-left"
            iconColor="white"
            size={24}
            onPress={() => router.back()}
            style={styles.backButtonStyle}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Botón de volver integrado en el contenido */}
      <View style={styles.backButtonContainer}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={24}
          onPress={() => router.back()}
          style={styles.backButtonStyle}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20 } // Padding más pequeño
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileBanner
          imageUri={userProfile.avatarUrl}
          statusText={userProfile.status}
          statusColor={userProfile.statusColor}
          isEditable={false}
        />

        <UserDisplay
          name={userProfile.name}
          username={userProfile.username}
        />

        <ProfileStats
          following={followingCount}
          followers={followerCount}
          visits={visitCount}
        />

        <FollowButton
          isFollowing={isFollowing}
          onToggleFollow={handleToggleFollow}
        />

        <ProfileInfo
          items={[
            { type: 'education', text: userProfile.education },
            { type: 'location', text: userProfile.location }
          ]}
          isEditable={false}
        />

        <Interests
          items={userProfile.interests}
          statusColor={userProfile.statusColor}
          isEditable={false}
        />

        <Career
          items={userProfile.career.map(item => ({
            year: item.year,
            achievement: item.achievement,
            description: item.description || ''
          }))}
          color={userProfile.statusColor}
          isEditable={false}
        />

        <TabSlider
          onTabChange={setSelectedTab}
          initialTab={selectedTab}
        />

        {selectedTab === 'nows' && <EmptyNows />}
        {selectedTab === 'agenda' && <EmptyAgenda />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50, // Posición fija desde arriba
    left: 16,
    zIndex: 1000,
  },
  backButtonStyle: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    margin: 0,
  },
  backButton: {
    position: 'absolute',
    left: SCREEN_WIDTH * 0.02,
    top: SCREEN_WIDTH * 0.02,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export default ProfileScreen;
