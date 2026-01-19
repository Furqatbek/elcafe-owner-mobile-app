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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDashboard } from '../hooks/useDashboard';
import { useTranslation } from '../hooks/useTranslation';
import { useAuthStore } from '../store';
import { PeriodType, DateRange } from '../types/api.types';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../utils/colors';
import { formatDate } from '../utils/formatters';
import {
  PeriodSelector,
  LoadingState,
  ErrorState,
  SkeletonCard,
  LanguageSelector,
  DateRangePickerModal,
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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [period, setPeriod] = useState<PeriodType>('today');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { data, isLoading, isError, refetch, isRefetching } = useDashboard(period, customDateRange);
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleInventoryPress = useCallback(() => {
    (navigation as any).navigate('Inventory');
  }, [navigation]);

  const handleShowMoreSoldItems = useCallback(() => {
    if (data?.soldItems) {
      navigation.navigate('SoldItems', { items: data.soldItems });
    }
  }, [navigation, data?.soldItems]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      t('settings.logout'),
      t('settings.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  }, [logout, t]);

  const handlePeriodSelect = useCallback((newPeriod: PeriodType) => {
    if (newPeriod !== 'custom') {
      setCustomDateRange(undefined);
    }
    setPeriod(newPeriod);
  }, []);

  const handleCustomPress = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const handleDateRangeConfirm = useCallback((dateRange: DateRange) => {
    setCustomDateRange(dateRange);
    setPeriod('custom');
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.morning');
    if (hour < 18) return t('home.afternoon');
    return t('home.evening');
  };

  const getPeriodTitle = () => {
    switch (period) {
      case 'today':
        return t('period.todayOverview');
      case 'week':
        return t('period.weekOverview');
      case 'month':
        return t('period.monthOverview');
      case 'custom':
        return t('period.customOverview');
      default:
        return t('period.todayOverview');
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
          message={t('errors.dashboardError')}
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
            title={t('analytics.revenueByOrderType')}
          />
        </View>

        {/* Top Selling Items */}
        <View style={styles.section}>
          <TopSellingItemsCard
            items={data.soldItems}
            onShowMore={handleShowMoreSoldItems}
          />
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
                {getGreeting()}, {user?.firstName || t('common.owner')}
              </Text>
              <Text style={styles.date}>
                {formatDate(new Date().toISOString(), 'long')}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <LanguageSelector compact />
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Feather name="log-out" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.title}>{getPeriodTitle()}</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.section}>
          <PeriodSelector
            selected={period}
            onSelect={handlePeriodSelect}
            onCustomPress={handleCustomPress}
            customDateRange={customDateRange}
          />
        </View>

        {/* Main Content */}
        {renderContent()}
      </ScrollView>

      {/* Date Range Picker Modal */}
      <DateRangePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleDateRangeConfirm}
        initialDateRange={customDateRange}
      />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
