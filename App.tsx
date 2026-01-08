import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabNavigator } from './src/navigation';
import { useAuth } from './src/hooks';
import { useUnreadCount } from './src/hooks/useNotifications';
import { colors } from './src/utils/colors';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: true,
    },
  },
});

// Component to handle initial data fetching
const AppContent: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();

  // Fetch unread count on mount
  useUnreadCount();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // For demo purposes, we'll show the app even without authentication
  // In production, you would redirect to a login screen if !isAuthenticated

  return (
    <NavigationContainer>
      <TabNavigator />
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
