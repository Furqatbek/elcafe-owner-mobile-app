import apiClient from './client';
import { StockSummary, InventoryTurnover, DateRange } from '../types/api.types';

export const inventoryApi = {
  getStockSummary: async (restaurantId: number): Promise<StockSummary> => {
    const response = await apiClient.get<StockSummary>(
      `/api/v1/stock-alerts/summary/${restaurantId}`
    );
    return response.data;
  },

  getInventoryTurnover: async (
    restaurantId: number,
    dateRange: DateRange
  ): Promise<InventoryTurnover> => {
    const response = await apiClient.get<InventoryTurnover>(
      '/api/v1/analytics/inventory/turnover',
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

export default inventoryApi;
