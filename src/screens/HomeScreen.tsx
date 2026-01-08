import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDashboard } from '../hooks/useDashboard';
import { useAuthStore } from '../store';
import { PeriodType } from '../types/api.types';
import { colors } from '../utils/colors';
import { formatDate } from '../utils/formatters';
import {
  PeriodSelector,
  LoadingState,
  ErrorState,
  SkeletonCard,
} from '../components/common';
import {
  FinancialSummaryCard,
  TrendCard,
  OrderStatsCard,
  TopSellingItemsCard,
  InventoryAlertCard,
} from '../components/cards';
import { RevenueByTypeChart } from '../components/charts';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [period, setPeriod] = useState<PeriodType>('today');
  const { data, isLoading, isError, refetch, isRefetching } = useDashboard(period);
  const { user, logout } = useAuthStore();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleInventoryPress = useCallback(() => {
    (navigation as any).navigate('Inventory');
  }, [navigation]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  }, [logout]);

  const getPeriodTitle = () => {
    switch (period) {
      case 'today':
        return "Today's Overview";
      case 'week':
        return "This Week's Overview";
      case 'month':
        return "This Month's Overview";
      default:
        return 'Overview';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <SkeletonCard lines={4} />
          <SkeletonCard lines={2} />
          <SkeletonCard lines={3} />
          <SkeletonCard lines={3} />
        </View>
      );
    }

    if (isError || !data) {
      return (
        <ErrorState
          message="Unable to load dashboard data"
          onRetry={refetch}
          fullScreen
        />
      );
    }

    return (
      <>
        {/* Financial Summary Card */}
        <View style={styles.section}>
          <FinancialSummaryCard
            totalIncome={data.totalIncome}
            totalExpenses={data.totalExpenses}
            netProfit={data.netProfit}
            profitMargin={data.profitMargin}
          />
        </View>

        {/* Trend Comparison Card */}
        <View style={styles.section}>
          <TrendCard comparison={data.comparison} />
        </View>

        {/* Order Statistics - Horizontal Scroll */}
        <OrderStatsCard stats={data.orderStats} />

        {/* Revenue by Order Type */}
        <View style={styles.section}>
          <RevenueByTypeChart
            data={data.incomeByOrderType}
            title="Revenue by Order Type"
          />
        </View>

        {/* Top Selling Items */}
        <View style={styles.section}>
          <TopSellingItemsCard items={data.soldItems} limit={3} />
        </View>

        {/* Inventory Alert */}
        <View style={styles.section}>
          <InventoryAlertCard
            alerts={data.inventoryAlerts}
            onPress={handleInventoryPress}
          />
        </View>
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
          <View style={styles.headerTop}>
            <View style={styles.greeting}>
              <Text style={styles.greetingText}>
                Hello, {user?.firstName || 'Owner'}
              </Text>
              <Text style={styles.date}>
                {formatDate(new Date().toISOString(), 'long')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Feather name="log-out" size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{getPeriodTitle()}</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.section}>
          <PeriodSelector selected={period} onSelect={setPeriod} />
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${colors.danger}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  date: {
    fontSize: 13,
    color: colors.textMuted,
  },
  section: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
