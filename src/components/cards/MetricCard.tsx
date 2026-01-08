import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';

interface MetricCardProps {
  title: string;
  value: string;
  icon?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  iconColor = colors.primary,
  backgroundColor = colors.white,
  style,
  trend,
}) => {
  return (
    <View style={[styles.card, { backgroundColor }, style]}>
      <View style={styles.header}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
            <Feather name={icon} size={16} color={iconColor} />
          </View>
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      {trend && (
        <View style={styles.trendContainer}>
          <Feather
            name={trend.value >= 0 ? 'trending-up' : 'trending-down'}
            size={12}
            color={trend.isPositive ?? trend.value >= 0 ? colors.success : colors.danger}
          />
          <Text
            style={[
              styles.trendText,
              { color: trend.isPositive ?? trend.value >= 0 ? colors.success : colors.danger },
            ]}
          >
            {Math.abs(trend.value).toFixed(1)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    minWidth: 140,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default MetricCard;
