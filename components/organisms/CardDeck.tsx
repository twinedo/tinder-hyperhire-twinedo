import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';

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
  disableSwipes?: boolean;
  emptyLabel?: string;
  showBadges?: boolean;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.73;
const NEXT_CARD_OFFSET = 28;
const STACK_SCALE = 4;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const CardDeck = forwardRef<CardDeckRef, CardDeckProps>(({
  profiles,
  onSwipe,
  onIndexChange,
  loop = false,
  disableSwipes = false,
  emptyLabel = 'You are all caught up',
  showBadges = true,
}, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<Swiper<Profile>>(null);
  const swipeX = useRef(new Animated.Value(0)).current;
  const historyRef = useRef<{ profile: Profile; direction: SwipeDirection; index: number }[]>([]);
  const deckKey = useMemo(() => profiles.map((profile) => profile.id).join('-'), [profiles]);
  const setLikeProgress = useSwipeFeedbackStore((state) => state.setLikeProgress);
  const setNopeProgress = useSwipeFeedbackStore((state) => state.setNopeProgress);
  const resetSwipeFeedback = useSwipeFeedbackStore((state) => state.reset);

  const likeOpacity = useMemo(
    () => swipeX.interpolate({
      inputRange: [0, SWIPE_THRESHOLD],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    [swipeX],
  );

  const nopeOpacity = useMemo(
    () => swipeX.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
    [swipeX],
  );

  const resetFeedback = useCallback(() => {
    swipeX.setValue(0);
    resetSwipeFeedback();
  }, [resetSwipeFeedback, swipeX]);

  useEffect(() => {
    setCurrentIndex(0);
    historyRef.current = [];
    resetFeedback();
    onIndexChange?.(0);
    return resetFeedback;
  }, [onIndexChange, profiles, resetFeedback]);

  const handleSwiping = useCallback(
    (x: number) => {
      swipeX.setValue(x);
      const likeProgress = clamp01(x / SWIPE_THRESHOLD);
      const nopeProgress = clamp01(-x / SWIPE_THRESHOLD);
      setLikeProgress(likeProgress);
      setNopeProgress(nopeProgress);
    },
    [setLikeProgress, setNopeProgress, swipeX],
  );

  const handleSwipeComplete = useCallback(
    (cardIndex: number, direction: SwipeDirection) => {
      const totalProfiles = profiles.length;
      if (totalProfiles === 0) return;

      const swipedProfile = profiles[cardIndex];
      if (!swipedProfile) return;

      historyRef.current.push({ profile: swipedProfile, direction, index: cardIndex });
      onSwipe?.(swipedProfile, direction);

      const nextIndex = loop
        ? (cardIndex + 1) % totalProfiles
        : Math.min(cardIndex + 1, totalProfiles);

      setCurrentIndex(nextIndex);
      onIndexChange?.(nextIndex);
      resetFeedback();
    },
    [loop, onIndexChange, onSwipe, profiles, resetFeedback],
  );

  const triggerSwipe = useCallback(
    (direction: SwipeDirection) => {
      const hasCards = profiles.length > 0 && (loop || currentIndex < profiles.length);
      if (!hasCards || disableSwipes) return;
      const target = direction === 'right' ? SWIPE_THRESHOLD : -SWIPE_THRESHOLD;
      handleSwiping(target);
      if (direction === 'right') {
        swiperRef.current?.swipeRight();
      } else {
        swiperRef.current?.swipeLeft();
      }
    },
    [currentIndex, disableSwipes, handleSwiping, loop, profiles.length],
  );

  useImperativeHandle(ref, () => ({
    swipeLeft: () => triggerSwipe('left'),
    swipeRight: () => triggerSwipe('right'),
    rewind: () => {
      const last = historyRef.current.pop();
      if (!last) return null;

      const targetIndex = last.index;
      if (targetIndex < 0 || targetIndex >= profiles.length) {
        historyRef.current.push(last);
        return null;
      }

      swiperRef.current?.jumpToCardIndex(targetIndex);
      setCurrentIndex(targetIndex);
      onIndexChange?.(targetIndex);
      resetFeedback();

      return { profile: last.profile, direction: last.direction };
    },
  }));

  const hasCards = profiles.length > 0 && (loop || currentIndex < profiles.length);

  const renderCard = useCallback(
    (profile: Profile | undefined, cardIndex: number) => {
      if (!profile) return null;
      const topIndex = profiles.length ? currentIndex % profiles.length : -1;
      const isTopCard = topIndex === cardIndex;

      return (
        <View style={[styles.cardContent, !isTopCard && styles.nextCard]}>
          <SwipeCard
            profile={profile}
            likeOpacity={isTopCard ? likeOpacity : undefined}
            nopeOpacity={isTopCard ? nopeOpacity : undefined}
            showBadges={showBadges}
          />
        </View>
      );
    },
    [currentIndex, likeOpacity, nopeOpacity, profiles.length, showBadges],
  );

  return (
    <View style={styles.container}>
      {hasCards && (
        <Swiper
          key={deckKey}
          ref={swiperRef}
          cards={profiles}
          cardIndex={currentIndex % profiles.length}
          renderCard={renderCard}
          backgroundColor="transparent"
          cardHorizontalMargin={0}
          cardVerticalMargin={0}
          stackSize={2}
          stackScale={STACK_SCALE}
          stackSeparation={NEXT_CARD_OFFSET}
          horizontalThreshold={SWIPE_THRESHOLD}
          horizontalSwipe={!disableSwipes}
          disableLeftSwipe={disableSwipes}
          disableRightSwipe={disableSwipes}
          verticalSwipe={false}
          outputRotationRange={['-12deg', '0deg', '12deg']}
          disableBottomSwipe
          disableTopSwipe
          animateOverlayLabelsOpacity={false}
          animateCardOpacity={false}
          onSwiping={handleSwiping}
          onSwipedLeft={(index) => handleSwipeComplete(index, 'left')}
          onSwipedRight={(index) => handleSwipeComplete(index, 'right')}
          onSwipedAll={() => {
            if (loop) return;
            setCurrentIndex(profiles.length);
            onIndexChange?.(profiles.length);
            resetFeedback();
          }}
          onSwipedAborted={resetFeedback}
          swipeBackCard
          infinite={loop}
          containerStyle={styles.swiperContainer}
          cardStyle={styles.card}
        />
      )}
      {!hasCards && (
        <View style={[styles.card, styles.emptyCard]}>
          <Text style={styles.emptyText}>{emptyLabel}</Text>
        </View>
      )}
    </View>
  );
});

CardDeck.displayName = 'CardDeck';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  swiperContainer: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: CARD_HEIGHT,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    backgroundColor: '#fff',
    borderRadius: 24
  },
  cardContent: {
    flex: 1,
  },
  nextCard: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    opacity: 0.2,
  },
  emptyCard: {
    top: 0,
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
