import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors, chartConfig } from '../../utils/colors';
import { PeakHoursData } from '../../types/api.types';
import { formatHour } from '../../utils/formatters';
import Card from '../common/Card';

interface PeakHoursChartProps {
  data?: PeakHoursData | null;
  title?: string;
}

export const PeakHoursChart: React.FC<PeakHoursChartProps> = ({
  data,
  title = 'Peak Hours',
}) => {
  const screenWidth = Dimensions.get('window').width - 64;

  const hourlyData = data?.hourlySalesBreakdown ?? [];

  if (hourlyData.length === 0) {
    return (
      <Card title={title}>
        <Text style={styles.emptyText}>No data available</Text>
      </Card>
    );
  }

  // Sort by total orders and get top hours for display
  const sortedHours = [...hourlyData].sort((a, b) => b.totalOrders - a.totalOrders);
  const topHours = sortedHours.slice(0, 8);

  const chartData = {
    labels: topHours.map((h) => formatHour(h.hour).replace(' ', '\n')),
    datasets: [
      {
        data: topHours.map((h) => h.totalOrders),
      },
    ],
  };

  // Format peak time from averagePeakStart and averagePeakEnd
  const formatPeakTime = (time: string | undefined) => {
    if (!time) return '--:--';
    return time.substring(0, 5); // Get HH:MM from HH:MM:SS
  };

  const peakPercentage = data?.peakHoursPercentage ?? 0;

  return (
    <Card title={title}>
      <View style={styles.peakInfo}>
        <View style={styles.peakBadge}>
          <Text style={styles.peakLabel}>Peak Time</Text>
          <Text style={styles.peakValue}>
            {formatPeakTime(data?.averagePeakStart)} - {formatPeakTime(data?.averagePeakEnd)}
          </Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data?.totalOrdersDuringPeakHours ?? 0}</Text>
            <Text style={styles.statLabel}>Peak Orders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data?.totalOrdersOutsidePeakHours ?? 0}</Text>
            <Text style={styles.statLabel}>Off-Peak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{peakPercentage.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Peak %</Text>
          </View>
        </View>
      </View>
      <BarChart
        data={chartData}
        width={screenWidth}
        height={200}
        chartConfig={{
          ...chartConfig,
          barPercentage: 0.6,
          propsForLabels: {
            fontSize: 9,
          },
        }}
        fromZero
        showBarTops={false}
        showValuesOnTopOfBars
        withInnerLines={false}
        style={styles.chart}
        yAxisLabel=""
        yAxisSuffix=""
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  peakInfo: {
    marginBottom: 16,
  },
  peakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${colors.primary}10`,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  peakLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  peakValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
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

export default PeakHoursChart;
