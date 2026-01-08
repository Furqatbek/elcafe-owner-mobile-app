import apiClient from './client';
import {
  ProfitLossReport,
  COGSReport,
  CustomerRetention,
  CustomerLTV,
  DateRange,
} from '../types/api.types';

export const reportsApi = {
  getProfitLoss: async (
    restaurantId: number,
    dateRange: DateRange
  ): Promise<ProfitLossReport> => {
    const response = await apiClient.get<ProfitLossReport>(
      '/api/v1/financial/reports/profit-loss',
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

  getCOGSReport: async (
    restaurantId: number,
    dateRange: DateRange
  ): Promise<COGSReport> => {
    const response = await apiClient.get<COGSReport>(
      '/api/v1/financial/reports/cogs',
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

  getCustomerRetention: async (
    restaurantId: number,
    dateRange: DateRange
  ): Promise<CustomerRetention> => {
    const response = await apiClient.get<CustomerRetention>(
      '/api/v1/analytics/customer/retention',
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

  getCustomerLTV: async (restaurantId: number): Promise<CustomerLTV> => {
    const response = await apiClient.get<CustomerLTV>(
      '/api/v1/analytics/customer/ltv',
      {
        params: { restaurantId },
      }
    );
    return response.data;
  },
};

export default reportsApi;
