import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View } from 'react-native';

import { SwipeCard } from '@/components/organisms/SwipeCard';
import { Profile } from '@/types/profile';

export type SwipeDirection = 'left' | 'right';

export type CardDeckRef = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

type CardDeckProps = {
  profiles: Profile[];
  onSwipe?: (profile: Profile, direction: SwipeDirection) => void;
  onIndexChange?: (nextIndex: number) => void;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.72;
const NEXT_CARD_OFFSET = 28;

export const CardDeck = forwardRef<CardDeckRef, CardDeckProps>(({ profiles, onSwipe, onIndexChange }, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const indexRef = useRef(currentIndex);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    setCurrentIndex(0);
    pan.setValue({ x: 0, y: 0 });
    indexRef.current = 0;
    isAnimatingRef.current = false;
  }, [profiles, pan]);

  useEffect(() => {
    indexRef.current = currentIndex;
    isAnimatingRef.current = false;
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  const handleSwipeComplete = useCallback(
    (direction: SwipeDirection) => {
      const swipedProfile = profiles[indexRef.current];
      pan.setValue({ x: 0, y: 0 });
      if (swipedProfile) {
        onSwipe?.(swipedProfile, direction);
      }
      setCurrentIndex((prev) => prev + 1);
    },
    [onSwipe, pan, profiles],
  );

  const triggerSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (isAnimatingRef.current || indexRef.current >= profiles.length) return;
      isAnimatingRef.current = true;
      const xTarget = direction === 'right' ? SCREEN_WIDTH * 1.2 : -SCREEN_WIDTH * 1.2;
      Animated.timing(pan, {
        toValue: { x: xTarget, y: 0 },
        duration: 200,
        useNativeDriver: true,
      }).start(() => handleSwipeComplete(direction));
    },
    [handleSwipeComplete, pan, profiles.length],
  );

  const resetPosition = useCallback(() => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 6,
    }).start();
  }, [pan]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          !isAnimatingRef.current && (Math.abs(gesture.dx) > 6 || Math.abs(gesture.dy) > 6),
        onPanResponderMove: (_, gesture) => {
          if (isAnimatingRef.current) return;
          pan.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_, gesture) => {
          if (isAnimatingRef.current) return;
          if (gesture.dx > SWIPE_THRESHOLD) {
            triggerSwipe('right');
            return;
          }
          if (gesture.dx < -SWIPE_THRESHOLD) {
            triggerSwipe('left');
            return;
          }
          resetPosition();
        },
      }),
    [pan, resetPosition, triggerSwipe],
  );

  useImperativeHandle(ref, () => ({
    swipeLeft: () => triggerSwipe('left'),
    swipeRight: () => triggerSwipe('right'),
  }));

  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderCards = () => {
    if (currentIndex >= profiles.length) {
      return (
        <View style={[styles.card, styles.emptyCard]}>
          <Animated.Text style={styles.emptyText}>You are all caught up</Animated.Text>
        </View>
      );
    }

    const remaining = profiles.slice(currentIndex);
    const visibleCards = remaining.slice(0, 2);
    const rendered: React.ReactNode[] = [];

    for (let i = visibleCards.length - 1; i >= 0; i -= 1) {
      const profile = visibleCards[i];
      const isTopCard = i === 0;

      const cardStyle = [
        styles.card,
        !isTopCard && styles.nextCard,
        isTopCard && {
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
          opacity: 1
        },
        !isTopCard && { transform: [{ scale: 0.96 }, { translateY: NEXT_CARD_OFFSET }] },
      ];

      const handlers = isTopCard ? panResponder.panHandlers : undefined;

      rendered.push(
        <Animated.View
          key={profile.id}
          style={cardStyle}
          pointerEvents={isTopCard ? 'auto' : 'none'}
          {...handlers}
        >
          <SwipeCard
            profile={profile}
            likeOpacity={isTopCard ? likeOpacity : undefined}
            nopeOpacity={isTopCard ? nopeOpacity : undefined}
          />
        </Animated.View>,
      );
    }

    return rendered;
  };

  return <View style={styles.container}>{renderCards()}</View>;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    backgroundColor: '#fff',
  },
  nextCard: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    opacity: 0.2
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1.2,
    borderColor: '#d1d1d1',
    backgroundColor: '#f7f7f7',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
});
