import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { DashboardComparison, TrendDirection } from '../../types/api.types';
import Card from '../common/Card';

interface TrendCardProps {
  comparison?: DashboardComparison | null;
}

const defaultComparison: DashboardComparison = {
  incomeChange: 0,
  expenseChange: 0,
  profitChange: 0,
  orderCountChange: 0,
  trend: 'STABLE',
};

export const TrendCard: React.FC<TrendCardProps> = ({ comparison }) => {
  const data = comparison ?? defaultComparison;

  const getTrendIcon = (trend: TrendDirection): keyof typeof Feather.glyphMap => {
    switch (trend) {
      case 'UP':
        return 'trending-up';
      case 'DOWN':
        return 'trending-down';
      default:
        return 'minus';
    }
  };

  const getTrendColor = (trend: TrendDirection): string => {
    switch (trend) {
      case 'UP':
        return colors.success;
      case 'DOWN':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const trendColor = getTrendColor(data.trend);

  const metrics = [
    { label: 'Income', value: data.incomeChange ?? 0, positive: true },
    { label: 'Expenses', value: data.expenseChange ?? 0, positive: false },
    { label: 'Profit', value: data.profitChange ?? 0, positive: true },
    { label: 'Orders', value: data.orderCountChange ?? 0, positive: true },
  ];

  return (
    <Card padding="medium">
      <View style={styles.header}>
        <View style={[styles.trendBadge, { backgroundColor: `${trendColor}15` }]}>
          <Feather name={getTrendIcon(data.trend)} size={18} color={trendColor} />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {data.trend === 'STABLE' ? 'Stable' : `${data.trend === 'UP' ? 'Up' : 'Down'} vs Yesterday`}
          </Text>
        </View>
      </View>
      <View style={styles.metricsRow}>
        {metrics.map((metric) => {
          const isPositive = metric.positive ? metric.value >= 0 : metric.value <= 0;
          const color = isPositive ? colors.success : colors.danger;

          return (
            <View key={metric.label} style={styles.metricItem}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <View style={styles.metricValueRow}>
                <Feather
                  name={metric.value >= 0 ? 'arrow-up' : 'arrow-down'}
                  size={12}
                  color={color}
                />
                <Text style={[styles.metricValue, { color }]}>
                  {Math.abs(metric.value).toFixed(1)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default TrendCard;
