import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation';
import { useAuth } from './src/hooks';
import { useUnreadCount } from './src/hooks/useNotifications';
import { useAuthStore, useLanguageStore } from './src/store';
import { colors } from './src/utils/colors';
import { queryClient } from './src/utils/queryClient';

// Component to fetch notifications when authenticated
const NotificationsFetcher: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Only fetch unread count when authenticated
  useUnreadCount();

  return null;
};

// Component to handle initial data fetching and auth
const AppContent: React.FC = () => {
  const { isLoading: isAuthLoading } = useAuth();
  const initializeLanguage = useLanguageStore((state) => state.initialize);
  const isLanguageLoading = useLanguageStore((state) => state.isLoading);
  const [languageInitialized, setLanguageInitialized] = useState(false);

  useEffect(() => {
    initializeLanguage().then(() => setLanguageInitialized(true));
  }, [initializeLanguage]);

  if (isAuthLoading || !languageInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <NotificationsFetcher />
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <AppContent />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
