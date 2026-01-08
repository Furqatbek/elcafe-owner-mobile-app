import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';
import { PeriodType } from '../../types/api.types';

interface PeriodSelectorProps {
  selected: PeriodType;
  onSelect: (period: PeriodType) => void;
}

const periods: { key: PeriodType; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period.key}
          style={[
            styles.button,
            selected === period.key && styles.buttonActive,
          ]}
          onPress={() => onSelect(period.key)}
        >
          <Text
            style={[
              styles.buttonText,
              selected === period.key && styles.buttonTextActive,
            ]}
          >
            {period.label}
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
    paddingHorizontal: 12,
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
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  buttonTextActive: {
    color: colors.primary,
  },
});

export default PeriodSelector;
