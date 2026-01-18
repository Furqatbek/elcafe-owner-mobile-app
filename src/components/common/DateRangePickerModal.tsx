import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { DateRange } from '../../types/api.types';
import { formatDate } from '../../utils/formatters';

interface DateRangePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (dateRange: DateRange) => void;
  initialDateRange?: DateRange;
}

export const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialDateRange,
}) => {
  const { t } = useTranslation();
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [startDate, setStartDate] = useState<Date>(
    initialDateRange ? new Date(initialDateRange.startDate) : thirtyDaysAgo
  );
  const [endDate, setEndDate] = useState<Date>(
    initialDateRange ? new Date(initialDateRange.endDate) : today
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
    }
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const handleEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndPicker(false);
    }
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    const dateRange: DateRange = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
    onConfirm(dateRange);
    onClose();
  };

  const formatDisplayDate = (date: Date) => {
    return formatDate(date.toISOString(), 'short');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('period.selectDateRange')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.dateSection}>
            <Text style={styles.label}>{t('period.startDate')}</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Feather name="calendar" size={18} color={colors.primary} />
              <Text style={styles.dateText}>{formatDisplayDate(startDate)}</Text>
            </TouchableOpacity>
            {(showStartPicker || Platform.OS === 'ios') && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleStartDateChange}
                  maximumDate={today}
                  style={styles.picker}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={styles.hidePicker}
                    onPress={() => setShowStartPicker(false)}
                  >
                    <Text style={styles.hidePickerText}>{t('common.done')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View style={styles.dateSection}>
            <Text style={styles.label}>{t('period.endDate')}</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Feather name="calendar" size={18} color={colors.primary} />
              <Text style={styles.dateText}>{formatDisplayDate(endDate)}</Text>
            </TouchableOpacity>
            {(showEndPicker || Platform.OS === 'ios') && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleEndDateChange}
                  minimumDate={startDate}
                  maximumDate={today}
                  style={styles.picker}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={styles.hidePicker}
                    onPress={() => setShowEndPicker(false)}
                  >
                    <Text style={styles.hidePickerText}>{t('common.done')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>{t('common.confirm')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  dateSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  pickerContainer: {
    marginTop: 8,
  },
  picker: {
    backgroundColor: colors.background,
  },
  hidePicker: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  hidePickerText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});

export default DateRangePickerModal;
