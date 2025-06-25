import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Banner from '@/components/Profile/Banner';
import FollowButton from '@/components/Profile/FollowButton';
import Header from '@/components/Profile/Header';
import Stats from '@/components/Profile/Stats';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: SCREEN_WIDTH * 0.03,
  },
  scrollView: {
    flex: 1,
  },  profileInfo: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginTop: SCREEN_WIDTH * 0.01,
    alignItems: 'flex-start',
  },
  name: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.038,
    fontWeight: '600',
  },  username: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: SCREEN_WIDTH * 0.032,
    marginTop: SCREEN_WIDTH * 0.005,
  },actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SCREEN_WIDTH * 0.06,
    gap: SCREEN_WIDTH * 0.03,
  },
  learnMoreButton: {
    width: SCREEN_WIDTH * 0.4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: SCREEN_WIDTH * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingVertical: SCREEN_WIDTH * 0.015,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  learnMoreText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.032,
    fontWeight: '600',
  },
  section: {
    marginBottom: SCREEN_WIDTH * 0.06,
  },
  lastSection: {
    marginBottom: SCREEN_WIDTH * 0.08,
  },  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_WIDTH * 0.03,
  },  sectionTitle: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.039,
    fontWeight: '600',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_WIDTH * 0.03,
  },
  seeMoreText: {
    color: '#4CAF50',
    fontSize: SCREEN_WIDTH * 0.032,
    fontWeight: '600',
  },
  dailyLifeScroll: {
    paddingLeft: SCREEN_WIDTH * 0.05,
  },  dailyLifeImageContainer: {
    width: SCREEN_WIDTH * 0.22,
    height: SCREEN_WIDTH * 0.32,
    borderRadius: SCREEN_WIDTH * 0.015,
    marginRight: SCREEN_WIDTH * 0.02,
    overflow: 'hidden',
    position: 'relative',
  },
  dailyLifeImage: {
    width: '100%',
    height: '100%',
  },
  dailyLifeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },  ambassadorsContainer: {
    paddingLeft: SCREEN_WIDTH * 0.05,
  },
  ambassadorCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: SCREEN_WIDTH * 0.02,
    padding: SCREEN_WIDTH * 0.03,
    marginRight: SCREEN_WIDTH * 0.03,
    width: SCREEN_WIDTH * 0.5,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ambassadorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  ambassadorAvatar: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: SCREEN_WIDTH * 0.06,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  ambassadorInfo: {
    flex: 1,
    marginLeft: SCREEN_WIDTH * 0.03,
  },
  ambassadorName: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '600',
  },
  ambassadorRole: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.03,
    marginTop: SCREEN_WIDTH * 0.01,
  },
  chatButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_WIDTH * 0.015,
    borderRadius: SCREEN_WIDTH * 0.015,
    alignItems: 'center',
    width: '90%',
  },
  chatButtonText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.03,
    fontWeight: '600',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_WIDTH * 0.02,
    borderRadius: SCREEN_WIDTH * 0.02,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    overflow: 'hidden',
  },
  faqThumbnail: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_WIDTH * 0.2,
  },    faqQuestion: {
    flex: 1,
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.036,
    padding: SCREEN_WIDTH * 0.04,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

type Ambassador = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

type FAQ = {
  id: string;
  question: string;
  thumbnailUrl: string;
};

const mockAmbassadors: Ambassador[] = [
  {
    id: '1',
    name: 'Alba G.G.',
    role: 'ADE',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Jofre B.F.',
    role: 'Medicina',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
];

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: '¿Cómo funciona la matrícula en la UAB?',
    thumbnailUrl: 'https://i.pravatar.cc/300?img=1',
  },
  {
    id: '2',
    question: '¿Qué clubs hay en el campus de Bellaterra?',
    thumbnailUrl: 'https://i.pravatar.cc/300?img=2',
  },
];

export default function UniversityProfileScreen() {
  const dailyLifeImages = [
    'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg',
    'https://images.pexels.com/photos/1644942/pexels-photo-1644942.jpeg',
    'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg',
    'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg',
  ];

  const handleDailyLifePress = () => {
    // TO-DO: Implementar vista de daily life
    router.push('/');
  };

  const handleAmbassadorPress = (ambassadorId: string) => {
    router.push({
      pathname: '/(tabs)/profile',
      params: { userId: ambassadorId }
    });
  };

  const handleChatPress = (ambassadorId: string, name: string, avatar: string) => {
    router.push({
      pathname: '/conversation',
      params: { 
        id: ambassadorId,
        name,
        avatar,
        subtitle: 'Embajador'
      }
    });
  };

  const handleFAQPress = (faqId: string) => {
    // TO-DO: Implementar vista de detalle de FAQ
    console.log('FAQ pressed:', faqId);
  };

  return (
    <View style={styles.container}>
      <Header title="" showBack={true} />
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingTop: SCREEN_WIDTH * 0.03 }}>
        <Banner
          statusText="UNIVERSIDAD"
          statusColor="#4CAF50"
          imageUri="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg"
          isEditable={false}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>U. Autónoma de Barcelona</Text>
          <Text style={styles.username}>@UAB</Text>
        </View>
        <Stats
          following={3000}
          followers={30000}
          visits={50000}
          showBackground={false}
          onPressFollowing={() => {}}
          onPressFollowers={() => {}}
          onPressVisits={() => {}}
        />

        <View style={styles.actionsContainer}>          <Pressable 
            style={styles.learnMoreButton}
            onPress={() => router.push('https://www.uab.cat')}
          >
            <Text style={styles.learnMoreText}>Saber más</Text>
          </Pressable>
          
          <FollowButton
            isFollowing={false}
            onToggleFollow={() => {}}
            style={[styles.learnMoreButton, { backgroundColor: '#FFFFFF' }]}
          />
        </View>

        {/* Daily Life Section */}
        <View style={styles.section}>          <Text style={styles.sectionTitle}>El día a día en la UAB</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.dailyLifeScroll}
          >
            {dailyLifeImages.map((image, index) => (
              <Pressable 
                key={index} 
                style={styles.dailyLifeImageContainer}
                onPress={() => handleDailyLifePress()}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.dailyLifeImage}
                />
                <View style={styles.dailyLifeOverlay} />
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Ambassadors Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conoce a nuestros embajadores</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.ambassadorsContainer}
          >
            {mockAmbassadors.map(ambassador => (              <Pressable 
                key={ambassador.id}
                style={styles.ambassadorCard}
                onPress={() => handleAmbassadorPress(ambassador.id)}
              >
                <View style={styles.ambassadorContent}>
                  <Image
                    source={{ uri: ambassador.avatarUrl }}
                    style={styles.ambassadorAvatar}
                  />
                  <View style={styles.ambassadorInfo}>
                    <Text style={styles.ambassadorName}>{ambassador.name}</Text>
                    <Text style={styles.ambassadorRole}>{ambassador.role}</Text>
                  </View>
                </View>
                <Pressable 
                  style={styles.chatButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleChatPress(
                      ambassador.id,
                      ambassador.name,
                      ambassador.avatarUrl
                    );
                  }}
                >
                  <Text style={styles.chatButtonText}>¿Hablamos?</Text>
                </Pressable>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* FAQs Section */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>FAQs de estudiantes</Text>
          {mockFAQs.map(faq => (
            <Pressable 
              key={faq.id}
              style={styles.faqItem}
              onPress={() => handleFAQPress(faq.id)}
            >
              <Image
                source={{ uri: faq.thumbnailUrl }}
                style={styles.faqThumbnail}
              />
              <Text style={styles.faqQuestion}>{faq.question}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
