import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';
import { useTranslation } from '../../hooks/useTranslation';

type DateRangeOption = '7days' | '30days' | 'custom';

interface DateRangePickerProps {
  selected: DateRangeOption;
  onSelect: (option: DateRangeOption) => void;
  onCustomPress?: () => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  selected,
  onSelect,
  onCustomPress,
}) => {
  const { t } = useTranslation();

  const options: { key: DateRangeOption; label: string }[] = [
    { key: '7days', label: t('analytics.last7Days') },
    { key: '30days', label: t('analytics.last30Days') },
    { key: 'custom', label: t('analytics.custom') },
  ];

  const handlePress = (option: DateRangeOption) => {
    if (option === 'custom') {
      if (onCustomPress) {
        onCustomPress();
      }
      // Don't call onSelect for custom - it will be called after date selection
      return;
    }
    onSelect(option);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.button,
            selected === option.key && styles.buttonActive,
          ]}
          onPress={() => handlePress(option.key)}
        >
          <Text
            style={[
              styles.buttonText,
              selected === option.key && styles.buttonTextActive,
            ]}
          >
            {option.label}
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
});

export default DateRangePicker;
