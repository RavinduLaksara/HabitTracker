'use client';

import type React from 'react';
import {
  TouchableOpacity,
  Text,
  type ViewStyle,
  type TextStyle,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../styles/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    };

    const sizeStyles = {
      small: {paddingVertical: 8, paddingHorizontal: 16, minHeight: 36},
      medium: {paddingVertical: 12, paddingHorizontal: 24, minHeight: 44},
      large: {paddingVertical: 16, paddingHorizontal: 32, minHeight: 52},
    };

    const variantStyles = {
      primary: {backgroundColor: colors.primary},
      secondary: {backgroundColor: colors.secondary},
      success: {backgroundColor: colors.success},
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
        shadowOpacity: 0.1,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled || loading ? 0.6 : 1,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles = {
      small: {fontSize: 14},
      medium: {fontSize: 16},
      large: {fontSize: 18},
    };

    const variantStyles = {
      primary: {color: colors.surface},
      secondary: {color: colors.surface},
      success: {color: colors.surface},
      outline: {color: colors.primary},
    };

    return {
      fontWeight: '600',
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.surface}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
