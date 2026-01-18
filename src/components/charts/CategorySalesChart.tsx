import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors, pieChartColors } from '../../utils/colors';
import { CategorySales } from '../../types/api.types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Card from '../common/Card';
import { useTranslation } from '../../hooks/useTranslation';

interface CategorySalesChartProps {
  data?: CategorySales[] | Record<string, unknown> | null;
  title?: string;
}

export const CategorySalesChart: React.FC<CategorySalesChartProps> = ({
  data,
  title,
}) => {
  const { t } = useTranslation();
  const screenWidth = Dimensions.get('window').width - 64;
  const cardTitle = title ?? t('analytics.salesByCategory');

  // Handle both array and wrapped object responses
  const extractData = (): CategorySales[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    // If data is wrapped in an object (e.g., { data: [...] } or { content: [...] })
    if (typeof data === 'object') {
      if (Array.isArray((data as Record<string, unknown>).data)) {
        return (data as Record<string, unknown>).data as CategorySales[];
      }
      if (Array.isArray((data as Record<string, unknown>).content)) {
        return (data as Record<string, unknown>).content as CategorySales[];
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

  const chartData = safeData.slice(0, 6).map((item, index) => ({
    name: item.categoryName,
    value: item.totalRevenue ?? 0,
    color: pieChartColors[index % pieChartColors.length],
    legendFontColor: colors.textSecondary,
    legendFontSize: 11,
  }));

  return (
    <Card title={cardTitle}>
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
        {safeData.slice(0, 6).map((item, index) => (
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
