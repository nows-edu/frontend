import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DynamicIslandProps {
  type: 'Reto' | 'Opinión' | 'Usuario';
  statement: string;
  profileData?: {
    education?: string;
    location?: string;
    interests?: string[];
  };
}

const DynamicIsland: React.FC<DynamicIslandProps> = ({ type, statement, profileData }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [userToggled, setUserToggled] = useState(false);
  const expandAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Reset state and animation when cambia el contenido
    setIsExpanded(true);
    setUserToggled(false);
    expandAnim.setValue(1);

    // Start collapse timer
    const timer = setTimeout(() => {
      if (!userToggled) {
        handleCollapse();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [statement, type]);

  const handleCollapse = () => {
    setIsExpanded(false); // Primero actualizamos el estado
    Animated.spring(expandAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65, // Aumentado para más velocidad
      friction: 10, // Ajustado para menos rebote
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01
    }).start();
  };

  const handleExpand = () => {
    setIsExpanded(true);
    Animated.spring(expandAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8
    }).start();
  };

  const handlePress = () => {
    setUserToggled(true);
    if (isExpanded) {
      handleCollapse();
    } else {
      handleExpand();
    }
  };

  const scale = expandAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.95, 0.97, 1]
  });

  const translateY = expandAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-8, -4, 0]
  });

  const opacity = expandAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.85, 0.9, 1]
  });

  return (
    <View style={[
      styles.wrapper,
      { 
        alignItems: isExpanded ? 'stretch' : 'center',
        marginTop: isExpanded ? 6 : 12 // Aumentado a 12px cuando está contraído
      }
    ]}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={handlePress}
        style={[
          styles.touchable,
          { 
            width: isExpanded ? '92%' : 'auto', // 92% para dejar margen a ambos lados
            marginHorizontal: isExpanded ? 'auto' : SCREEN_WIDTH * 0.25, // auto centrará con el width:92%
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.container,
            { 
              transform: [
                { scale },
                { translateY }
              ],
              minHeight: isExpanded ? 84 : 38,
              width: isExpanded ? '100%' : 'auto',
              paddingHorizontal: isExpanded ? 16 : 12,
              paddingVertical: isExpanded ? 16 : 8,
              opacity,
              alignSelf: isExpanded ? 'stretch' : 'center',
            }
          ]}
        >
          <View style={[
            styles.header,
            !isExpanded && styles.headerCollapsed
          ]}>
            <View style={styles.typeContainer}>
              <MaterialIcons 
                name={
                  type === 'Reto' ? 'mic' : 
                  type === 'Opinión' ? 'mic' : 
                  'person'
                } 
                size={isExpanded ? 18 : 22} 
                color="white" 
              />
              <Text style={[
                styles.typeText,
                !isExpanded && styles.typeTextCollapsed
              ]}>
                {type}
              </Text>
            </View>
          </View>

          {isExpanded && (
            <Animated.View
              style={{
                opacity: expandAnim,
              }}
            >
              {type === 'Usuario' && profileData ? (
                <View style={styles.profileContent}>
                  {profileData.education && (
                    <Text style={styles.profileEducation}>{profileData.education}</Text>
                  )}
                  {profileData.location && (
                    <Text style={styles.profileLocation}>📍 {profileData.location}</Text>
                  )}
                  {profileData.interests && profileData.interests.length > 0 && (
                    <View style={styles.profileInterests}>
                      {profileData.interests.map((interest, index) => (
                        <View key={index} style={styles.interestTag}>
                          <Text style={styles.interestText}>{interest}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <Text 
                  style={styles.statement}
                  numberOfLines={3}
                  adjustsFontSizeToFit={false}
                >
                  {statement}
                </Text>
              )}
            </Animated.View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 0, // Quitamos el padding vertical ya que ahora usamos margin
    alignItems: 'center',
    width: '100%',
  },
  touchable: {
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    justifyContent: 'center', // Centra el contenido verticalmente
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: 90,
  },
  headerCollapsed: {
    justifyContent: 'center',
    gap: 8, // Un poco más de espacio entre icono y texto
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  typeTextCollapsed: {
    fontSize: 16,
    fontWeight: '600', // Un poco más bold cuando está contraído
  },
  statement: {
    color: 'white',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
    width: '100%',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  profileContent: {
    marginTop: 8,
  },
  profileEducation: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  profileLocation: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  profileInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  interestTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  interestText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
});

export default DynamicIsland;
