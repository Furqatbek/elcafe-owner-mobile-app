import apiClient from './client';
import { StockSummary, InventoryTurnover, DateRange, ApiResponse } from '../types/api.types';

export const inventoryApi = {
  getStockSummary: async (restaurantId: number): Promise<StockSummary> => {
    const response = await apiClient.get<ApiResponse<StockSummary>>(
      `/api/v1/stock-alerts/summary/${restaurantId}`
    );
    return response.data.data;
  },

  getInventoryTurnover: async (
    restaurantId: number,
    dateRange: DateRange
  ): Promise<InventoryTurnover> => {
    const response = await apiClient.get<ApiResponse<InventoryTurnover>>(
      '/api/v1/analytics/inventory/turnover',
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

export default inventoryApi;
