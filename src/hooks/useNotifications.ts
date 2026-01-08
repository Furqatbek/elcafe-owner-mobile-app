import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api';
import { useAuthStore, useNotificationStore } from '../store';

export const useNotifications = (page: number = 0, size: number = 50) => {
  const user = useAuthStore((state) => state.user);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  return useQuery({
    queryKey: ['notifications', user?.id, page, size],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User ID is required');
      }
      return notificationsApi.getNotifications(user.id, page, size);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useUnreadCount = () => {
  const user = useAuthStore((state) => state.user);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  return useQuery({
    queryKey: ['notifications', 'unreadCount', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return 0;
      }
      try {
        const count = await notificationsApi.getUnreadCount(user.id);
        setUnreadCount(count ?? 0);
        return count ?? 0;
      } catch (error) {
        console.warn('Failed to fetch unread count:', error);
        return 0;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const decrementUnreadCount = useNotificationStore(
    (state) => state.decrementUnreadCount
  );

  return useMutation({
    mutationFn: (notificationId: number) =>
      notificationsApi.markAsRead(notificationId),
    onSuccess: () => {
      decrementUnreadCount();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const resetUnreadCount = useNotificationStore((state) => state.resetUnreadCount);

  return useMutation({
    mutationFn: () => {
      if (!user?.id) {
        throw new Error('User ID is required');
      }
      return notificationsApi.markAllAsRead(user.id);
    },
    onSuccess: () => {
      resetUnreadCount();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
