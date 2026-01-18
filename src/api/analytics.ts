import apiClient from './client';
import {
  DailyRevenue,
  COGSData,
  PeakHoursData,
  CategorySales,
  DateRange,
  ApiResponse,
} from '../types/api.types';

export const analyticsApi = {
  getDailyRevenue: async (
    restaurantId: number,
    dateRange: DateRange
  ): Promise<DailyRevenue[]> => {
    const response = await apiClient.get<ApiResponse<DailyRevenue[]>>(
      '/api/v1/analytics/financial/daily-revenue',
      {
        params: {
          restaurantId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      }
    );
    return response.data.data;
  },

  getCOGS: async (
    restaurantId: number,
    dateRange: DateRange
  ): Promise<COGSData> => {
    const response = await apiClient.get<ApiResponse<COGSData>>(
      '/api/v1/analytics/financial/cogs',
      {
        params: {
          restaurantId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      }
    );
    return response.data.data;
  },

  getPeakHours: async (
    restaurantId: number,
    dateRange: DateRange
  ): Promise<PeakHoursData> => {
    const response = await apiClient.get<ApiResponse<PeakHoursData>>(
      '/api/v1/analytics/operational/peak-hours',
      {
        params: {
          restaurantId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      }
    );
    return response.data.data;
  },

  getSalesByCategory: async (
    restaurantId: number,
    dateRange: DateRange
  ): Promise<CategorySales[]> => {
    const response = await apiClient.get<ApiResponse<CategorySales[]>>(
      '/api/v1/analytics/financial/sales-by-category',
      {
        params: {
          restaurantId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      }
    );
    return response.data.data;
  },
};

export default analyticsApi;
