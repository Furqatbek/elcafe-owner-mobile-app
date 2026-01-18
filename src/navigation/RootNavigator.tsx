import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store';
import { LoginScreen, SoldItemsScreen } from '../screens';
import { TabNavigator } from './TabNavigator';
import { SoldItem } from '../types/api.types';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  SoldItems: { items: SoldItem[] };
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="SoldItems" component={SoldItemsScreen} />
        </>
      ) : (
        <Stack.Screen
          name="Auth"
          component={LoginScreen}
          options={{
            animationTypeForReplace: isAuthenticated ? 'push' : 'pop',
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
