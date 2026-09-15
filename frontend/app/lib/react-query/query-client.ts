// src/lib/react-query/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ ५ मिनेटसम्म data fresh — automatic refetch हुँदैन
      staleTime: 5 * 60 * 1000,
      
      // ✅ ३० मिनेटसम्म cache मा रहन्छ
      gcTime: 30 * 60 * 1000,
      
      // ✅ Window focus हुँदा refetch नगर्ने
      refetchOnWindowFocus: false,
      
      // ✅ Component mount हुँदा refetch नगर्ने (cache छ भने)
      refetchOnMount: false,
      
      // ✅ Internet reconnect हुँदा refetch नगर्ने
      refetchOnReconnect: false,
      
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 0,
    },
  },
});