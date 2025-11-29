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
import { useSwipeFeedbackStore } from '@/stores/swipeFeedbackStore';
import { Profile } from '@/types/profile';

export type SwipeDirection = 'left' | 'right';

export type CardDeckRef = {
  swipeLeft: () => void;
  swipeRight: () => void;
  rewind: () => { profile: Profile; direction: SwipeDirection } | null;
};

type CardDeckProps = {
  profiles: Profile[];
  onSwipe?: (profile: Profile, direction: SwipeDirection) => void;
  onIndexChange?: (nextIndex: number) => void;
  loop?: boolean;
  emptyLabel?: string;
  showBadges?: boolean;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.73;
const NEXT_CARD_OFFSET = 28;

export const CardDeck = forwardRef<CardDeckRef, CardDeckProps>(({
  profiles,
  onSwipe,
  onIndexChange,
  loop = false,
  emptyLabel = 'You are all caught up',
  showBadges = true,
}, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const indexRef = useRef(currentIndex);
  const isAnimatingRef = useRef(false);
  const historyRef = useRef<{ profile: Profile; direction: SwipeDirection; index: number }[]>([]);
  const setLikeProgress = useSwipeFeedbackStore((state) => state.setLikeProgress);
  const setNopeProgress = useSwipeFeedbackStore((state) => state.setNopeProgress);
  const resetSwipeFeedback = useSwipeFeedbackStore((state) => state.reset);

  useEffect(() => {
    setCurrentIndex(0);
    pan.setValue({ x: 0, y: 0 });
    indexRef.current = 0;
    isAnimatingRef.current = false;
    historyRef.current = [];
    resetSwipeFeedback();
  }, [profiles, pan, resetSwipeFeedback]);

  useEffect(() => {
    const listenerId = pan.x.addListener(({ value }) => {
      const likeProgress = Math.max(0, Math.min(1, value / SWIPE_THRESHOLD));
      const nopeProgress = Math.max(0, Math.min(1, -value / SWIPE_THRESHOLD));
      setLikeProgress(likeProgress);
      setNopeProgress(nopeProgress);
    });

    return () => {
      pan.x.removeListener(listenerId);
      resetSwipeFeedback();
    };
  }, [pan, resetSwipeFeedback, setLikeProgress, setNopeProgress]);

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
        historyRef.current.push({ profile: swipedProfile, direction, index: indexRef.current });
        onSwipe?.(swipedProfile, direction);
      }
      setCurrentIndex((prev) => {
        if (loop && profiles.length > 0) {
          return (prev + 1) % profiles.length;
        }
        return prev + 1;
      });
    },
    [loop, onSwipe, pan, profiles],
  );

  const triggerSwipe = useCallback(
    (direction: SwipeDirection) => {
      const hasCards = profiles.length > 0 && (loop || indexRef.current < profiles.length);
      if (isAnimatingRef.current || !hasCards) return;
      isAnimatingRef.current = true;
      const xTarget = direction === 'right' ? SCREEN_WIDTH * 1.2 : -SCREEN_WIDTH * 1.2;
      Animated.timing(pan, {
        toValue: { x: xTarget, y: 0 },
        duration: 200,
        useNativeDriver: true,
      }).start(() => handleSwipeComplete(direction));
    },
    [handleSwipeComplete, loop, pan, profiles.length],
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
        onMoveShouldSetPanResponder: (_, gesture) => {
          const hasCards = profiles.length > 0 && (loop || indexRef.current < profiles.length);
          return (
            !isAnimatingRef.current &&
            hasCards &&
            (Math.abs(gesture.dx) > 6 || Math.abs(gesture.dy) > 6)
          );
        },
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
    [loop, pan, profiles.length, resetPosition, triggerSwipe],
  );

  useImperativeHandle(ref, () => ({
    swipeLeft: () => triggerSwipe('left'),
    swipeRight: () => triggerSwipe('right'),
    rewind: () => {
      if (isAnimatingRef.current) return null;
      const last = historyRef.current.pop();
      if (!last) return null;
      pan.setValue({ x: 0, y: 0 });
      indexRef.current = last.index;
      isAnimatingRef.current = false;
      resetSwipeFeedback();
      setCurrentIndex(last.index);
      return { profile: last.profile, direction: last.direction };
    },
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
    if (profiles.length === 0 || (!loop && currentIndex >= profiles.length)) {
      return (
        <View style={[styles.card, styles.emptyCard]}>
          <Animated.Text style={styles.emptyText}>{emptyLabel}</Animated.Text>
        </View>
      );
    }

    const topIndex = loop ? currentIndex % profiles.length : currentIndex;
    const nextIndex = loop ? (topIndex + 1) % profiles.length : topIndex + 1;
    const hasNext = profiles.length > 1 && (loop || nextIndex < profiles.length);

    const visibleCards = hasNext
      ? [profiles[topIndex], profiles[nextIndex]]
      : [profiles[topIndex]];
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
            showBadges={showBadges}
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
