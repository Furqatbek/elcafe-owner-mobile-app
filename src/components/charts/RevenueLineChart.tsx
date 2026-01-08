import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, chartConfig } from '../../utils/colors';
import { DailyRevenue } from '../../types/api.types';
import { formatCompactCurrency } from '../../utils/formatters';
import Card from '../common/Card';

interface RevenueLineChartProps {
  data: DailyRevenue[];
  title?: string;
}

export const RevenueLineChart: React.FC<RevenueLineChartProps> = ({
  data,
  title = 'Revenue Trend',
}) => {
  const screenWidth = Dimensions.get('window').width - 64;

  if (data.length === 0) {
    return (
      <Card title={title}>
        <Text style={styles.emptyText}>No data available</Text>
      </Card>
    );
  }

  const chartData = {
    labels: data.map((item) => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        data: data.map((item) => item.totalRevenue),
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
  const avgRevenue = totalRevenue / data.length;

  return (
    <Card title={title}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>{formatCompactCurrency(totalRevenue)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Daily Avg</Text>
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
        yAxisLabel="$"
        yAxisSuffix=""
        style={styles.chart}
        formatYLabel={(value) => formatCompactCurrency(Number(value)).replace('$', '')}
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
