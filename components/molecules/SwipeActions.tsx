import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/atoms/IconButton';
import { useSwipeFeedbackStore } from '@/stores/swipeFeedbackStore';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const mixHexColors = (from: string, to: string, progress: number) => {
  const normalizedProgress = clamp01(progress);
  const parse = (hex: string) => {
    const sanitized = hex.replace('#', '');
    const value = sanitized.length === 3
      ? sanitized.split('').map((char) => char + char).join('')
      : sanitized;
    const intValue = parseInt(value, 16);
    return {
      r: (intValue >> 16) & 255,
      g: (intValue >> 8) & 255,
      b: intValue & 255,
    };
  };

  const format = (channel: number) => channel.toString(16).padStart(2, '0');

  const fromRgb = parse(from);
  const toRgb = parse(to);

  const r = Math.round(fromRgb.r + (toRgb.r - fromRgb.r) * normalizedProgress);
  const g = Math.round(fromRgb.g + (toRgb.g - fromRgb.g) * normalizedProgress);
  const b = Math.round(fromRgb.b + (toRgb.b - fromRgb.b) * normalizedProgress);

  return `#${format(r)}${format(g)}${format(b)}`;
};

type SwipeActionsProps = {
  onNope: () => void;
  onLike: () => void;
  disabled?: boolean;
  onRewind?: () => void;
};

export const SwipeActions: React.FC<SwipeActionsProps> = ({ onNope, onLike, onRewind, disabled }) => {
  const likeProgress = useSwipeFeedbackStore((state) => state.likeProgress);
  const nopeProgress = useSwipeFeedbackStore((state) => state.nopeProgress);

  const likeBackground = useMemo(
    () => mixHexColors('#ffffff', '#1fc773', likeProgress),
    [likeProgress],
  );
  const likeIconColor = useMemo(
    () => mixHexColors('#1fc773', '#ffffff', likeProgress),
    [likeProgress],
  );
  const nopeBackground = useMemo(
    () => mixHexColors('#ffffff', '#ff3b62', nopeProgress),
    [nopeProgress],
  );
  const nopeIconColor = useMemo(
    () => mixHexColors('#ff3b62', '#ffffff', nopeProgress),
    [nopeProgress],
  );
  const closeVisibility = useMemo(() => clamp01(1 - likeProgress), [likeProgress]);
  const heartVisibility = useMemo(() => clamp01(1 - nopeProgress), [nopeProgress]);
  const undoVisibility = useMemo(
    () => clamp01(1 - Math.max(likeProgress, nopeProgress)),
    [likeProgress, nopeProgress],
  );

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
        visibleOpacity={undoVisibility}
      />
      <IconButton
        name="close"
        backgroundColor={nopeBackground}
        color={nopeIconColor}
        onPress={onNope}
        disabled={disabled}
        visibleOpacity={closeVisibility}
      />
      <IconButton
        name="heart"
        backgroundColor={likeBackground}
        color={likeIconColor}
        onPress={onLike}
        disabled={disabled}
        visibleOpacity={heartVisibility}
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
