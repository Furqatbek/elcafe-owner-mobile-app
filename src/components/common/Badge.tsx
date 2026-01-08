import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../utils/colors';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: `${colors.success}15`, text: colors.success },
  danger: { bg: `${colors.danger}15`, text: colors.danger },
  warning: { bg: `${colors.warning}15`, text: colors.warning },
  info: { bg: `${colors.primary}15`, text: colors.primary },
  neutral: { bg: colors.background, text: colors.textSecondary },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'medium',
  style,
}) => {
  const variantStyle = variantStyles[variant];
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantStyle.bg,
          paddingHorizontal: isSmall ? 8 : 12,
          paddingVertical: isSmall ? 4 : 6,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: variantStyle.text,
            fontSize: isSmall ? 11 : 12,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export const NotificationBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count <= 0) return null;

  return (
    <View style={styles.notificationBadge}>
      <Text style={styles.notificationText}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default Badge;
