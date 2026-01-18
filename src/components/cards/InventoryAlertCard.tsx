import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { InventoryAlerts } from '../../types/api.types';
import Card from '../common/Card';
import { useTranslation } from '../../hooks/useTranslation';

interface InventoryAlertCardProps {
  alerts?: InventoryAlerts | null;
  onPress?: () => void;
}

const defaultAlerts: InventoryAlerts = {
  lowStockCount: 0,
  reorderCount: 0,
  expiringCount: 0,
  lowStockItems: [],
};

export const InventoryAlertCard: React.FC<InventoryAlertCardProps> = ({
  alerts,
  onPress,
}) => {
  const { t } = useTranslation();
  const safeAlerts = alerts ?? defaultAlerts;
  const lowStockItems = safeAlerts.lowStockItems ?? [];
  const hasAlerts = (safeAlerts.lowStockCount ?? 0) > 0 || (safeAlerts.reorderCount ?? 0) > 0;

  if (!hasAlerts) {
    return (
      <Card>
        <View style={styles.healthyContainer}>
          <View style={styles.healthyIcon}>
            <Feather name="check-circle" size={24} color={colors.success} />
          </View>
          <Text style={styles.healthyTitle}>{t('inventory.healthyInventory')}</Text>
          <Text style={styles.healthySubtitle}>{t('inventory.noAlerts')}</Text>
        </View>
      </Card>
    );
  }

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return colors.danger;
      case 'LOW':
        return colors.warning;
      case 'REORDER':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
        <View style={styles.alertHeader}>
          <View style={styles.alertIcon}>
            <Feather name="alert-triangle" size={20} color={colors.warning} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>{t('home.inventoryAlerts')}</Text>
            <View style={styles.alertStats}>
              {(safeAlerts.lowStockCount ?? 0) > 0 && (
                <View style={styles.alertBadge}>
                  <View style={[styles.alertDot, { backgroundColor: colors.danger }]} />
                  <Text style={styles.alertBadgeText}>
                    {safeAlerts.lowStockCount} {t('inventory.lowStock')}
                  </Text>
                </View>
              )}
              {(safeAlerts.reorderCount ?? 0) > 0 && (
                <View style={styles.alertBadge}>
                  <View style={[styles.alertDot, { backgroundColor: colors.warning }]} />
                  <Text style={styles.alertBadgeText}>
                    {safeAlerts.reorderCount} {t('inventory.reorder')}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </View>

        {/* Show first 3 low stock items */}
        {lowStockItems.length > 0 && (
          <View style={styles.itemsList}>
            {lowStockItems.slice(0, 3).map((item, index) => (
              <View
                key={item.ingredientId}
                style={[
                  styles.itemRow,
                  index < Math.min(lowStockItems.length, 3) - 1 && styles.itemBorder,
                ]}
              >
                <View style={[styles.levelDot, { backgroundColor: getAlertColor(item.alertLevel) }]} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.ingredientName}
                  </Text>
                  <Text style={styles.itemStock}>
                    {item.currentStock} / {item.minimumStock} {item.unit}
                  </Text>
                </View>
                <View style={[styles.levelBadge, { backgroundColor: `${getAlertColor(item.alertLevel)}15` }]}>
                  <Text style={[styles.levelText, { color: getAlertColor(item.alertLevel) }]}>
                    {item.alertLevel}
                  </Text>
                </View>
              </View>
            ))}
            {lowStockItems.length > 3 && (
              <Text style={styles.moreText}>
                {t('format.moreItems', { count: lowStockItems.length - 3 })}
              </Text>
            )}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  healthyContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  healthyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.success}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  healthyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.success,
    marginBottom: 4,
  },
  healthySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${colors.warning}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  alertStats: {
    flexDirection: 'row',
    gap: 12,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  alertBadgeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  itemsList: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  itemStock: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '600',
  },
  moreText: {
    fontSize: 12,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default InventoryAlertCard;
