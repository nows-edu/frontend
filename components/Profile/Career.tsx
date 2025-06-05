import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CareerItem = {
  year: string;
  achievement: string;
  description?: string;
};

type CareerProps = {
  items: CareerItem[];
  color: string;
  isEditable?: boolean;
  onAddItem?: () => void;
};

export default function Career({ items, color, isEditable, onAddItem }: CareerProps) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const animations = React.useRef(items.map(() => new Animated.Value(0)));

  const toggleExpand = (index: number) => {
    const isExpanding = expandedIndex !== index;
    
    // Collapse previous item if exists
    if (expandedIndex !== null && expandedIndex !== index) {
      Animated.timing(animations.current[expandedIndex], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }

    // Expand/collapse selected item
    Animated.timing(animations.current[index], {
      toValue: isExpanding ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setExpandedIndex(isExpanding ? index : null);
  };
  return (
    <View style={styles.container}>
      {isEditable && (
        <Pressable 
          style={[styles.addButton, { borderColor: color }]}
          onPress={onAddItem}
        >
          <MaterialIcons name="add" size={24} color={color} />
          <Text style={[styles.addButtonText, { color }]}>
            Añadir logro académico
          </Text>
        </Pressable>
      )}
      <View style={styles.timeline}>
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const isExpanded = expandedIndex === index;

          const dotSize = animations.current[index].interpolate({
            inputRange: [0, 1],
            outputRange: [SCREEN_WIDTH * 0.035, SCREEN_WIDTH * 0.045]
          });

          return (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.lineContainer}>
                {!isFirst && <View style={[styles.line, { backgroundColor: color }]} />}
                <Animated.View style={[
                  styles.dot,
                  {
                    width: dotSize,
                    height: dotSize,
                    backgroundColor: isExpanded ? color : 'rgba(255,255,255,0.1)',
                    borderColor: color,
                  }
                ]} />
                {!isLast && <View style={[styles.line, { backgroundColor: color }]} />}
              </View>
              
              <Pressable
                style={[
                  styles.contentContainer,
                  isExpanded && { backgroundColor: 'rgba(255,255,255,0.05)' }
                ]}
                onPress={() => toggleExpand(index)}
              >
                <View style={styles.headerRow}>
                  <View style={[styles.yearBadge, { backgroundColor: color + '33', borderColor: color }]}>
                    <Text style={styles.yearText}>{item.year}</Text>
                  </View>
                  <Text style={styles.achievementText}>{item.achievement}</Text>
                  <MaterialIcons
                    name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color="rgba(255,255,255,0.6)"
                  />
                </View>
                
                <Animated.View
                  style={[
                    styles.descriptionContainer,
                    {
                      maxHeight: animations.current[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 200]
                      }),
                      opacity: animations.current[index]
                    }
                  ]}
                >
                  <Text style={styles.descriptionText}>
                    {item.description || 'Logro académico destacado que marca un hito en mi trayectoria universitaria.'}
                  </Text>
                </Animated.View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SCREEN_WIDTH * 0.04,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SCREEN_WIDTH * 0.03,
    marginHorizontal: SCREEN_WIDTH * 0.2,
    marginBottom: SCREEN_WIDTH * 0.04,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: SCREEN_WIDTH * 0.02,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  addButtonText: {
    marginLeft: SCREEN_WIDTH * 0.02,
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: '600',
  },
  timeline: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: SCREEN_WIDTH * 0.15,
  },
  lineContainer: {
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.08,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dot: {
    width: SCREEN_WIDTH * 0.035,
    height: SCREEN_WIDTH * 0.035,
    borderRadius: SCREEN_WIDTH * 0.0175,
    borderWidth: 2,
    marginVertical: SCREEN_WIDTH * 0.02,
  },
  contentContainer: {
    flex: 1,
    marginLeft: SCREEN_WIDTH * 0.02,
    marginVertical: SCREEN_WIDTH * 0.01,
    borderRadius: SCREEN_WIDTH * 0.02,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SCREEN_WIDTH * 0.03,
    gap: SCREEN_WIDTH * 0.03,
  },
  yearBadge: {
    paddingHorizontal: SCREEN_WIDTH * 0.025,
    paddingVertical: SCREEN_WIDTH * 0.008,
    borderRadius: SCREEN_WIDTH * 0.015,
    borderWidth: 1,
  },
  yearText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.032,
    fontWeight: '600',
  },
  achievementText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.035,
    flex: 1,
    fontWeight: '500',
  },
  descriptionContainer: {
    overflow: 'hidden',
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingBottom: SCREEN_WIDTH * 0.03,
  },
  descriptionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.032,
    lineHeight: SCREEN_WIDTH * 0.05,
  },
});
