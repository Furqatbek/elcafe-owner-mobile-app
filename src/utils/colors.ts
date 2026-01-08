export const colors = {
  // Primary colors
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',

  // Status colors
  success: '#22C55E',
  successLight: '#4ADE80',
  successDark: '#16A34A',

  danger: '#EF4444',
  dangerLight: '#F87171',
  dangerDark: '#DC2626',

  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',

  critical: '#DC2626',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  background: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E5E7EB',

  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Chart colors
  chartBlue: '#3B82F6',
  chartGreen: '#22C55E',
  chartRed: '#EF4444',
  chartYellow: '#F59E0B',
  chartPurple: '#8B5CF6',
  chartPink: '#EC4899',
  chartOrange: '#F97316',
  chartTeal: '#14B8A6',

  // Gradient colors for charts
  gradientStart: 'rgba(59, 130, 246, 0.8)',
  gradientEnd: 'rgba(59, 130, 246, 0.2)',
};

export const chartConfig = {
  backgroundColor: colors.white,
  backgroundGradientFrom: colors.white,
  backgroundGradientTo: colors.white,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: colors.primary,
  },
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: colors.border,
    strokeWidth: 1,
  },
};

export const pieChartColors = [
  colors.chartBlue,
  colors.chartGreen,
  colors.chartYellow,
  colors.chartPurple,
  colors.chartPink,
  colors.chartOrange,
  colors.chartTeal,
  colors.chartRed,
];

export default colors;
