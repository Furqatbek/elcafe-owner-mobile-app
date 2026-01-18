import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { SoldItem } from '../../types/api.types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Card from '../common/Card';
import { useTranslation } from '../../hooks/useTranslation';

const MAX_ITEMS = 5;

interface TopSellingItemsCardProps {
  items?: SoldItem[] | null;
  onShowMore?: () => void;
}

export const TopSellingItemsCard: React.FC<TopSellingItemsCardProps> = ({
  items,
  onShowMore,
}) => {
  const { t } = useTranslation();
  const safeItems = items ?? [];

  if (safeItems.length === 0) {
    return (
      <Card title={t('analytics.soldItems')}>
        <Text style={styles.emptyText}>{t('common.noData')}</Text>
      </Card>
    );
  }

  const displayItems = safeItems.slice(0, MAX_ITEMS);
  const hasMore = safeItems.length > MAX_ITEMS;
  const cardTitle = t('analytics.soldItemsCount', { count: safeItems.length });

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
    <Card title={cardTitle}>
      {displayItems.map((item, index) => (
        <View
          key={item.productName}
          style={[
            styles.itemRow,
            index < displayItems.length - 1 && styles.itemBorder,
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
                {t('format.sold', { count: item.quantitySold })}
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
      {hasMore && onShowMore && (
        <TouchableOpacity style={styles.showMoreButton} onPress={onShowMore}>
          <Text style={styles.showMoreText}>{t('common.showMore')}</Text>
          <Feather name="chevron-right" size={16} color={colors.primary} />
        </TouchableOpacity>
      )}
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
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default TopSellingItemsCard;
