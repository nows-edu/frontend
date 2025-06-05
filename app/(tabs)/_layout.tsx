import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Dimensiones y constantes
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Math.min(SCREEN_HEIGHT * 0.1, 80);
const ICON_SIZE = Math.min(SCREEN_WIDTH * 0.07, 30);
const CENTER_BUTTON_SIZE = Math.min(SCREEN_WIDTH * 0.16, 65);

// Colores del tema
const COLORS = {
  gradient: {
    dark1: 'rgba(0, 0, 0, 1)',
    dark2: 'rgba(0, 0, 0, 1)',
  },
  button: {
    primary: '#000000',
    primaryTransparent: 'rgba(0, 0, 0, 0.8)',
  },
  icon: {
    active: '#FFFFFF',
    inactive: 'rgba(255, 255, 255, 0.3)',
  },
  text: {
    white: 'rgba(255, 255, 255, 1)',
  }
};

// Componente de fondo con gradiente
function GradientTabBarBackground() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={[COLORS.gradient.dark1, COLORS.gradient.dark2]}
      start={[0, 0]}
      end={[0, 1]}
      style={[styles.tabBarBg, { paddingBottom: insets.bottom }]}
    />
  );
}

// Botón central con gradiente
function CenterButton({ focused }: { focused: boolean }) {
  return (
    <View style={styles.centerButtonWrapper}>
      <View style={[styles.centerButton, { backgroundColor: '#FFFFFF' }]}>
        <MaterialIcons 
          name="add" 
          size={CENTER_BUTTON_SIZE * 0.5} 
          color="#000000" 
        />
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <GradientTabBarBackground />,
        tabBarIcon: ({ focused }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;          switch (route.name) {            case 'home': iconName = focused ? 'home' : 'home'; break;
            case 'experiences': iconName = focused ? 'favorite' : 'favorite-outline'; break;
            case 'explore': return <CenterButton focused={focused} />;
            case 'chat': iconName = focused ? 'textsms' : 'chat-bubble-outline'; break;
            case 'profile': iconName = focused ? 'person' : 'person-outline'; break;
            default: iconName = 'circle';
          }
          return (
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name={iconName}
                size={ICON_SIZE}
                color={focused ? COLORS.icon.active : COLORS.icon.inactive}
                style={styles.icon}
              />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="experiences" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({  tabBar: {
    height: TAB_BAR_HEIGHT,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 0,
    borderTopColor: 'transparent',
  },
  tabBarBg: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  centerButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -CENTER_BUTTON_SIZE * 0.01,
  },
  centerButton: {
    width: CENTER_BUTTON_SIZE,
    height: CENTER_BUTTON_SIZE,
    borderRadius: CENTER_BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  iconWrapper: {
    height: TAB_BAR_HEIGHT * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: TAB_BAR_HEIGHT * 0.05,
  },
  icon: {
    marginTop: TAB_BAR_HEIGHT * 0.25,
  },
});