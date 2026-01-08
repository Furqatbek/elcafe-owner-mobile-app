import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api';
import { useAuthStore } from '../store';
import { PeriodType } from '../types/api.types';

export const useDashboard = (period: PeriodType = 'today') => {
  const restaurantId = useAuthStore((state) => state.restaurantId);

  return useQuery({
    queryKey: ['dashboard', restaurantId, period],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      return dashboardApi.getDashboardData(restaurantId, period);
    },
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
};

export default useDashboard;
