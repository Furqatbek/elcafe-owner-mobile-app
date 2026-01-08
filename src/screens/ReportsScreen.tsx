import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import {
  useProfitLoss,
  useCustomerRetention,
  useCustomerLTV,
} from '../hooks/useReports';
import { ProfitLossReport, CustomerRetention, CustomerLTV } from '../types/api.types';
import { colors } from '../utils/colors';
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  getDateDaysAgo,
  getCurrentDate,
} from '../utils/formatters';
import {
  Card,
  DateRangePicker,
  ErrorState,
  SkeletonCard,
} from '../components/common';

type ReportTab = 'pl' | 'customers';
type DateRangeOption = '7days' | '30days' | 'custom';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 100,
  strokeWidth = 10,
  color = colors.primary,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          stroke={colors.border}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={[styles.progressText, { position: 'absolute' }]}>
        {formatPercentage(percentage, 0)}
      </Text>
    </View>
  );
};

export const ReportsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('pl');
  const [rangeOption, setRangeOption] = useState<DateRangeOption>('30days');

  const dateRange = useMemo(
    () => ({
      startDate: rangeOption === '7days' ? getDateDaysAgo(7) : getDateDaysAgo(30),
      endDate: getCurrentDate(),
    }),
    [rangeOption]
  );

  const {
    data: plData,
    isLoading: isLoadingPL,
    isError: isErrorPL,
    refetch: refetchPL,
    isRefetching: isRefetchingPL,
  } = useProfitLoss(dateRange);

  const {
    data: retentionData,
    isLoading: isLoadingRetention,
    isError: isErrorRetention,
    refetch: refetchRetention,
  } = useCustomerRetention(dateRange);

  const {
    data: ltvData,
    isLoading: isLoadingLTV,
    isError: isErrorLTV,
    refetch: refetchLTV,
  } = useCustomerLTV();

  const isLoading =
    activeTab === 'pl'
      ? isLoadingPL
      : isLoadingRetention || isLoadingLTV;
  const hasError =
    activeTab === 'pl'
      ? isErrorPL
      : isErrorRetention && isErrorLTV;
  const isRefetching = isRefetchingPL;

  const handleRefresh = useCallback(() => {
    if (activeTab === 'pl') {
      refetchPL();
    } else {
      refetchRetention();
      refetchLTV();
    }
  }, [activeTab, refetchPL, refetchRetention, refetchLTV]);

  const renderPLContent = () => {
    if (!plData) return null;

    const revenueItems = [
      { label: 'Sales Revenue', value: plData.salesRevenue },
      { label: 'Service Fees', value: plData.serviceFeeRevenue },
      { label: 'Delivery Fees', value: plData.deliveryFeeRevenue },
      { label: 'Tips', value: plData.tipRevenue },
    ];

    const expenseEntries = Object.entries(plData.expensesByCategory);
    const isProfit = plData.netIncome >= 0;

    return (
      <>
        {/* Revenue Breakdown */}
        <View style={styles.section}>
          <Card title="Revenue Breakdown">
            {revenueItems.map((item) => (
              <View key={item.label} style={styles.lineItem}>
                <Text style={styles.lineItemLabel}>{item.label}</Text>
                <Text style={styles.lineItemValue}>
                  {formatCurrency(item.value)}
                </Text>
              </View>
            ))}
            <View style={[styles.lineItem, styles.totalLine]}>
              <Text style={styles.totalLabel}>Total Revenue</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(plData.totalRevenue)}
              </Text>
            </View>
          </Card>
        </View>

        {/* Expenses Breakdown */}
        <View style={styles.section}>
          <Card title="Expenses by Category">
            {expenseEntries.map(([category, amount]) => (
              <View key={category} style={styles.expenseItem}>
                <View style={styles.expenseBar}>
                  <View
                    style={[
                      styles.expenseBarFill,
                      {
                        width: `${Math.min(
                          (amount / plData.totalExpenses) * 100,
                          100
                        )}%`,
                      },
                    ]}
                  />
                </View>
                <View style={styles.expenseDetails}>
                  <Text style={styles.expenseLabel}>{category}</Text>
                  <Text style={styles.expenseValue}>
                    {formatCurrency(amount)}
                  </Text>
                </View>
              </View>
            ))}
            <View style={[styles.lineItem, styles.totalLine]}>
              <Text style={styles.totalLabel}>Total Expenses</Text>
              <Text style={[styles.totalValue, { color: colors.danger }]}>
                {formatCurrency(plData.totalExpenses)}
              </Text>
            </View>
          </Card>
        </View>

        {/* Net Income */}
        <View style={styles.section}>
          <Card>
            <View style={styles.netIncomeContainer}>
              <Feather
                name={isProfit ? 'trending-up' : 'trending-down'}
                size={32}
                color={isProfit ? colors.success : colors.danger}
              />
              <Text style={styles.netIncomeLabel}>Net Income</Text>
              <Text
                style={[
                  styles.netIncomeValue,
                  { color: isProfit ? colors.success : colors.danger },
                ]}
              >
                {formatCurrency(plData.netIncome)}
              </Text>
              <Text style={styles.orderCount}>
                From {formatNumber(plData.orderCount)} orders
              </Text>
            </View>
          </Card>
        </View>
      </>
    );
  };

  const renderCustomersContent = () => {
    return (
      <>
        {/* Retention Rate */}
        {retentionData && (
          <View style={styles.section}>
            <Card title="Customer Retention">
              <View style={styles.retentionContainer}>
                <CircularProgress
                  percentage={retentionData.retentionRate}
                  size={120}
                  color={colors.success}
                />
                <View style={styles.retentionStats}>
                  <View style={styles.retentionStat}>
                    <Text style={styles.retentionStatLabel}>Repeat Rate</Text>
                    <Text style={styles.retentionStatValue}>
                      {formatPercentage(retentionData.repeatCustomerRate)}
                    </Text>
                  </View>
                  <View style={styles.retentionStat}>
                    <Text style={styles.retentionStatLabel}>Churn Rate</Text>
                    <Text style={[styles.retentionStatValue, { color: colors.danger }]}>
                      {formatPercentage(retentionData.churnRate)}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Customer Counts */}
        {retentionData && (
          <View style={styles.section}>
            <View style={styles.customerCountRow}>
              <View style={[styles.customerCountCard, { backgroundColor: `${colors.success}10` }]}>
                <Feather name="user-plus" size={24} color={colors.success} />
                <Text style={[styles.customerCountValue, { color: colors.success }]}>
                  {formatNumber(retentionData.newCustomers)}
                </Text>
                <Text style={styles.customerCountLabel}>New Customers</Text>
              </View>
              <View style={[styles.customerCountCard, { backgroundColor: `${colors.primary}10` }]}>
                <Feather name="users" size={24} color={colors.primary} />
                <Text style={[styles.customerCountValue, { color: colors.primary }]}>
                  {formatNumber(retentionData.returningCustomers)}
                </Text>
                <Text style={styles.customerCountLabel}>Returning</Text>
              </View>
            </View>
          </View>
        )}

        {/* Customer LTV */}
        {ltvData && (
          <View style={styles.section}>
            <Card title="Customer Lifetime Value">
              <View style={styles.ltvContainer}>
                <View style={styles.ltvMain}>
                  <Text style={styles.ltvLabel}>Average LTV</Text>
                  <Text style={styles.ltvValue}>
                    {formatCurrency(ltvData.averageLTV)}
                  </Text>
                </View>
                <View style={styles.ltvStats}>
                  <View style={styles.ltvStat}>
                    <Feather name="shopping-cart" size={18} color={colors.primary} />
                    <Text style={styles.ltvStatValue}>
                      {formatCurrency(ltvData.averageOrderValue)}
                    </Text>
                    <Text style={styles.ltvStatLabel}>Avg Order</Text>
                  </View>
                  <View style={styles.ltvDivider} />
                  <View style={styles.ltvStat}>
                    <Feather name="repeat" size={18} color={colors.primary} />
                    <Text style={styles.ltvStatValue}>
                      {ltvData.averageOrdersPerCustomer.toFixed(1)}
                    </Text>
                    <Text style={styles.ltvStatLabel}>Avg Orders/Customer</Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        )}
      </>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
          <SkeletonCard lines={2} />
        </View>
      );
    }

    if (hasError) {
      return (
        <ErrorState
          message="Unable to load report data"
          onRetry={handleRefresh}
          fullScreen
        />
      );
    }

    return activeTab === 'pl' ? renderPLContent() : renderCustomersContent();
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
          <Text style={styles.title}>Reports</Text>
          <Text style={styles.subtitle}>Financial and customer insights</Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.section}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'pl' && styles.tabActive]}
              onPress={() => setActiveTab('pl')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'pl' && styles.tabTextActive,
                ]}
              >
                P&L
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'customers' && styles.tabActive]}
              onPress={() => setActiveTab('customers')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'customers' && styles.tabTextActive,
                ]}
              >
                Customers
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Range Picker */}
        <View style={styles.section}>
          <DateRangePicker selected={rangeOption} onSelect={setRangeOption} />
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
    marginTop: 8,
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lineItemLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  lineItemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalLine: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.success,
  },
  expenseItem: {
    marginBottom: 16,
  },
  expenseBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  expenseBarFill: {
    height: '100%',
    backgroundColor: colors.danger,
    borderRadius: 4,
  },
  expenseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  expenseValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  netIncomeContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  netIncomeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  netIncomeValue: {
    fontSize: 36,
    fontWeight: '700',
    marginTop: 4,
  },
  orderCount: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
  },
  progressText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  retentionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  retentionStats: {
    gap: 16,
  },
  retentionStat: {
    alignItems: 'center',
  },
  retentionStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  retentionStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  customerCountRow: {
    flexDirection: 'row',
    gap: 12,
  },
  customerCountCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
  customerCountValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
  customerCountLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  ltvContainer: {
    paddingVertical: 10,
  },
  ltvMain: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ltvLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ltvValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.success,
    marginTop: 4,
  },
  ltvStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  ltvStat: {
    alignItems: 'center',
    flex: 1,
  },
  ltvDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  ltvStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  ltvStatLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ReportsScreen;
