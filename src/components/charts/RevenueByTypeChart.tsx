import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors, pieChartColors } from '../../utils/colors';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Card from '../common/Card';

interface RevenueByTypeChartProps {
  data?: Record<string, number> | null;
  title?: string;
}

export const RevenueByTypeChart: React.FC<RevenueByTypeChartProps> = ({
  data,
  title = 'Revenue by Order Type',
}) => {
  const screenWidth = Dimensions.get('window').width - 64;
  const safeData = data ?? {};
  const total = Object.values(safeData).reduce((sum, val) => sum + (val ?? 0), 0);

  const chartData = Object.entries(safeData)
    .filter(([_, value]) => value > 0)
    .map(([key, value], index) => ({
      name: key.replace('_', ' '),
      value,
      color: pieChartColors[index % pieChartColors.length],
      legendFontColor: colors.textSecondary,
      legendFontSize: 11,
    }));

  if (chartData.length === 0) {
    return (
      <Card title={title}>
        <Text style={styles.emptyText}>No data available</Text>
      </Card>
    );
  }

  return (
    <Card title={title}>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={screenWidth}
          height={160}
          chartConfig={{
            color: () => colors.primary,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="0"
          hasLegend={false}
          absolute
        />
      </View>
      <View style={styles.legend}>
        {chartData.map((item) => (
          <View key={item.name} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <View style={styles.legendContent}>
              <Text style={styles.legendLabel}>{item.name}</Text>
              <Text style={styles.legendValue}>{formatCurrency(item.value)}</Text>
              <Text style={styles.legendPercent}>
                {formatPercentage((item.value / total) * 100)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '30%',
    marginBottom: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendContent: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  legendPercent: {
    fontSize: 10,
    color: colors.textMuted,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 32,
  },
});

export default RevenueByTypeChart;
