import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      cacheTime: 1000 * 60 * 3, // 3 minute
      retry: false,
      suspense: true,
    },
  },
});
