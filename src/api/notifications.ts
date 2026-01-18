import apiClient from './client';
import { NotificationsResponse, UnreadCountResponse, ApiResponse } from '../types/api.types';

export const notificationsApi = {
  getNotifications: async (
    userId: number,
    page: number = 0,
    size: number = 50
  ): Promise<NotificationsResponse> => {
    const response = await apiClient.get<ApiResponse<NotificationsResponse>>(
      '/api/v1/notifications',
      {
        params: {
          role: 'ADMIN',
          userId,
          page,
          size,
        },
      }
    );
    return response.data.data;
  },

  getUnreadCount: async (userId: number): Promise<number> => {
    const response = await apiClient.get<ApiResponse<UnreadCountResponse>>(
      '/api/v1/notifications/unread/count',
      {
        params: {
          role: 'ADMIN',
          userId,
        },
      }
    );
    return response.data.data.count;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.patch(`/api/v1/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (userId: number): Promise<void> => {
    await apiClient.patch('/api/v1/notifications/mark-all-read', null, {
      params: {
        role: 'ADMIN',
        userId,
      },
    });
  },
};

export default notificationsApi;
