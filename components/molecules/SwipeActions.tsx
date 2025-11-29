import React from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/atoms/IconButton';

type SwipeActionsProps = {
  onNope: () => void;
  onLike: () => void;
  disabled?: boolean;
  onRewind?: () => void;
};

export const SwipeActions: React.FC<SwipeActionsProps> = ({ onNope, onLike, onRewind, disabled }) => {
  return (
    <View style={styles.container}>
      <IconButton
        name="undo"
        backgroundColor="#ffffff"
        color="#b9bec4"
        onPress={onRewind}
        disabled={disabled}
        style={{width: 60, height: 60, position: 'absolute', left: 20}}
        size={40}
      />
      <IconButton
        name="close"
        backgroundColor="#ffffff"
        color="#ff3b62"
        onPress={onNope}
        disabled={disabled}
      />
      <IconButton
        name="heart"
        backgroundColor="#ffffff"
        color="#1fc773"
        onPress={onLike}
        disabled={disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    paddingVertical: 20,
  },
  likeButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
