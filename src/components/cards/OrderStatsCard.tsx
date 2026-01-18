import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { OrderStats } from '../../types/api.types';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import { useTranslation } from '../../hooks/useTranslation';

interface OrderStatsCardProps {
  stats?: OrderStats | null;
}

const defaultStats: OrderStats = {
  totalOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  averageOrderValue: 0,
  totalItemsSold: 0,
};

export const OrderStatsCard: React.FC<OrderStatsCardProps> = ({ stats }) => {
  const { t } = useTranslation();
  const data = stats ?? defaultStats;

  const items = [
    {
      label: t('orderStats.totalOrders'),
      value: formatNumber(data.totalOrders),
      icon: 'shopping-bag' as const,
      color: colors.primary,
    },
    {
      label: t('orderStats.avgOrderValue'),
      value: formatCurrency(data.averageOrderValue),
      icon: 'dollar-sign' as const,
      color: colors.success,
    },
    {
      label: t('orderStats.itemsSold'),
      value: formatNumber(data.totalItemsSold),
      icon: 'package' as const,
      color: '#8B5CF6',
    },
    {
      label: t('orderStats.completed'),
      value: formatNumber(data.completedOrders),
      icon: 'check-circle' as const,
      color: colors.success,
    },
    {
      label: t('orderStats.cancelled'),
      value: formatNumber(data.cancelledOrders),
      icon: 'x-circle' as const,
      color: colors.danger,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('orderStats.title')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.card,
              index === items.length - 1 && { marginRight: 0 },
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
              <Feather name={item.icon} size={18} color={item.color} />
            </View>
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.label} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginRight: 10,
    minWidth: 110,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default OrderStatsCard;
