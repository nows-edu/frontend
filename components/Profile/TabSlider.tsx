import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type TabOption = 'nows' | 'agenda';

type Props = {
  onTabChange?: (selectedTab: TabOption) => void;
  initialTab?: TabOption;
};

const TabSlider: React.FC<Props> = ({ onTabChange, initialTab = 'nows' }) => {
  const [selected, setSelected] = useState<TabOption>(initialTab);

  const handlePress = (tab: TabOption) => {
    setSelected(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.tab}
        onPress={() => handlePress('nows')}
      >
        <Text style={[styles.text, selected === 'nows' && styles.selectedText]}>
          Mis Nows
        </Text>
        {selected === 'nows' && <View style={styles.underline} />}
      </Pressable>

      <Pressable
        style={styles.tab}
        onPress={() => handlePress('agenda')}
      >
        <Text style={[styles.text, selected === 'agenda' && styles.selectedText]}>
          Agenda
        </Text>
        {selected === 'agenda' && <View style={styles.underline} />}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SCREEN_WIDTH * 0.08,
    marginVertical: SCREEN_WIDTH * 0.05,
    backgroundColor: '#000',
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.02,
  },
  text: {
    fontSize: SCREEN_WIDTH * 0.038,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '400',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },  underline: {
    marginTop: SCREEN_WIDTH * 0.015,
    height: 2,
    width: SCREEN_WIDTH * 0.15,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});

export default TabSlider;
