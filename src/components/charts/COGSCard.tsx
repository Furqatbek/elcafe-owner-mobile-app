import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { COGSData } from '../../types/api.types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Card from '../common/Card';
import { useTranslation } from '../../hooks/useTranslation';

interface COGSCardProps {
  data?: COGSData | null;
  title?: string;
}

const defaultData: COGSData = {
  totalCOGS: 0,
  totalRevenue: 0,
  foodCostPercentage: 0,
  grossProfitMargin: 0,
  grossProfit: 0,
};

export const COGSCard: React.FC<COGSCardProps> = ({
  data,
  title,
}) => {
  const { t } = useTranslation();
  const safeData = data ?? defaultData;
  const foodCostPercentage = safeData.foodCostPercentage ?? 0;
  const grossProfitMargin = safeData.grossProfitMargin ?? 0;

  const metrics = [
    {
      label: t('cogs.foodCost'),
      value: formatPercentage(foodCostPercentage),
      icon: 'shopping-cart' as const,
      color: foodCostPercentage > 35 ? colors.danger : colors.success,
    },
    {
      label: t('cogs.grossProfit'),
      value: formatCurrency(safeData.grossProfit),
      icon: 'dollar-sign' as const,
      color: colors.success,
    },
    {
      label: t('cogs.grossMargin'),
      value: formatPercentage(grossProfitMargin),
      icon: 'percent' as const,
      color: grossProfitMargin > 60 ? colors.success : colors.warning,
    },
  ];

  return (
    <Card title={title ?? t('analytics.costAnalysis')}>
      <View style={styles.metricsRow}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metricItem}>
            <View style={[styles.iconContainer, { backgroundColor: `${metric.color}15` }]}>
              <Feather name={metric.icon} size={16} color={metric.color} />
            </View>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={[styles.metricValue, { color: metric.color }]}>
              {metric.value}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.totalRow}>
        <View style={styles.totalItem}>
          <Text style={styles.totalLabel}>{t('reports.totalRevenue')}</Text>
          <Text style={styles.totalValue}>{formatCurrency(safeData.totalRevenue)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.totalItem}>
          <Text style={styles.totalLabel}>{t('cogs.totalCogs')}</Text>
          <Text style={[styles.totalValue, { color: colors.danger }]}>
            {formatCurrency(safeData.totalCOGS)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  totalItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  totalLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default COGSCard;
