import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

type IconButtonProps = {
  name: keyof typeof FontAwesome.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  size = 45,
  color = '#222',
  backgroundColor = '#fff',
  onPress,
  disabled,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor, opacity: disabled ? 0.45 : pressed ? 0.78 : 1 },
        style,
      ]}
    >
      <FontAwesome name={name} size={size} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
