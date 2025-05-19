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
    dark1: 'rgba(18, 18, 18, 1)',
    dark2: 'rgba(26, 26, 26, 1)',
  },
  button: {
    primary: 'rgb(74, 119, 234)',
    primaryTransparent: 'rgba(122, 154, 236, 0.8)',
  },
  icon: {
    active: 'rgba(122, 154, 236, 1)',
    inactive: 'rgba(153, 153, 153, 1)',
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
      <LinearGradient
        colors={[COLORS.button.primary, COLORS.button.primary]}
        style={styles.centerButton}
      >
        <MaterialIcons 
          name="add" 
          size={CENTER_BUTTON_SIZE * 0.5} 
          color={COLORS.text.white} 
        />
      </LinearGradient>
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
          let iconName: keyof typeof MaterialIcons.glyphMap;          switch (route.name) {
            case 'home': iconName = 'home-filled'; break;
            case 'experiences': iconName = 'apps'; break;
            case 'explore': return <CenterButton focused={focused} />;
            case 'chat': iconName = 'chat-bubble-outline'; break;
            case 'profile': iconName = 'person'; break;
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
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
    borderTopColor: 'transparent',
  },
  tabBarBg: {
    flex: 1,
    borderTopLeftRadius: Math.min(SCREEN_WIDTH * 0.03, 24),
    borderTopRightRadius: Math.min(SCREEN_WIDTH * 0.03, 24),
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