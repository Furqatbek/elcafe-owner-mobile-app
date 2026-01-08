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

  if (!data?.peakHours || data.peakHours.length === 0) {
    return (
      <Card title={title}>
        <Text style={styles.emptyText}>No data available</Text>
      </Card>
    );
  }

  // Get top hours for display
  const sortedHours = [...data.peakHours].sort((a, b) => b.orderCount - a.orderCount);
  const topHours = sortedHours.slice(0, 8);

  const chartData = {
    labels: topHours.map((h) => formatHour(h.hour).replace(' ', '\n')),
    datasets: [
      {
        data: topHours.map((h) => h.orderCount),
      },
    ],
  };

  const peakStartHour = data.peakStartHour ?? 0;
  const peakEndHour = data.peakEndHour ?? 0;

  return (
    <Card title={title}>
      <View style={styles.peakInfo}>
        <View style={styles.peakBadge}>
          <Text style={styles.peakLabel}>Peak Time</Text>
          <Text style={styles.peakValue}>
            {formatHour(peakStartHour)} - {formatHour(peakEndHour)}
          </Text>
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
