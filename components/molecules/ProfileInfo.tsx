import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StatusPill } from '@/components/atoms/StatusPill';
import { Profile } from '@/types/profile';

type ProfileInfoProps = {
  profile: Profile;
};

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  return (
    <View style={styles.container}>
      {profile.status ? <StatusPill label={profile.status} /> : null}
      <Text style={styles.name}>
        {profile.name}{' '}
        <Text style={styles.age}>
          {profile.age}
        </Text>
      </Text>
      <View style={styles.metaRow}>
        <MaterialCommunityIcons name="map-marker" size={18} color="#f6f6f6" />
        <Text style={styles.metaText}>{profile.distanceLabel}</Text>
      </View>
      {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginBottom: 4
  },
  name: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
  },
  age: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '400',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#f6f6f6',
    fontSize: 15,
    fontWeight: '500',
  },
  bio: {
    color: '#f1f1f1',
    fontSize: 14,
    lineHeight: 20,
  },
});
