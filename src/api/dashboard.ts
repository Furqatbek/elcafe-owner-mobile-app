import apiClient from './client';
import { DashboardData, PeriodType, DateRange, ApiResponse } from '../types/api.types';

const ENDPOINTS: Record<Exclude<PeriodType, 'custom'>, string> = {
  today: '/api/v1/dashboard/today',
  week: '/api/v1/dashboard/week',
  month: '/api/v1/dashboard/month',
};

export const dashboardApi = {
  getDashboardData: async (
    restaurantId: number,
    period: PeriodType = 'today',
    dateRange?: DateRange
  ): Promise<DashboardData> => {
    if (period === 'custom' && dateRange) {
      const response = await apiClient.get<ApiResponse<DashboardData>>('/api/v1/dashboard/custom', {
        params: {
          restaurantId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      });
      return response.data.data;
    }

    const endpoint = ENDPOINTS[period as Exclude<PeriodType, 'custom'>];
    const response = await apiClient.get<ApiResponse<DashboardData>>(endpoint, {
      params: { restaurantId },
    });
    // Extract nested data from API response wrapper
    return response.data.data;
  },

  getTodayData: async (restaurantId: number): Promise<DashboardData> => {
    return dashboardApi.getDashboardData(restaurantId, 'today');
  },

  getWeekData: async (restaurantId: number): Promise<DashboardData> => {
    return dashboardApi.getDashboardData(restaurantId, 'week');
  },

  getMonthData: async (restaurantId: number): Promise<DashboardData> => {
    return dashboardApi.getDashboardData(restaurantId, 'month');
  },
};

export default dashboardApi;
