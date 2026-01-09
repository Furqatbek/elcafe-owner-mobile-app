import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import {
  HomeScreen,
  AnalyticsScreen,
  InventoryScreen,
  ReportsScreen,
  AlertsScreen,
} from '../screens';
import { useNotificationStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';
import { colors } from '../utils/colors';

export type TabParamList = {
  Home: undefined;
  Analytics: undefined;
  Inventory: undefined;
  Reports: undefined;
  Alerts: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  name: keyof typeof Feather.glyphMap;
  focused: boolean;
  color: string;
  badge?: number;
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused, color, badge }) => (
  <View style={styles.iconContainer}>
    <Feather
      name={name}
      size={22}
      color={color}
      style={focused ? styles.iconFocused : undefined}
    />
    {badge !== undefined && badge > 0 && (
      <View style={styles.badge}>
        <View style={styles.badgeInner} />
      </View>
    )}
  </View>
);

export const TabNavigator: React.FC = () => {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('navigation.home'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: t('navigation.analytics'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="bar-chart-2" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          tabBarLabel: t('navigation.inventory'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="package" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarLabel: t('navigation.reports'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="file-text" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarLabel: t('navigation.alerts'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="bell"
              focused={focused}
              color={color}
              badge={unreadCount}
            />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: styles.tabBadge,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  iconContainer: {
    position: 'relative',
  },
  iconFocused: {
    transform: [{ scale: 1.1 }],
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  tabBadge: {
    backgroundColor: colors.danger,
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
  },
});

export default TabNavigator;
