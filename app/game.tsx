import Header from '@/components/Profile/Header';
import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Reward = {
  id: string;
  title: string;
  description: string;
  points: number;
  isUnlocked: boolean;
};

type Challenge = {
  id: string;
  title: string;
  description: string;
  currentProgress: number;
  totalNeeded: number;
  points: number;
};

const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'Explorador Novato',
    description: 'Desbloquea nuevas funciones de la app',
    points: 100,
    isUnlocked: true,
  },
  {
    id: '2',
    title: 'Influencer Junior',
    description: 'Obtén un badge especial en tu perfil',
    points: 250,
    isUnlocked: false,
  },
  {
    id: '3',
    title: 'Master Social',
    description: 'Acceso a características exclusivas',
    points: 500,
    isUnlocked: false,
  },
  {
    id: '4',
    title: 'NOW Legend',
    description: 'Recompensas especiales de la comunidad',
    points: 1000,
    isUnlocked: false,
  },
];

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Like Master',
    description: 'Da like a 5 vídeos de otros usuarios',
    currentProgress: 3,
    totalNeeded: 5,
    points: 50,
  },
  {
    id: '2',
    title: 'Comentarista',
    description: 'Comenta en 3 vídeos diferentes',
    currentProgress: 1,
    totalNeeded: 3,
    points: 30,
  },
  {
    id: '3',
    title: 'Creador de Contenido',
    description: 'Publica tu primer vídeo',
    currentProgress: 0,
    totalNeeded: 1,
    points: 100,
  },
  {
    id: '4',
    title: 'Networker',
    description: 'Sigue a 10 nuevos usuarios',
    currentProgress: 4,
    totalNeeded: 10,
    points: 70,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    paddingVertical: SCREEN_WIDTH * 0.05,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  progressBar: {
    height: SCREEN_WIDTH * 0.02,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: SCREEN_WIDTH * 0.01,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7A9AEC',
    borderRadius: SCREEN_WIDTH * 0.01,
  },
  progressText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.032,
    marginBottom: SCREEN_WIDTH * 0.02,
    fontWeight: '600',
  },
  rewardsContainer: {
    paddingLeft: SCREEN_WIDTH * 0.05,
  },
  rewardCard: {
    width: SCREEN_WIDTH * 0.4,
    backgroundColor: '#1A1A1A',
    borderRadius: SCREEN_WIDTH * 0.03,
    padding: SCREEN_WIDTH * 0.03,
    marginRight: SCREEN_WIDTH * 0.03,
    marginBottom: SCREEN_WIDTH * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  rewardTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.034,
    fontWeight: '600',
    marginBottom: SCREEN_WIDTH * 0.01,
  },
  rewardDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.028,
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  rewardPoints: {
    color: '#7A9AEC',
    fontSize: SCREEN_WIDTH * 0.032,
    fontWeight: '600',
  },
  lockedReward: {
    opacity: 0.5,
  },
  sectionTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.042,
    fontWeight: '600',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_WIDTH * 0.03,
  },
  challengeCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: SCREEN_WIDTH * 0.03,
    padding: SCREEN_WIDTH * 0.04,
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_WIDTH * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  challengeTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.036,
    fontWeight: '600',
  },
  challengePoints: {
    color: '#7A9AEC',
    fontSize: SCREEN_WIDTH * 0.032,
    fontWeight: '600',
  },
  challengeDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.032,
    marginBottom: SCREEN_WIDTH * 0.03,
  },
  challengeProgressBar: {
    height: SCREEN_WIDTH * 0.015,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: SCREEN_WIDTH * 0.0075,
    overflow: 'hidden',
  },
  challengeProgressFill: {
    height: '100%',
    backgroundColor: '#7A9AEC',
    borderRadius: SCREEN_WIDTH * 0.0075,
  },
  challengeProgressText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.028,
    marginTop: SCREEN_WIDTH * 0.01,
    textAlign: 'right',
  },
});

export default function GameScreen() {
  // Calcular el progreso total basado en los puntos obtenidos
  const totalPoints = 1000; // Puntos máximos
  const currentPoints = 180; // Puntos actuales
  const progressPercentage = (currentPoints / totalPoints) * 100;

  return (
    <View style={styles.container}>
      <Header title="Recompensas" showBack={true} />
      <ScrollView style={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{currentPoints} / {totalPoints} puntos</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>

        {/* Rewards Section */}
        <Text style={styles.sectionTitle}>Recompensas</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.rewardsContainer}
        >
          {mockRewards.map(reward => (
            <Pressable 
              key={reward.id}
              style={[
                styles.rewardCard,
                !reward.isUnlocked && styles.lockedReward
              ]}
            >
              <Text style={styles.rewardTitle}>{reward.title}</Text>
              <Text style={styles.rewardDescription}>{reward.description}</Text>
              <Text style={styles.rewardPoints}>{reward.points} pts</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Challenges Section */}
        <Text style={styles.sectionTitle}>Objetivos</Text>
        {mockChallenges.map(challenge => (
          <View key={challenge.id} style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengePoints}>+{challenge.points} pts</Text>
            </View>
            <Text style={styles.challengeDescription}>{challenge.description}</Text>
            <View style={styles.challengeProgressBar}>
              <View 
                style={[
                  styles.challengeProgressFill, 
                  { width: `${(challenge.currentProgress / challenge.totalNeeded) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.challengeProgressText}>
              {challenge.currentProgress}/{challenge.totalNeeded}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}