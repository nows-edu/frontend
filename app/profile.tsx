import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importar componentes del perfil existente
import ProfileBanner from '@/components/Profile/Banner';
import Career from '@/components/Profile/Career';
import { EmptyNows } from '@/components/Profile/EmptyStates';
import FollowButton from '@/components/Profile/FollowButton';
import ProfileInfo from '@/components/Profile/Info';
import Interests from '@/components/Profile/Interests';
import ProfileStats from '@/components/Profile/Stats';
import TabSlider, { TabOption } from '@/components/Profile/TabSlider';
import UserDisplay from '@/components/Profile/UserDisplay';
import { CareerItem } from '@/types/career';
import { followService } from '@/utils/followService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock profiles data (expanded for all users)
interface UserProfile {
  name: string;
  username: string;
  status: string;
  statusColor: string;
  avatarUrl: string;
  following: number;
  followers: number;
  visits: number;
  education: string;
  location: string;
  interests: string[];
  career: CareerItem[];
}

const MOCK_PROFILES: Record<string, UserProfile> = {
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
        year: '2025',
        university: 'Universidad Politécnica de Catalunya',
        universityAcronym: 'UPC',
        degree: 'Grado en Ingeniería Informática',
        achievement: 'Especialización en Software y Mobile',
        description: 'Cursando último año del grado. Especialización en Ingeniería del Software y desarrollo de aplicaciones móviles. Participación activa en proyectos de innovación universitaria.'
      },
      { 
        year: '2024',
        university: 'Technische Universität München',
        universityAcronym: 'TUM',
        degree: 'Erasmus en Computer Science',
        achievement: 'Foco en AI y Cloud Computing',
        description: 'Programa de intercambio Erasmus+. Foco en Inteligencia Artificial y Computación en la Nube. Participación en el hackathon TUM.ai y desarrollo de proyectos de machine learning.'
      },
      { 
        year: '2023',
        university: 'Universidad Politécnica de Catalunya',
        universityAcronym: 'UPC',
        degree: 'Ingreso en Ingeniería Informática',
        achievement: 'Primer año con excelencia',
        description: 'Inicio del grado con excelencia académica. Participación en el programa de mentoring para nuevos estudiantes. Desarrollo de una aplicación de gestión académica que se implementó en la facultad.'
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
      { 
        year: '2025',
        university: 'Escola Superior de Música de Catalunya',
        universityAcronym: 'ESMUC',
        degree: 'Grado en Producción y Composición Musical',
        achievement: 'Especialización en Música Electrónica',
        description: 'Desarrollo de proyectos de producción musical y composición para medios audiovisuales. Participación en festivales de música electrónica.'
      },
      { 
        year: '2024',
        university: 'Berklee College of Music',
        universityAcronym: 'BERKLEE',
        degree: 'Music Production & Engineering',
        achievement: 'Producción de EP debut',
        description: 'Programa de intercambio con foco en producción musical y tecnología de audio. Producción y lanzamiento de EP personal en plataformas digitales.'
      },
      { 
        year: '2023',
        university: 'Escola Superior de Música de Catalunya',
        universityAcronym: 'ESMUC',
        degree: 'Producción Musical',
        achievement: 'Premio al Mejor Proyecto Novel',
        description: 'Inicio de estudios en producción musical. Premio al mejor proyecto novel por composición original para cortometraje.'
      }
    ]
  },
  '3': {
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
      { 
        year: '2024',
        university: 'Universidad Politécnica de Catalunya',
        universityAcronym: 'UPC',
        degree: 'Máster en Arquitectura',
        achievement: 'Prácticas en Foster + Partners',
        description: 'Prácticas profesionales en uno de los estudios de arquitectura más prestigiosos del mundo.'
      },
      { 
        year: '2023',
        university: 'Universidad Politécnica de Catalunya',
        universityAcronym: 'UPC',
        degree: 'Grado en Arquitectura',
        achievement: 'Proyecto destacado en concurso estudiantil',
        description: 'Reconocimiento por proyecto innovador de vivienda sostenible.'
      }
    ]
  },
  '4': {
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
      { 
        year: '2024',
        university: 'Universidad Politécnica de Catalunya',
        universityAcronym: 'UPC',
        degree: 'Máster en Ingeniería Industrial',
        achievement: 'Intern at Tesla',
        description: 'Prácticas en Tesla Motors en el departamento de manufactura.'
      },
      { 
        year: '2023',
        university: 'Universidad Politécnica de Catalunya',
        universityAcronym: 'UPC',
        degree: 'Ingeniería Industrial',
        achievement: 'Winner Hackathon Barcelona',
        description: 'Primer lugar en hackathon de tecnología sostenible.'
      }
    ]
  },
  '5': {
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
      { 
        year: '2024',
        university: 'Universidad de Barcelona',
        universityAcronym: 'UB',
        degree: 'Doctorado en Medicina',
        achievement: 'Voluntaria en Médicos sin Fronteras',
        description: 'Participación en misiones humanitarias locales.'
      },
      { 
        year: '2023',
        university: 'Universidad de Barcelona',
        universityAcronym: 'UB',
        degree: 'Medicina',
        achievement: 'Beca de investigación',
        description: 'Beca para proyecto de investigación en cardiología.'
      }
    ]
  },
  '6': {
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
      { 
        year: '2024',
        university: 'Universidad Politécnica de Catalunya',
        universityAcronym: 'UPC',
        degree: 'Máster en Diseño Digital',
        achievement: 'Freelance Designer',
        description: 'Diseñador freelance para startups tecnológicas.'
      },
      { 
        year: '2023',
        university: 'ELISAVA',
        universityAcronym: 'ELISAVA',
        degree: 'Grado en Diseño',
        achievement: 'Premio mejor proyecto final',
        description: 'Reconocimiento al mejor proyecto de fin de carrera.'
      }
    ]
  },
  '7': {
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
      { 
        year: '2024',
        university: 'Sciences Po Paris',
        universityAcronym: 'SciencesPo',
        degree: 'Relaciones Internacionales',
        achievement: 'Erasmus en París',
        description: 'Intercambio académico en Sciences Po París.'
      },
      { 
        year: '2023',
        university: 'Universidad Pompeu Fabra',
        universityAcronym: 'UPF',
        degree: 'Ciencias Políticas',
        achievement: 'Modelo de Naciones Unidas',
        description: 'Participación en MUN Barcelona como delegada.'
      }
    ]
  },
  '8': {
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
      { 
        year: '2024',
        university: 'INEFC Barcelona',
        universityAcronym: 'INEFC',
        degree: 'Ciencias de la Actividad Física',
        achievement: 'Entrenador personal certificado',
        description: 'Certificación como entrenador personal especializado en deportes de equipo.'
      },
      { 
        year: '2023',
        university: 'INEFC Barcelona',
        universityAcronym: 'INEFC',
        degree: 'CAFE',
        achievement: 'Capitán equipo universitario',
        description: 'Capitán del equipo de fútbol de la universidad.'
      }
    ]
  },
  '9': {
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
      { 
        year: '2024',
        university: 'Universidad de Barcelona',
        universityAcronym: 'UB',
        degree: 'Filología Catalana',
        achievement: 'Editora revista universitaria',
        description: 'Editora jefe de la revista literaria de la universidad.'
      },
      { 
        year: '2023',
        university: 'Universidad de Barcelona',
        universityAcronym: 'UB',
        degree: 'Filología Catalana',
        achievement: 'Premio de poesía joven',
        description: 'Ganadora del concurso de poesía joven de Catalunya.'
      }
    ]
  },
  '10': {
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
      { 
        year: '2024',
        university: 'ESADE Business School',
        universityAcronym: 'ESADE',
        degree: 'MBA',
        achievement: 'Co-fundador startup EdTech',
        description: 'Co-fundación de startup enfocada en educación digital.'
      },
      { 
        year: '2023',
        university: 'ESADE Business School',
        universityAcronym: 'ESADE',
        degree: 'Administración de Empresas',
        achievement: 'Incubadora ESADE BAN',
        description: 'Seleccionado para programa de incubación de empresas.'
      }
    ]
  },
  '11': {
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
      { 
        year: '2024',
        university: 'Universidad Autónoma de Barcelona',
        universityAcronym: 'UAB',
        degree: 'Ciencias Ambientales',
        achievement: 'Investigación en cambio climático',
        description: 'Participación en proyecto de investigación sobre impacto del cambio climático.'
      },
      { 
        year: '2023',
        university: 'Universidad Autónoma de Barcelona',
        universityAcronym: 'UAB',
        degree: 'Ciencias Ambientales',
        achievement: 'Activista Fridays for Future',
        description: 'Coordinadora local del movimiento climático juvenil.'
      }
    ]
  },
  '12': {
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
      { 
        year: '2024',
        university: 'Universidad Politécnica de Catalunya',
        universityAcronym: 'UPC',
        degree: 'Ingeniería Informática',
        achievement: 'Desarrollador en Google Summer of Code',
        description: 'Participación en programa de desarrollo de código abierto de Google.'
      },
      { 
        year: '2023',
        university: 'Universidad Politécnica de Catalunya',
        universityAcronym: 'UPC',
        degree: 'Ingeniería Informática',
        achievement: 'Hackathon winner',
        description: 'Ganador del hackathon de inteligencia artificial de la UPC.'
      }
    ]
  }
};

export default function OtherUserProfileScreen() {
  const params = useLocalSearchParams();
  const userId = params.id as string;
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<TabOption>('nows');
  const [userProfile, setUserProfile] = useState<typeof MOCK_PROFILES['1']>(MOCK_PROFILES['1']);
  const [followStats, setFollowStats] = useState({
    following: 0,
    followers: 0,
    visits: 0
  });

  // Cargar datos del usuario
  useEffect(() => {
    // Aquí iría la llamada a la API para cargar el perfil real
    // Por ahora usamos el mock
    setUserProfile(MOCK_PROFILES['1']);
  }, [userId]);

  // Cargar estadísticas
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await followService.getUserStats(userId);
        setFollowStats(stats);
      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    };
    loadStats();
  }, [userId]);

  const profileInfo = [
    {
      type: 'education',
      text: userProfile.education,
    },
    {
      type: 'location',
      text: userProfile.location,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor="white"
          onPress={() => router.back()}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileBanner 
          imageUri={userProfile.avatarUrl}
          statusColor={userProfile.statusColor}
          statusText={userProfile.status}
          isEditable={false}
        />
        
        <View style={styles.contentWrapper}>
          <View style={styles.userDisplayContainer}>
            <UserDisplay
              name={userProfile.name}
              username={userProfile.username}
              isEditable={false}
            />
            <FollowButton userId={userId} />
          </View>

          <ProfileStats
            following={followStats.following}
            followers={followStats.followers}
            visits={followStats.visits}
            userId={userId}
          />

          <ProfileInfo
            items={profileInfo}
            isEditable={false}
          />

          <Interests
            items={userProfile.interests}
            statusColor={userProfile.statusColor}
            isEditable={false}
          />

          <TabSlider
            onTabChange={setSelectedTab}
            initialTab={selectedTab}
            tabs={['nows', 'career']}
          />

          {selectedTab === 'nows' && (
            <View style={styles.sectionContainer}>
              <EmptyNows />
            </View>
          )}

          {selectedTab === 'career' && (
            <View style={styles.sectionContainer}>
              <Career
                items={userProfile.career}
                color={userProfile.statusColor}
                isEditable={false}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.02,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  userDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: SCREEN_WIDTH * 0.05,
  },
  sectionContainer: {
    flex: 1,
    marginTop: SCREEN_WIDTH * 0.04,
  },
});
