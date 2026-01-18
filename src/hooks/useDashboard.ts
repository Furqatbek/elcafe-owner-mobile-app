import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api';
import { useAuthStore } from '../store';
import { PeriodType, DateRange } from '../types/api.types';

export const useDashboard = (period: PeriodType = 'today', dateRange?: DateRange) => {
  const restaurantId = useAuthStore((state) => state.restaurantId);

  return useQuery({
    queryKey: ['dashboard', restaurantId, period, dateRange?.startDate, dateRange?.endDate],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      return dashboardApi.getDashboardData(restaurantId, period, dateRange);
    },
    enabled: !!restaurantId && (period !== 'custom' || !!dateRange),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
};

export default useDashboard;
