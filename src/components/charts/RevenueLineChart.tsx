import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, chartConfig } from '../../utils/colors';
import { DailyRevenue } from '../../types/api.types';
import { formatCompactCurrency } from '../../utils/formatters';
import Card from '../common/Card';
import { useTranslation } from '../../hooks/useTranslation';

interface RevenueLineChartProps {
  data?: DailyRevenue[] | Record<string, unknown> | null;
  title?: string;
}

export const RevenueLineChart: React.FC<RevenueLineChartProps> = ({
  data,
  title,
}) => {
  const { t } = useTranslation();
  const screenWidth = Dimensions.get('window').width - 64;
  const cardTitle = title ?? t('analytics.revenueTrend');

  // Handle both array and wrapped object responses
  const extractData = (): DailyRevenue[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    // If data is wrapped in an object (e.g., { data: [...] } or { content: [...] })
    if (typeof data === 'object') {
      if (Array.isArray((data as Record<string, unknown>).data)) {
        return (data as Record<string, unknown>).data as DailyRevenue[];
      }
      if (Array.isArray((data as Record<string, unknown>).content)) {
        return (data as Record<string, unknown>).content as DailyRevenue[];
      }
    }
    return [];
  };

  const safeData = extractData();

  if (safeData.length === 0) {
    return (
      <Card title={cardTitle}>
        <Text style={styles.emptyText}>{t('common.noData')}</Text>
      </Card>
    );
  }

  const chartData = {
    labels: safeData.map((item) => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        data: safeData.map((item) => item.totalRevenue ?? 0),
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const totalRevenue = safeData.reduce((sum, item) => sum + (item.totalRevenue ?? 0), 0);
  const avgRevenue = totalRevenue / safeData.length;

  return (
    <Card title={cardTitle}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>{t('analytics.total')}</Text>
          <Text style={styles.summaryValue}>{formatCompactCurrency(totalRevenue)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>{t('analytics.dailyAvg')}</Text>
          <Text style={styles.summaryValue}>{formatCompactCurrency(avgRevenue)}</Text>
        </View>
      </View>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={200}
        chartConfig={{
          ...chartConfig,
          propsForLabels: {
            fontSize: 10,
          },
        }}
        bezier
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        fromZero
        yAxisLabel=""
        yAxisSuffix=""
        style={styles.chart}
        formatYLabel={(value) => formatCompactCurrency(Number(value))}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chart: {
    marginLeft: -16,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 32,
  },
});

export default RevenueLineChart;
