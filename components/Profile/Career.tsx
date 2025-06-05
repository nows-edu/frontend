import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CareerItem = {
  year: string;
  achievement: string;
  description?: string;
};

type TimelineItem = CareerItem | { type: 'add' };

type CareerProps = {
  items: CareerItem[];
  color: string;
  isEditable?: boolean;
  onAddItem?: () => void;
  onEditItem?: (index: number, item: CareerItem) => void;
  onDeleteItem?: (index: number) => void;
};

export default function Career({ 
  items, 
  color, 
  isEditable, 
  onAddItem, 
  onEditItem, 
  onDeleteItem 
}: CareerProps) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const animationsMap = React.useRef<Map<number, Animated.Value>>(new Map());

  // Create or get animation for an index
  const getAnimation = (index: number) => {
    if (!animationsMap.current.has(index)) {
      animationsMap.current.set(index, new Animated.Value(0));
    }
    return animationsMap.current.get(index)!;
  };

  const toggleExpand = (index: number) => {
    const isExpanding = expandedIndex !== index;
    
    // Collapse previous item if exists
    if (expandedIndex !== null && expandedIndex !== index) {
      const prevAnimation = getAnimation(expandedIndex);
      Animated.timing(prevAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }

    // Expand/collapse selected item
    const animation = getAnimation(index);
    Animated.timing(animation, {
      toValue: isExpanding ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setExpandedIndex(isExpanding ? index : null);
  };

  const timelineItems: TimelineItem[] = [
    ...items,
    ...(isEditable ? [{ type: 'add' } as const] : [])
  ];

  return (
    <View style={styles.container}>
      <View style={styles.timeline}>
        {timelineItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === timelineItems.length - 1;
          const isAddButton = 'type' in item && item.type === 'add';
          const isExpanded = expandedIndex === index;
          const animation = getAnimation(index);

          const dotSize = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [SCREEN_WIDTH * 0.035, SCREEN_WIDTH * 0.045]
          });

          return (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.lineContainer}>
                {!isFirst && <View style={[styles.line, { backgroundColor: color }]} />}
                <Pressable
                  onPress={isAddButton ? onAddItem : () => toggleExpand(index)}
                  style={styles.dotContainer}
                >
                  <Animated.View style={[
                    styles.dot,
                    {
                      width: dotSize,
                      height: dotSize,                    backgroundColor: isAddButton ? color : (isExpanded ? color : 'rgba(255,255,255,0.1)'),
                      borderColor: color,
                    }
                  ]} />
                </Pressable>
                {!isLast && <View style={[styles.line, { backgroundColor: color }]} />}
              </View>                {isAddButton ? (
                <Pressable
                  style={[styles.contentContainer]}
                  onPress={onAddItem}
                >
                  <View style={[styles.headerRow, styles.addButtonRow]}>
                    <Text style={[styles.achievementText, { color: color }]}>
                      Añadir nueva experiencia académica
                    </Text>
                  </View>
                </Pressable>
              ) : 'year' in item && (
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
                    {isEditable && (
                      <Pressable
                        onPress={() => onEditItem?.(index, item)}
                        style={styles.actionButton}
                      >
                        <MaterialIcons
                          name="edit"
                          size={20}
                          color="rgba(255,255,255,0.6)"
                        />
                      </Pressable>
                    )}
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
                        maxHeight: animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 200]
                        }),
                        opacity: animation
                      }
                    ]}
                  >
                    <Text style={styles.descriptionText}>
                      {item.description || 'Logro académico destacado que marca un hito en mi trayectoria universitaria.'}
                    </Text>
                  </Animated.View>
                </Pressable>
              )}
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SCREEN_WIDTH * 0.02,
    marginRight: SCREEN_WIDTH * 0.02,
  },
  actionButton: {
    padding: SCREEN_WIDTH * 0.01,
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
  dotContainer: {
    padding: SCREEN_WIDTH * 0.01,
  },  dot: {
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
    justifyContent: 'center',
  },  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SCREEN_WIDTH * 0.03,
    gap: SCREEN_WIDTH * 0.03,
    minHeight: SCREEN_WIDTH * 0.08,
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
  },  descriptionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: SCREEN_WIDTH * 0.032,
    lineHeight: SCREEN_WIDTH * 0.05,
  },
  addButtonRow: {
    paddingVertical: SCREEN_WIDTH * 0.01,
    height: SCREEN_WIDTH * 0.08,
    alignItems: 'center',
  },
});
