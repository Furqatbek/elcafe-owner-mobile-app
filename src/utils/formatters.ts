/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - Currency code (default: USD)
 * @param locale - Locale string (default: en-US)
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a number as compact currency (e.g., $1.2K, $1.5M)
 * @param value - The number to format
 * @param currency - Currency code (default: USD)
 */
export const formatCompactCurrency = (
  value: number,
  currency: string = 'USD'
): string => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return formatCurrency(value, currency);
};

/**
 * Format a number as percentage
 * @param value - The number to format (0-100 or 0-1)
 * @param decimals - Number of decimal places (default: 1)
 * @param isDecimal - Whether the value is a decimal (0-1) or percentage (0-100)
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  isDecimal: boolean = false
): string => {
  const percentValue = isDecimal ? value * 100 : value;
  return `${percentValue.toFixed(decimals)}%`;
};

/**
 * Format a large number with abbreviations (e.g., 1.2K, 1.5M)
 * @param value - The number to format
 */
export const formatCompactNumber = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};

/**
 * Format a number with comma separators
 * @param value - The number to format
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @param format - Format type
 */
export const formatDate = (
  dateString: string,
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const date = new Date(dateString);

  const optionsMap: Record<'short' | 'medium' | 'long', Intl.DateTimeFormatOptions> = {
    short: { month: 'short' as const, day: 'numeric' as const },
    medium: { month: 'short' as const, day: 'numeric' as const, year: 'numeric' as const },
    long: { weekday: 'long' as const, month: 'long' as const, day: 'numeric' as const, year: 'numeric' as const },
  };

  return date.toLocaleDateString('en-US', optionsMap[format]);
};

/**
 * Format a date as relative time (e.g., "2h ago", "3 days ago")
 * @param dateString - ISO date string
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return formatDate(dateString, 'short');
};

/**
 * Get the current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get a date N days ago in YYYY-MM-DD format
 * @param days - Number of days ago
 */
export const getDateDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

/**
 * Format hour number to AM/PM format
 * @param hour - Hour number (0-23)
 */
export const formatHour = (hour: number): string => {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
};

/**
 * Get trend indicator and color based on change value
 * @param change - Percentage change value
 * @param inverse - If true, negative is good (e.g., for expenses)
 */
export const getTrendInfo = (
  change: number,
  inverse: boolean = false
): { arrow: string; color: string; isPositive: boolean } => {
  const isPositive = inverse ? change < 0 : change > 0;
  const isNegative = inverse ? change > 0 : change < 0;

  if (change === 0) {
    return { arrow: '→', color: '#6B7280', isPositive: false };
  }

  return {
    arrow: change > 0 ? '↑' : '↓',
    color: isPositive ? '#22C55E' : isNegative ? '#EF4444' : '#6B7280',
    isPositive,
  };
};
