import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useInfiniteScroll({ onLoadMore, hasMore }: UseInfiniteScrollProps) {
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement) return;

    observerRef.current = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          setLoading(true);
          await onLoadMore();
          setLoading(false);
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loadMoreElement);

    return () => {
      if (observerRef.current && loadMoreElement) {
        observerRef.current.unobserve(loadMoreElement);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  return { loadMoreRef, loading };
}