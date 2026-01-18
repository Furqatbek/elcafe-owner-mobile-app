import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { PeriodType, DateRange } from '../../types/api.types';
import { useTranslation } from '../../hooks/useTranslation';
import { formatDate } from '../../utils/formatters';

interface PeriodSelectorProps {
  selected: PeriodType;
  onSelect: (period: PeriodType) => void;
  onCustomPress?: () => void;
  customDateRange?: DateRange;
}

type PeriodKey = 'today' | 'week' | 'month' | 'custom';

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selected,
  onSelect,
  onCustomPress,
  customDateRange,
}) => {
  const { t } = useTranslation();

  const periods: { key: PeriodKey; labelKey: string }[] = [
    { key: 'today', labelKey: 'period.today' },
    { key: 'week', labelKey: 'period.week' },
    { key: 'month', labelKey: 'period.month' },
    { key: 'custom', labelKey: 'period.custom' },
  ];

  const handlePress = (period: PeriodKey) => {
    if (period === 'custom' && onCustomPress) {
      onCustomPress();
    } else {
      onSelect(period);
    }
  };

  const getCustomLabel = () => {
    if (customDateRange && selected === 'custom') {
      const start = formatDate(customDateRange.startDate, 'short');
      const end = formatDate(customDateRange.endDate, 'short');
      return `${start} - ${end}`;
    }
    return t('period.custom');
  };

  return (
    <View style={styles.container}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period.key}
          style={[
            styles.button,
            selected === period.key && styles.buttonActive,
            period.key === 'custom' && styles.customButton,
          ]}
          onPress={() => handlePress(period.key)}
        >
          {period.key === 'custom' && (
            <Feather
              name="calendar"
              size={14}
              color={selected === 'custom' ? colors.primary : colors.textSecondary}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.buttonText,
              selected === period.key && styles.buttonTextActive,
            ]}
            numberOfLines={1}
          >
            {period.key === 'custom' ? getCustomLabel() : t(period.labelKey)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButton: {
    flexDirection: 'row',
    gap: 4,
  },
  buttonActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  buttonTextActive: {
    color: colors.primary,
  },
  icon: {
    marginRight: 2,
  },
});

export default PeriodSelector;
