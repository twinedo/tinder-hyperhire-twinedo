import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StatusPillProps = {
  label: string;
};

export const StatusPill: React.FC<StatusPillProps> = ({ label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: '#dff3e3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    color: '#1f734a',
    fontWeight: '600',
  },
});
