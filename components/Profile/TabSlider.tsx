import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type TabOption = 'nows' | 'agenda' | 'career';

type Props = {
  onTabChange?: (selectedTab: TabOption) => void;
  initialTab?: TabOption;
  tabs?: TabOption[];
  labels?: {
    [key in TabOption]?: string;
  };
};

const DEFAULT_TABS: TabOption[] = ['nows', 'agenda'];
const DEFAULT_LABELS: { [key in TabOption]: string } = {
  nows: 'Mis Nows',
  agenda: 'Agenda',
  career: 'Trayectoria'
};

const TabSlider: React.FC<Props> = ({ 
  onTabChange, 
  initialTab = 'nows',
  tabs = DEFAULT_TABS,
  labels = DEFAULT_LABELS
}) => {
  const [selected, setSelected] = useState<TabOption>(initialTab);

  const handlePress = (tab: TabOption) => {
    setSelected(tab);
    if (onTabChange) onTabChange(tab);
  };
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.separator} />
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.tab,
              selected === tab && styles.selectedTab
            ]}
            onPress={() => handlePress(tab)}
          >
            <Text style={[styles.text, selected === tab && styles.selectedText]}>
              {labels[tab] || DEFAULT_LABELS[tab]}
            </Text>
            {selected === tab && <View style={styles.underline} />}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const TAB_WIDTH = SCREEN_WIDTH * 0.3; // Ancho fijo para cada tab

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: SCREEN_WIDTH * 0.02,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#000',
    position: 'relative',
  },  separator: {
    position: 'absolute',
    bottom: -SCREEN_WIDTH * 0.02,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(76, 76, 76, 0.1)',
  },
  tab: {
    width: TAB_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTab: {
    alignItems: 'center',
  },  text: {
    fontSize: SCREEN_WIDTH * 0.038,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: SCREEN_WIDTH * 0.01,
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  underline: {
    marginTop: SCREEN_WIDTH * 0.015,
    height: 2,
    width: SCREEN_WIDTH * 0.15,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    position: 'absolute',
    bottom: -SCREEN_WIDTH * 0.02,
  },
});

export default TabSlider;
