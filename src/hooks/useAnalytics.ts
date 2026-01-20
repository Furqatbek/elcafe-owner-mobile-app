import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api';
import { useAuthStore } from '../store';
import { DateRange } from '../types/api.types';

export const useDailyRevenue = (dateRange: DateRange) => {
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['analytics', 'dailyRevenue', userId, restaurantId, dateRange],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      return analyticsApi.getDailyRevenue(restaurantId, dateRange);
    },
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCOGS = (dateRange: DateRange) => {
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['analytics', 'cogs', userId, restaurantId, dateRange],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      return analyticsApi.getCOGS(restaurantId, dateRange);
    },
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePeakHours = (dateRange: DateRange) => {
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['analytics', 'peakHours', userId, restaurantId, dateRange],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      return analyticsApi.getPeakHours(restaurantId, dateRange);
    },
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSalesByCategory = (dateRange: DateRange) => {
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['analytics', 'salesByCategory', userId, restaurantId, dateRange],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      return analyticsApi.getSalesByCategory(restaurantId, dateRange);
    },
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  });
};
