import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to load data',
  onRetry,
  fullScreen = false,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <Feather name="alert-circle" size={48} color={colors.danger} />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Feather name="refresh-cw" size={16} color={colors.white} />
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ErrorState;
