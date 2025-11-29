import React, { memo, useMemo } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native';

import { ProfileInfo } from '@/components/molecules/ProfileInfo';
import { Profile } from '@/types/profile';
import { LinearGradient } from 'expo-linear-gradient';

type SwipeCardProps = {
  profile: Profile;
  likeOpacity?: Animated.AnimatedInterpolation<string | number>;
  nopeOpacity?: Animated.AnimatedInterpolation<string | number>;
};

const SwipeCardComponent: React.FC<SwipeCardProps> = ({ profile, likeOpacity, nopeOpacity }) => {
  const imageSource = useMemo(() => ({ uri: profile.image }), [profile.image]);

  return (
    <ImageBackground
      source={imageSource}
      fadeDuration={0}
      style={styles.image}
      imageStyle={styles.imageBorder}
    >
      <View style={styles.overlay} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.gradient}
        pointerEvents="none"
      />
      <View style={styles.infoContainer}>
        <ProfileInfo profile={profile} />
      </View>
      <Animated.View pointerEvents="none" style={[styles.badge, styles.likeBadge, { opacity: likeOpacity ?? 0, transform: [{rotateX: '-45deg'}, {rotateZ: '-45deg'}] }]}>
        <Text style={styles.badgeText}>LIKE</Text>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.badge, styles.nopeBadge, { opacity: nopeOpacity ?? 0, transform: [{rotateX: '45deg'}, {rotateZ: '45deg'}] }]}>
        <Text style={styles.badgeText}>NOPE</Text>
      </Animated.View>
    </ImageBackground>
  );
};

export const SwipeCard = memo(SwipeCardComponent);

const styles = StyleSheet.create({
  image: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#101010',
  },
  imageBorder: {
    borderRadius: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  badge: {
    position: 'absolute',
    top: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 3,
    zIndex: 10
  },
  badgeText: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#fff',
  },
  likeBadge: {
    left: 18,
    borderColor: '#2dd188',
    backgroundColor: 'rgba(45, 209, 136, 0.12)',
  },
  nopeBadge: {
    right: 18,
    borderColor: '#ff3b62',
    backgroundColor: 'rgba(255, 59, 98, 0.12)',
  },
});
