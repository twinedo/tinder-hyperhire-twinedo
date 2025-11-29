import { Fontisto } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardDeck, CardDeckRef } from '@/components/organisms/CardDeck';
import { useLikesStore } from '@/stores/likesStore';

export default function LikeScreen() {
  const deckRef = useRef<CardDeckRef>(null);
  const likes = useLikesStore((state) => state.likes);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Fontisto name="tinder" size={30} color="#ff5864" />
        <Text style={styles.logo}>tinder</Text>
      </View>

      <View style={styles.deckWrapper}>
        <View style={styles.progressRow}>
          {likes.map((profile, index) => (
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
          profiles={likes}
          onIndexChange={setCurrentIndex}
          loop
          showBadges={false}
          emptyLabel="No likes yet"
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
    gap: 8,
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
  deckWrapper: {
    flex: 1,
    marginTop: 10,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    color: '#777',
    fontSize: 15,
    textAlign: 'center',
  },
});
