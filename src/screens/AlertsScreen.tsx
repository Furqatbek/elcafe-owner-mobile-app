import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from '../hooks/useNotifications';
import { Notification } from '../types/api.types';
import { colors } from '../utils/colors';
import { formatRelativeTime } from '../utils/formatters';
import { EmptyState, LoadingState, ErrorState } from '../components/common';

const getNotificationIcon = (type: string): keyof typeof Feather.glyphMap => {
  const typeIcons: Record<string, keyof typeof Feather.glyphMap> = {
    STOCK_ALERT: 'package',
    LOW_STOCK: 'alert-triangle',
    FINANCIAL: 'dollar-sign',
    ORDER: 'shopping-bag',
    SYSTEM: 'settings',
    DEFAULT: 'bell',
  };
  return typeIcons[type] || typeIcons.DEFAULT;
};

const getNotificationColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    STOCK_ALERT: colors.warning,
    LOW_STOCK: colors.danger,
    FINANCIAL: colors.success,
    ORDER: colors.primary,
    SYSTEM: colors.textSecondary,
    DEFAULT: colors.primary,
  };
  return typeColors[type] || typeColors.DEFAULT;
};

interface NotificationItemProps {
  notification: Notification;
  onPress: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
}) => {
  const iconColor = getNotificationColor(notification.type);
  const icon = getNotificationIcon(notification.type);

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !notification.read && styles.notificationUnread,
      ]}
      onPress={() => onPress(notification.id)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <Feather name={icon} size={18} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            {!notification.read && <View style={styles.unreadDot} />}
            <Text
              style={[
                styles.notificationTitle,
                !notification.read && styles.notificationTitleUnread,
              ]}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
          </View>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={styles.notificationTime}>
            {formatRelativeTime(notification.createdAt)}
          </Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

export const AlertsScreen: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useNotifications();

  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleNotificationPress = useCallback(
    (id: number) => {
      const notification = data?.content.find((n) => n.id === id);
      if (notification && !notification.read) {
        markAsRead(id);
      }
    },
    [data, markAsRead]
  );

  const handleMarkAllRead = useCallback(() => {
    Alert.alert(
      'Mark All as Read',
      'Are you sure you want to mark all notifications as read?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark All Read',
          onPress: () => markAllAsRead(),
        },
      ]
    );
  }, [markAllAsRead]);

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationItem notification={item} onPress={handleNotificationPress} />
    ),
    [handleNotificationPress]
  );

  const keyExtractor = useCallback(
    (item: Notification) => item.id.toString(),
    []
  );

  const renderHeader = () => {
    const hasUnread = data?.content.some((n) => !n.read);

    return (
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            {data?.totalElements || 0} notifications
          </Text>
        </View>
        {hasUnread && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllRead}
            disabled={isMarkingAll}
          >
            <Feather
              name="check-circle"
              size={16}
              color={isMarkingAll ? colors.textMuted : colors.primary}
            />
            <Text
              style={[
                styles.markAllText,
                isMarkingAll && { color: colors.textMuted },
              ]}
            >
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <EmptyState
      icon="bell-off"
      title="No Notifications"
      message="You're all caught up! Check back later for updates."
      iconColor={colors.textSecondary}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <LoadingState message="Loading notifications..." />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <ErrorState
          message="Unable to load notifications"
          onRetry={refetch}
          fullScreen
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data?.content || []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    borderRadius: 14,
  },
  notificationUnread: {
    backgroundColor: `${colors.primary}05`,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
  },
  notificationTitleUnread: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  separator: {
    height: 8,
  },
});

export default AlertsScreen;
