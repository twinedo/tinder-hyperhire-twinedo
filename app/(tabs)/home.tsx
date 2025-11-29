import { Fontisto } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SwipeActions } from '@/components/molecules/SwipeActions';
import { CardDeck, CardDeckRef, SwipeDirection } from '@/components/organisms/CardDeck';
import { useLikesStore } from '@/stores/likesStore';
import { Profile } from '@/types/profile';

const PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Esther',
    age: 30,
    status: 'Online now',
    distanceLabel: '24 km away',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80',
    bio: 'Runner, coffee nerd, forever curious.',
  },
  {
    id: '2',
    name: 'Nadia',
    age: 28,
    status: 'Recently active',
    distanceLabel: '5 km away',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=1000&q=80',
    bio: 'Traveler and designer. Let’s compare playlists.',
  },
  {
    id: '3',
    name: 'Leah',
    age: 29,
    status: 'Online now',
    distanceLabel: '12 km away',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
    bio: 'Weekend hiker, mid-week foodie.',
  },
  {
    id: '4',
    name: 'Jisoo',
    age: 27,
    status: 'Online now',
    distanceLabel: '2 km away',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=80',
    bio: 'Cat mom. Building a photo zine.',
  },
  {
    id: '5',
    name: 'Harper',
    age: 26,
    status: 'Recently active',
    distanceLabel: '8 km away',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80',
    bio: 'Sourdough baker and museum hopper.',
  },
  {
    id: '6',
    name: 'Maya',
    age: 31,
    status: 'Online now',
    distanceLabel: '15 km away',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=1000&q=80',
    bio: 'Yoga at sunrise, live music at night.',
  },
];

export default function HomeScreen() {
  const deckRef = useRef<CardDeckRef>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const addLike = useLikesStore((state) => state.addLike);

  const handleSwipe = (profile: Profile, direction: SwipeDirection) => {
    if (direction === 'right') {
      addLike(profile);
    }
  };

  const hasCards = currentIndex < PROFILES.length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Fontisto name="tinder" size={30} color="#ff5864" />
        <Text style={styles.logo}>tinder</Text>
      </View>

      <View style={styles.deckWrapper}>
        <View style={styles.progressRow}>
          {PROFILES.map((profile, index) => (
            <View
              key={profile.id}
              style={[
                styles.progressBar,
                index < currentIndex && styles.progressDone,
                index === currentIndex && styles.progressActive,
              ]}
            />
          ))}
        </View>
        <CardDeck
          ref={deckRef}
          profiles={PROFILES}
          onSwipe={handleSwipe}
          onIndexChange={setCurrentIndex}
        />
        <SwipeActions
          disabled={!hasCards}
          onNope={() => deckRef.current?.swipeLeft()}
          onLike={() => deckRef.current?.swipeRight()}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f7f7f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ff5864',
    letterSpacing: 0.4,
  },
  progressRow: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#dedede',
  },
  progressActive: {
    backgroundColor: '#ff5864',
  },
  progressDone: {
    backgroundColor: '#ffc2c8',
  },
  subhead: {
    color: '#666',
    fontSize: 14,
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  deckWrapper: {
    flex: 1,
    marginTop: 10,
  },
  actionText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '600',
    marginBottom: 10,
  },
});
