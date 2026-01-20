import { QueryClient } from '@tanstack/react-query';

// Create a QueryClient instance that can be shared
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: true,
    },
  },
});

export default queryClient;
