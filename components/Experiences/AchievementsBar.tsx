import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ACHIEVEMENT_SIZE = SCREEN_WIDTH * 0.11;

type Achievement = {
  id: number;
  name: string;
  icon: string;
  unlocked: boolean;
}

type AchievementsBarProps = {
  progress: number;
  achievements: Achievement[];
}

export default function AchievementsBar({ progress, achievements }: AchievementsBarProps) {
  const animatedWidth = React.useRef(new Animated.Value(0)).current;
  const totalAchievements = 5; // Mostramos 5 elementos
  
  // Calculamos el índice actual y aseguramos que siempre mostremos el objetivo actual en el centro
  const currentFullIndex = Math.floor((progress / 70) * achievements.length);
  const startIndex = Math.max(0, currentFullIndex - 2); // 2 elementos antes del actual
  const visibleAchievements = achievements.slice(startIndex, startIndex + totalAchievements);
  const currentIndex = 2; // Siempre en el centro (índice 2 de 5)
  
  // Completamos hasta tener 5 elementos si es necesario
  while (visibleAchievements.length < totalAchievements) {
    const lastAchievement = visibleAchievements[visibleAchievements.length - 1];
    visibleAchievements.push({
      ...lastAchievement,
      id: lastAchievement.id + visibleAchievements.length,
      unlocked: false
    });
  }
  
  // Calculamos el progreso dentro del segmento actual
  const segmentSize = 70 / achievements.length;
  const currentProgress = progress % segmentSize;
  const progressPercentage = (currentProgress / segmentSize) * 100;
  
  React.useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progressPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Pressable 
      style={styles.container}
      onPress={() => router.push('/game')}
    >
        <View style={styles.header}>
        <View style={styles.titleSection}>          <View style={styles.titleRow}>            <MaterialIcons name="school" size={22} color="#7A9AEC" />
            <Text style={styles.titlePrefix}>Nivel: </Text>
            <Text style={styles.title}>Universitario</Text>
          </View>
          <Text style={styles.subtitle}>Completa objetivos y desbloquea recompensas.</Text>
        </View>
        <View style={styles.pointsSection}>
          <View style={styles.pointsContainer}>
            <MaterialIcons name="star" size={16} color="#7A9AEC" />
            <Text style={styles.progressText}>{progress}</Text>
            <Text style={styles.totalPoints}>/70</Text>
          </View>
          <TouchableOpacity 
            style={styles.levelButton}
            onPress={() => router.push('/game')}
          >
            <Text style={styles.levelButtonText}>Ver objetivos →</Text>
          </TouchableOpacity>
        </View>
      </View><View style={styles.progressContainer}>      <View style={styles.progressTrack}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: progressWidth }
              ]} 
            >
              <LinearGradient
                colors={['#7A9AEC', '#5C7ED6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>
        
        <View style={styles.achievementsRow}>
          {visibleAchievements.map((achievement, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isUpcoming = index > currentIndex;
            
            return (
              <Pressable 
                key={achievement.id}
                onPress={() => router.push('/game')}
                style={styles.achievementWrapper}
              >                <View 
                  style={[
                    styles.achievement,
                    isCompleted && styles.achievementCompleted,
                    isCurrent && styles.achievementCurrent,
                    isUpcoming && styles.achievementUpcoming
                  ]}
                >                  <MaterialIcons 
                    name={achievement.icon as keyof typeof MaterialIcons.glyphMap}
                    size={ACHIEVEMENT_SIZE * 0.6}
                    color={isCompleted ? '#ffffff' : isCurrent ? '#7A9AEC' : 'rgba(255,255,255,0.3)'}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({  container: {
    width: '100%',
    padding: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_WIDTH * 0.03,
    marginVertical: SCREEN_WIDTH * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SCREEN_WIDTH * 0.04,
  },
  titleSection: {
    flex: 1,
    marginRight: SCREEN_WIDTH * 0.04,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH * 0.01,
  },  titlePrefix: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.042,
    fontWeight: '500',
    marginLeft: SCREEN_WIDTH * 0.02,
  },
  title: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.042,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.03,
    marginTop: SCREEN_WIDTH * 0.01,
    maxWidth: '90%',
    lineHeight: SCREEN_WIDTH * 0.04,
    fontWeight: '500',
  },
  pointsSection: {
    alignItems: 'flex-end',
  },  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(122,154,236,0.06)',
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingVertical: SCREEN_WIDTH * 0.015,
    borderRadius: SCREEN_WIDTH * 0.02,
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  progressText: {
    color: '#7A9AEC',
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '700',
    marginHorizontal: SCREEN_WIDTH * 0.01,
  },
  totalPoints: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: SCREEN_WIDTH * 0.035,
  },
  levelButton: {
    paddingVertical: SCREEN_WIDTH * 0.01,
  },
  levelButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: SCREEN_WIDTH * 0.03,
  },  progressContainer: {
    width: '100%',
    height: SCREEN_WIDTH * 0.18,
    justifyContent: 'center',
    marginVertical: SCREEN_WIDTH * 0.02,
  },progressTrack: {
    padding: SCREEN_WIDTH * 0.012,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: SCREEN_WIDTH * 0.02,
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -SCREEN_WIDTH * 0.008 }],
    zIndex: 1,
  },
  progressBarContainer: {
    height: SCREEN_WIDTH * 0.025,
    width: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -SCREEN_WIDTH * 0.0125 }],
  },
  progressBar: {
    width: '100%',
    height: SCREEN_WIDTH * 0.015,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopLeftRadius: SCREEN_WIDTH * 0.0075,
    borderBottomLeftRadius: SCREEN_WIDTH * 0.0075,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderTopLeftRadius: SCREEN_WIDTH * 0.0075,
    borderBottomLeftRadius: SCREEN_WIDTH * 0.0075,
    overflow: 'hidden',
  },  achievementsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
    marginBottom: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_WIDTH * 0.02,
  },
  achievementWrapper: {
    padding: SCREEN_WIDTH * 0.015,
    alignItems: 'center',
    marginHorizontal: SCREEN_WIDTH * 0.02, // Aumentado de 0.015 a 0.025
  },
  achievement: {
    width: ACHIEVEMENT_SIZE,
    height: ACHIEVEMENT_SIZE,
    borderRadius: ACHIEVEMENT_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementCompleted: {
    backgroundColor: '#7A9AEC',
    elevation: 5,
    shadowColor: '#7A9AEC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },  achievementCurrent: {
    backgroundColor: 'rgba(122,154,236,0.1)',
    borderWidth: 2,
    borderColor: '#7A9AEC',
    transform: [{ scale: 1.2 }],
    elevation: 8,
    shadowColor: '#7A9AEC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },  achievementUpcoming: {
    backgroundColor: '#2a2a2a',
  },
  achievementDot: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 2,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_WIDTH * 0.2,
    borderRadius: SCREEN_WIDTH * 0.03,
  },
});