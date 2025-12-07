import { QueryClient } from '@tanstack/react-query';

/**
 * Global QueryClient configuration for React Query
 *
 * Default options:
 * - staleTime: 30s - Data is considered fresh for 30 seconds
 * - cacheTime: 5min - Data stays in cache for 5 minutes after unused
 * - retry: 3 - Automatically retry failed requests 3 times
 * - refetchOnWindowFocus: true - Refetch when user returns to tab
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1, // Retry mutations once on failure
    },
  },
});
