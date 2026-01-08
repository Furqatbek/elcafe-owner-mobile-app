import apiClient from './client';
import {
  DailyRevenue,
  COGSData,
  PeakHoursData,
  CategorySales,
  DateRange,
} from '../types/api.types';

export const analyticsApi = {
  getDailyRevenue: async (
    restaurantId: string,
    dateRange: DateRange
  ): Promise<DailyRevenue[]> => {
    const response = await apiClient.get<DailyRevenue[]>(
      '/api/v1/analytics/financial/daily-revenue',
      {
        params: {
          restaurantId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      }
    );
    return response.data;
  },

  getCOGS: async (
    restaurantId: string,
    dateRange: DateRange
  ): Promise<COGSData> => {
    const response = await apiClient.get<COGSData>(
      '/api/v1/analytics/financial/cogs',
      {
        params: {
          restaurantId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      }
    );
    return response.data;
  },

  getPeakHours: async (
    restaurantId: string,
    dateRange: DateRange
  ): Promise<PeakHoursData> => {
    const response = await apiClient.get<PeakHoursData>(
      '/api/v1/analytics/operational/peak-hours',
      {
        params: {
          restaurantId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      }
    );
    return response.data;
  },

  getSalesByCategory: async (
    restaurantId: string,
    dateRange: DateRange
  ): Promise<CategorySales[]> => {
    const response = await apiClient.get<CategorySales[]>(
      '/api/v1/analytics/financial/sales-by-category',
      {
        params: {
          restaurantId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      }
    );
    return response.data;
  },
};

export default analyticsApi;
