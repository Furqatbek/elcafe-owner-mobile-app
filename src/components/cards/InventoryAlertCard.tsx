import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { InventoryAlerts } from '../../types/api.types';
import Card from '../common/Card';

interface InventoryAlertCardProps {
  alerts?: InventoryAlerts | null;
  onPress?: () => void;
}

const defaultAlerts: InventoryAlerts = {
  lowStockCount: 0,
  reorderCount: 0,
};

export const InventoryAlertCard: React.FC<InventoryAlertCardProps> = ({
  alerts,
  onPress,
}) => {
  const safeAlerts = alerts ?? defaultAlerts;
  const hasAlerts = (safeAlerts.lowStockCount ?? 0) > 0 || (safeAlerts.reorderCount ?? 0) > 0;

  if (!hasAlerts) {
    return (
      <Card>
        <View style={styles.healthyContainer}>
          <View style={styles.healthyIcon}>
            <Feather name="check-circle" size={24} color={colors.success} />
          </View>
          <Text style={styles.healthyTitle}>Inventory Healthy</Text>
          <Text style={styles.healthySubtitle}>All stock levels are normal</Text>
        </View>
      </Card>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
        <View style={styles.alertContainer}>
          <View style={styles.alertIcon}>
            <Feather name="alert-triangle" size={20} color={colors.warning} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Inventory Alerts</Text>
            <View style={styles.alertStats}>
              {(safeAlerts.lowStockCount ?? 0) > 0 && (
                <View style={styles.alertBadge}>
                  <View style={[styles.alertDot, { backgroundColor: colors.danger }]} />
                  <Text style={styles.alertBadgeText}>
                    {safeAlerts.lowStockCount} Low Stock
                  </Text>
                </View>
              )}
              {(safeAlerts.reorderCount ?? 0) > 0 && (
                <View style={styles.alertBadge}>
                  <View style={[styles.alertDot, { backgroundColor: colors.warning }]} />
                  <Text style={styles.alertBadgeText}>
                    {safeAlerts.reorderCount} Reorder
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </View>
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
  alertContainer: {
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
});

export default InventoryAlertCard;
