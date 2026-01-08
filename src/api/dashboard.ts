import apiClient from './client';
import { DashboardData, PeriodType } from '../types/api.types';

const ENDPOINTS = {
  today: '/api/v1/dashboard/today',
  week: '/api/v1/dashboard/week',
  month: '/api/v1/dashboard/month',
};

export const dashboardApi = {
  getDashboardData: async (restaurantId: number, period: PeriodType = 'today'): Promise<DashboardData> => {
    const endpoint = ENDPOINTS[period];
    const response = await apiClient.get<DashboardData>(endpoint, {
      params: { restaurantId },
    });
    return response.data;
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
