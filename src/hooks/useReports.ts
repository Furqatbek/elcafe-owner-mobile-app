import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api';
import { useAuthStore } from '../store';
import { DateRange } from '../types/api.types';

export const useProfitLoss = (dateRange: DateRange) => {
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['reports', 'profitLoss', userId, restaurantId, dateRange],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      return reportsApi.getProfitLoss(restaurantId, dateRange);
    },
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCOGSReport = (dateRange: DateRange) => {
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['reports', 'cogs', userId, restaurantId, dateRange],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      return reportsApi.getCOGSReport(restaurantId, dateRange);
    },
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCustomerRetention = (dateRange: DateRange) => {
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['reports', 'customerRetention', userId, restaurantId, dateRange],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      return reportsApi.getCustomerRetention(restaurantId, dateRange);
    },
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCustomerLTV = () => {
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['reports', 'customerLTV', userId, restaurantId],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      return reportsApi.getCustomerLTV(restaurantId);
    },
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
