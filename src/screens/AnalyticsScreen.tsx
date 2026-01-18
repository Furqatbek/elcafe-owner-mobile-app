import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {
  useDailyRevenue,
  useCOGS,
  usePeakHours,
  useSalesByCategory,
} from '../hooks/useAnalytics';
import { useTranslation } from '../hooks/useTranslation';
import { DateRange } from '../types/api.types';
import { colors } from '../utils/colors';
import { getDateDaysAgo, getCurrentDate } from '../utils/formatters';
import {
  DateRangePicker,
  DateRangePickerModal,
  ErrorState,
  SkeletonCard,
} from '../components/common';
import {
  RevenueLineChart,
  PeakHoursChart,
  CategorySalesChart,
  COGSCard,
} from '../components/charts';

type DateRangeOption = '7days' | '30days' | 'custom';

export const AnalyticsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [rangeOption, setRangeOption] = useState<DateRangeOption>('7days');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dateRange: DateRange = useMemo(() => {
    if (rangeOption === 'custom' && customDateRange) {
      return customDateRange;
    }
    const endDate = getCurrentDate();
    const startDate =
      rangeOption === '7days' ? getDateDaysAgo(7) : getDateDaysAgo(30);
    return { startDate, endDate };
  }, [rangeOption, customDateRange]);

  const {
    data: revenueData,
    isLoading: isLoadingRevenue,
    isError: isErrorRevenue,
    refetch: refetchRevenue,
    isRefetching: isRefetchingRevenue,
  } = useDailyRevenue(dateRange);

  const {
    data: cogsData,
    isLoading: isLoadingCOGS,
    isError: isErrorCOGS,
    refetch: refetchCOGS,
  } = useCOGS(dateRange);

  const {
    data: peakHoursData,
    isLoading: isLoadingPeakHours,
    isError: isErrorPeakHours,
    refetch: refetchPeakHours,
  } = usePeakHours(dateRange);

  const {
    data: categoryData,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    refetch: refetchCategory,
  } = useSalesByCategory(dateRange);

  const isLoading =
    isLoadingRevenue || isLoadingCOGS || isLoadingPeakHours || isLoadingCategory;
  const isRefetching = isRefetchingRevenue;
  const hasError =
    isErrorRevenue && isErrorCOGS && isErrorPeakHours && isErrorCategory;

  const handleRefresh = useCallback(() => {
    refetchRevenue();
    refetchCOGS();
    refetchPeakHours();
    refetchCategory();
  }, [refetchRevenue, refetchCOGS, refetchPeakHours, refetchCategory]);

  const handleRangeSelect = useCallback((option: DateRangeOption) => {
    if (option !== 'custom') {
      setCustomDateRange(undefined);
    }
    setRangeOption(option);
  }, []);

  const handleCustomPress = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const handleDateRangeConfirm = useCallback((range: DateRange) => {
    setCustomDateRange(range);
    setRangeOption('custom');
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <SkeletonCard lines={5} />
          <SkeletonCard lines={3} />
          <SkeletonCard lines={5} />
          <SkeletonCard lines={4} />
        </View>
      );
    }

    if (hasError) {
      return (
        <ErrorState
          message={t('errors.analyticsError')}
          onRetry={handleRefresh}
          fullScreen
        />
      );
    }

    return (
      <>
        {/* Revenue Trend Chart */}
        {revenueData && (
          <View style={styles.section}>
            <RevenueLineChart data={revenueData} title={t('analytics.revenueTrend')} />
          </View>
        )}

        {/* COGS Summary Card */}
        {cogsData && (
          <View style={styles.section}>
            <COGSCard data={cogsData} title={t('analytics.costAnalysis')} />
          </View>
        )}

        {/* Peak Hours Chart */}
        {peakHoursData && (
          <View style={styles.section}>
            <PeakHoursChart data={peakHoursData} title={t('analytics.peakHours')} />
          </View>
        )}

        {/* Sales by Category Chart */}
        {categoryData && (
          <View style={styles.section}>
            <CategorySalesChart data={categoryData} title={t('analytics.salesByCategory')} />
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
          <Text style={styles.title}>{t('analytics.title')}</Text>
          <Text style={styles.subtitle}>
            {t('analytics.subtitle')}
          </Text>
        </View>

        {/* Date Range Picker */}
        <View style={styles.section}>
          <DateRangePicker
            selected={rangeOption}
            onSelect={handleRangeSelect}
            onCustomPress={handleCustomPress}
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
  },
  loadingContainer: {
    paddingHorizontal: 16,
  },
});

export default AnalyticsScreen;
