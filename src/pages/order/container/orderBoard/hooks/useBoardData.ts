import { useState, useEffect } from 'react';
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { IOrderByStatus } from '../OrderBoard.constants';

export const useBoardData = (allParams: any) => {
  const [boardData, setBoardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: lanesData, status } = useApi<IOrderByStatus[]>(
    "order-state/get-all",
    {
      ...allParams,
    },
    { 
      suspense: false,
      onError: (err) => {
        setError('Failed to fetch lanes');
        setLoading(false);
      }
    }
  );

  const { mutate: fetchOrders } = useApiMutation("order/paging", "post", {
    onSuccess({ data: orderData }) {
      if (!orderData?.data) {
        return;
      }

      if (loadingMore) {
        setBoardData(prev =>
          prev.map(lane => {
            if (lane._id === loadingMore) {
              const existingOrderIds = new Set(lane.orders?.map((order: any) => order._id));
              const newOrders = orderData.data.filter((order: any) => !existingOrderIds.has(order._id));
              
              return {
                ...lane,
                orders: [...(lane.orders || []), ...newOrders],
                hasMore: newOrders.length === 10, // Assuming 10 is the page size
              };
            }
            return lane;
          })
        );
        setLoadingMore("");
      } else {
        setBoardData(prev =>
          prev.map(lane => {
            if (!lane.orders?.length) {
              return {
                ...lane,
                orders: orderData.data || [],
                hasMore: orderData.data.length === 10,
              };
            }
            return lane;
          })
        );
      }
    },
    onError(error) {
      setError('Failed to fetch orders');
      setLoadingMore("");
      setLoading(false);
    },
  });

  useEffect(() => {
    if (status === "success" && lanesData?.data) {
      setBoardData(lanesData.data.map(lane => ({ ...lane, orders: [], hasMore: true })));
      
      // Fetch initial orders for each lane
      lanesData.data.forEach(lane => {
        fetchOrders({
          page: 1,
          limit: 10,
          stateId: lane._id,
          hasCourier: true,
        });
      });
    }
  }, [status, lanesData]);

  useEffect(() => {
    if (boardData.length > 0) {
      const allLanesHaveInitialData = boardData.every(lane => Array.isArray(lane.orders));
      if (allLanesHaveInitialData) {
        setLoading(false);
      }
    }
  }, [boardData]);

  const handleLoadMore = (laneId: string) => {
    if (loadingMore || !laneId) return;

    const currentLane = boardData.find(lane => lane._id === laneId);
    if (!currentLane?.hasMore) return;

    setLoadingMore(laneId);
    const currentPage = Math.ceil((currentLane?.orders?.length || 0) / 10) + 1;

    fetchOrders({
      page: currentPage,
      limit: 10,
      stateId: laneId,
      hasCourier: true,
    });
  };

  return {
    boardData,
    loading,
    loadingMore,
    error,
    handleLoadMore,
  };
};