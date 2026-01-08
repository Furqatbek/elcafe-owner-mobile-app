import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Card from '../common/Card';

interface FinancialSummaryCardProps {
  totalIncome?: number | null;
  totalExpenses?: number | null;
  netProfit?: number | null;
  profitMargin?: number | null;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  totalIncome,
  totalExpenses,
  netProfit,
  profitMargin,
}) => {
  const metrics = [
    {
      label: 'Revenue',
      value: formatCurrency(totalIncome),
      icon: 'dollar-sign' as const,
      color: colors.success,
    },
    {
      label: 'Expenses',
      value: formatCurrency(totalExpenses),
      icon: 'minus-circle' as const,
      color: colors.danger,
    },
    {
      label: 'Net Profit',
      value: formatCurrency(netProfit),
      icon: 'trending-up' as const,
      color: colors.primary,
    },
    {
      label: 'Margin',
      value: formatPercentage(profitMargin),
      icon: 'percent' as const,
      color: '#8B5CF6',
    },
  ];

  return (
    <Card title="Financial Summary">
      <View style={styles.grid}>
        {metrics.map((metric, index) => (
          <View key={metric.label} style={styles.metricItem}>
            <View style={[styles.iconContainer, { backgroundColor: `${metric.color}15` }]}>
              <Feather name={metric.icon} size={14} color={metric.color} />
            </View>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={[styles.metricValue, { color: metric.color }]}>
              {metric.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  metricItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default FinancialSummaryCard;
