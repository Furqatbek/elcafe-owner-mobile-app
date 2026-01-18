import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { SoldItem } from '../../types/api.types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Card from '../common/Card';

interface TopSellingItemsCardProps {
  items?: SoldItem[] | null;
  limit?: number;
}

export const TopSellingItemsCard: React.FC<TopSellingItemsCardProps> = ({
  items,
  limit = 3,
}) => {
  const safeItems = items ?? [];
  const topItems = safeItems.slice(0, limit);

  if (topItems.length === 0) {
    return (
      <Card title="Top Selling Items">
        <Text style={styles.emptyText}>No sales data available</Text>
      </Card>
    );
  }

  const getMedalColor = (index: number): string => {
    switch (index) {
      case 0:
        return '#FFD700'; // Gold
      case 1:
        return '#C0C0C0'; // Silver
      case 2:
        return '#CD7F32'; // Bronze
      default:
        return colors.textSecondary;
    }
  };

  return (
    <Card title="Top Selling Items">
      {topItems.map((item, index) => (
        <View
          key={item.productName}
          style={[
            styles.itemRow,
            index < topItems.length - 1 && styles.itemBorder,
          ]}
        >
          <View style={[styles.rankBadge, { backgroundColor: `${getMedalColor(index)}20` }]}>
            <Text style={[styles.rankText, { color: getMedalColor(index) }]}>
              #{index + 1}
            </Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.productName}
            </Text>
            <View style={styles.itemMeta}>
              <Text style={styles.itemQuantity}>
                {item.quantitySold} sold
              </Text>
              {item.profitMargin != null && (
                <View style={styles.marginBadge}>
                  <Feather name="trending-up" size={10} color={colors.success} />
                  <Text style={styles.marginText}>
                    {formatPercentage(item.profitMargin)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.itemRevenue}>
            {formatCurrency(item.totalRevenue)}
          </Text>
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemQuantity: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  marginBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.success}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  marginText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.success,
  },
  itemRevenue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default TopSellingItemsCard;
