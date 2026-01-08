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
import { DateRange } from '../types/api.types';
import { colors } from '../utils/colors';
import { getDateDaysAgo, getCurrentDate } from '../utils/formatters';
import {
  DateRangePicker,
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
  const [rangeOption, setRangeOption] = useState<DateRangeOption>('7days');

  const dateRange: DateRange = useMemo(() => {
    const endDate = getCurrentDate();
    const startDate =
      rangeOption === '7days' ? getDateDaysAgo(7) : getDateDaysAgo(30);
    return { startDate, endDate };
  }, [rangeOption]);

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
          message="Unable to load analytics data"
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
            <RevenueLineChart data={revenueData} title="Revenue Trend" />
          </View>
        )}

        {/* COGS Summary Card */}
        {cogsData && (
          <View style={styles.section}>
            <COGSCard data={cogsData} title="Cost Analysis" />
          </View>
        )}

        {/* Peak Hours Chart */}
        {peakHoursData && (
          <View style={styles.section}>
            <PeakHoursChart data={peakHoursData} title="Peak Hours" />
          </View>
        )}

        {/* Sales by Category Chart */}
        {categoryData && (
          <View style={styles.section}>
            <CategorySalesChart data={categoryData} title="Sales by Category" />
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
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>
            Business performance insights
          </Text>
        </View>

        {/* Date Range Picker */}
        <View style={styles.section}>
          <DateRangePicker
            selected={rangeOption}
            onSelect={setRangeOption}
          />
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
  },
  loadingContainer: {
    paddingHorizontal: 16,
  },
});

export default AnalyticsScreen;
