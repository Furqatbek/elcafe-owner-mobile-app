import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../api';
import { useAuthStore } from '../store';
import { DateRange } from '../types/api.types';

export const useStockSummary = () => {
  const restaurantId = useAuthStore((state) => state.restaurantId);

  return useQuery({
    queryKey: ['inventory', 'stockSummary', restaurantId],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      return inventoryApi.getStockSummary(restaurantId);
    },
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useInventoryTurnover = (dateRange: DateRange) => {
  const restaurantId = useAuthStore((state) => state.restaurantId);

  return useQuery({
    queryKey: ['inventory', 'turnover', restaurantId, dateRange],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      return inventoryApi.getInventoryTurnover(restaurantId, dateRange);
    },
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  });
};
