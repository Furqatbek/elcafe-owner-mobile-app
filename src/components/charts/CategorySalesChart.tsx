import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors, pieChartColors } from '../../utils/colors';
import { CategorySales } from '../../types/api.types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Card from '../common/Card';

interface CategorySalesChartProps {
  data: CategorySales[];
  title?: string;
}

export const CategorySalesChart: React.FC<CategorySalesChartProps> = ({
  data,
  title = 'Sales by Category',
}) => {
  const screenWidth = Dimensions.get('window').width - 64;

  if (data.length === 0) {
    return (
      <Card title={title}>
        <Text style={styles.emptyText}>No data available</Text>
      </Card>
    );
  }

  const chartData = data.slice(0, 6).map((item, index) => ({
    name: item.categoryName,
    value: item.totalRevenue,
    color: pieChartColors[index % pieChartColors.length],
    legendFontColor: colors.textSecondary,
    legendFontSize: 11,
  }));

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
      <View style={styles.categoryList}>
        {data.slice(0, 6).map((item, index) => (
          <View key={item.categoryName} style={styles.categoryItem}>
            <View style={styles.categoryLeft}>
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: pieChartColors[index % pieChartColors.length] },
                ]}
              />
              <Text style={styles.categoryName} numberOfLines={1}>
                {item.categoryName}
              </Text>
            </View>
            <View style={styles.categoryRight}>
              <Text style={styles.categoryRevenue}>
                {formatCurrency(item.totalRevenue)}
              </Text>
              <Text style={styles.categoryPercent}>
                {formatPercentage(item.percentageOfTotalRevenue)}
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
  categoryList: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryRevenue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  categoryPercent: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 32,
  },
});

export default CategorySalesChart;
