import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStockSummary, useInventoryTurnover } from '../hooks/useInventory';
import { LowStockItem } from '../types/api.types';
import { colors } from '../utils/colors';

type AlertLevel = 'CRITICAL' | 'LOW' | 'REORDER';

// Compute alert level based on stock ratio
const getAlertLevelFromStock = (currentStock: number, minimumStock: number): AlertLevel => {
  if (minimumStock <= 0) return 'REORDER';
  const ratio = currentStock / minimumStock;
  if (ratio <= 0.25) return 'CRITICAL';
  if (ratio <= 0.75) return 'LOW';
  return 'REORDER';
};
import { getDateDaysAgo, getCurrentDate, formatNumber } from '../utils/formatters';
import {
  Card,
  EmptyState,
  ErrorState,
  SkeletonCard,
} from '../components/common';

export const InventoryScreen: React.FC = () => {
  const dateRange = useMemo(
    () => ({
      startDate: getDateDaysAgo(30),
      endDate: getCurrentDate(),
    }),
    []
  );

  const {
    data: stockData,
    isLoading: isLoadingStock,
    isError: isErrorStock,
    refetch: refetchStock,
    isRefetching,
  } = useStockSummary();

  const {
    data: turnoverData,
    isLoading: isLoadingTurnover,
    isError: isErrorTurnover,
    refetch: refetchTurnover,
  } = useInventoryTurnover(dateRange);

  const isLoading = isLoadingStock || isLoadingTurnover;
  const hasError = isErrorStock && isErrorTurnover;

  const handleRefresh = useCallback(() => {
    refetchStock();
    refetchTurnover();
  }, [refetchStock, refetchTurnover]);

  const getAlertColor = (level: AlertLevel): string => {
    switch (level) {
      case 'CRITICAL':
        return colors.danger;
      case 'LOW':
        return colors.warning;
      case 'REORDER':
        return '#F97316';
      default:
        return colors.textSecondary;
    }
  };

  const getAlertBgColor = (level: AlertLevel): string => {
    switch (level) {
      case 'CRITICAL':
        return `${colors.danger}10`;
      case 'LOW':
        return `${colors.warning}10`;
      case 'REORDER':
        return '#F9731610';
      default:
        return colors.background;
    }
  };

  const renderStockItem = (item: LowStockItem, index: number) => {
    const alertLevel = getAlertLevelFromStock(item.currentStock, item.minimumStock);
    const alertColor = getAlertColor(alertLevel);
    const bgColor = getAlertBgColor(alertLevel);

    return (
      <View
        key={`${item.id}-${index}`}
        style={[styles.stockItem, { backgroundColor: bgColor }]}
      >
        <View style={styles.stockItemHeader}>
          <Text style={styles.stockItemName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[styles.alertBadge, { backgroundColor: alertColor }]}>
            <Text style={styles.alertBadgeText}>{alertLevel}</Text>
          </View>
        </View>
        <View style={styles.stockItemDetails}>
          <View style={styles.stockInfo}>
            <Text style={styles.stockLabel}>Current</Text>
            <Text style={[styles.stockValue, { color: alertColor }]}>
              {formatNumber(item.currentStock, 1)} {item.unit}
            </Text>
          </View>
          <View style={styles.stockDivider} />
          <View style={styles.stockInfo}>
            <Text style={styles.stockLabel}>Minimum</Text>
            <Text style={styles.stockValue}>
              {formatNumber(item.minimumStock, 1)} {item.unit}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <SkeletonCard lines={2} />
          <SkeletonCard lines={3} />
          <SkeletonCard lines={3} />
        </View>
      );
    }

    if (hasError) {
      return (
        <ErrorState
          message="Unable to load inventory data"
          onRetry={handleRefresh}
          fullScreen
        />
      );
    }

    const lowStockItems = stockData?.lowStockItems ?? [];

    // Compute alert levels for each item
    const itemsWithLevels = lowStockItems.map((item) => ({
      ...item,
      alertLevel: getAlertLevelFromStock(item.currentStock, item.minimumStock),
    }));

    const criticalItems = itemsWithLevels.filter((i) => i.alertLevel === 'CRITICAL');
    const lowItems = itemsWithLevels.filter((i) => i.alertLevel === 'LOW');
    const reorderItems = itemsWithLevels.filter((i) => i.alertLevel === 'REORDER');

    const criticalCount = criticalItems.length;
    const hasStockAlerts =
      stockData &&
      (criticalCount > 0 ||
        (stockData.lowStockCount ?? 0) > 0 ||
        (stockData.reorderCount ?? 0) > 0);

    return (
      <>
        {/* Summary Stats */}
        {stockData && (
          <View style={styles.section}>
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: `${colors.danger}10` }]}>
                <Feather name="alert-circle" size={20} color={colors.danger} />
                <Text style={[styles.statValue, { color: colors.danger }]}>
                  {criticalCount}
                </Text>
                <Text style={styles.statLabel}>Critical</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: `${colors.warning}10` }]}>
                <Feather name="alert-triangle" size={20} color={colors.warning} />
                <Text style={[styles.statValue, { color: colors.warning }]}>
                  {stockData.lowStockCount ?? 0}
                </Text>
                <Text style={styles.statLabel}>Low Stock</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#F9731610' }]}>
                <Feather name="package" size={20} color="#F97316" />
                <Text style={[styles.statValue, { color: '#F97316' }]}>
                  {stockData.reorderCount ?? 0}
                </Text>
                <Text style={styles.statLabel}>Reorder</Text>
              </View>
            </View>
          </View>
        )}

        {/* Stock Items */}
        {!hasStockAlerts ? (
          <View style={styles.section}>
            <Card>
              <EmptyState
                icon="check-circle"
                title="All Stock Levels Healthy"
                message="No items require immediate attention"
                iconColor={colors.success}
              />
            </Card>
          </View>
        ) : (
          <>
            {/* Critical Items */}
            {criticalItems && criticalItems.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Critical Items</Text>
                {criticalItems.map((item, index) => renderStockItem(item, index))}
              </View>
            )}

            {/* Low Stock Items */}
            {lowItems && lowItems.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Low Stock</Text>
                {lowItems.map((item, index) => renderStockItem(item, index))}
              </View>
            )}

            {/* Reorder Queue */}
            {reorderItems && reorderItems.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reorder Queue</Text>
                {reorderItems.map((item, index) => renderStockItem(item, index))}
              </View>
            )}
          </>
        )}

        {/* Inventory Metrics */}
        {turnoverData && (
          <View style={styles.section}>
            <Card title="Inventory Metrics">
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Feather name="refresh-cw" size={20} color={colors.primary} />
                  <Text style={styles.metricValue}>
                    {(turnoverData.turnoverRatio ?? 0).toFixed(2)}x
                  </Text>
                  <Text style={styles.metricLabel}>Turnover Ratio</Text>
                </View>
                <View style={styles.metricItem}>
                  <Feather name="clock" size={20} color={colors.primary} />
                  <Text style={styles.metricValue}>
                    {Math.round(turnoverData.daysToSellInventory ?? 0)}
                  </Text>
                  <Text style={styles.metricLabel}>Days to Sell</Text>
                </View>
              </View>
            </Card>
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Inventory</Text>
          <Text style={styles.subtitle}>Stock alerts and metrics</Text>
        </View>

        {/* Main Content */}
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  stockItem: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  stockItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  alertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  alertBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  stockItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockInfo: {
    flex: 1,
  },
  stockDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  stockLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default InventoryScreen;
