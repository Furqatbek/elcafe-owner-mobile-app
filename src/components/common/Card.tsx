import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../utils/colors';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  style,
  titleStyle,
  padding = 'medium',
}) => {
  const paddingValue = {
    none: 0,
    small: 8,
    medium: 16,
    large: 24,
  }[padding];

  return (
    <View style={[styles.card, { padding: paddingValue }, style]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
});

export default Card;
