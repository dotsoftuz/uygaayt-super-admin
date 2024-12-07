import { useCallback, useRef } from 'react';

interface UseInfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
}

export const useInfiniteScroll = ({ onLoadMore, hasMore }: UseInfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const loading = useRef(false);

  const loadMoreRef = useCallback(
    (node: Element | null) => {
      if (!node || !hasMore) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading.current) {
          loading.current = true;
          onLoadMore();
          loading.current = false;
        }
      });

      observer.current.observe(node);
    },
    [hasMore, onLoadMore]
  );

  return {
    loadMoreRef,
    loading: loading.current,
  };
};