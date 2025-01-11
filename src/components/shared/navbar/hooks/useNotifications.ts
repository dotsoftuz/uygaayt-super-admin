import { useState, useEffect, useCallback } from 'react';
import { NotificationState } from '../types/notification';
import { useAppDispatch } from 'store/storeHooks';
import { useApiMutation } from 'hooks/useApi/useApiHooks';
import { socketReRender } from 'store/reducers/SocketSlice';
import { socket } from 'socket';

const ITEMS_PER_PAGE = 10;

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    total: 0,
    unreadCount: 0,
    page: 1,
    hasMore: true,
    isLoading: false,
  });

  const { mutate: fetchNotifications, reset } = useApiMutation<any>(
    'notification/paging',
    'post',
    {
      onSuccess: (response) => {
        const newNotifications = response.data.data || [];
        const total = response?.data.total || 0;
        const unreadCount = response?.data?.unreadCount || 0;

        setState((prev) => ({
          ...prev,
          notifications: prev.page === 1
            ? newNotifications // replace if it's the first page
            : [...prev.notifications, ...newNotifications], // append if it's not the first page
          total,
          unreadCount: prev.page === 1 ? unreadCount : prev.unreadCount + unreadCount,
          hasMore: newNotifications.length === ITEMS_PER_PAGE, // check if there are more pages
          isLoading: false,
        }));
      },
      onError: () => {
        setState((prev) => ({ ...prev, isLoading: false }));
      },
    }
  );

  // Fetch notifications when the component mounts
  const refreshNotifications = useCallback(() => {
    setState((prev) => ({ ...prev, page: 1, hasMore: true, isLoading: true }));
    reset(); // Reset any previous state for the API
    fetchNotifications({
      page: 1,
      limit: ITEMS_PER_PAGE,
      search: '',
    });
  }, [fetchNotifications, reset]);

  // Handle new notifications from the socket
  useEffect(() => {
    const handleNewNotification = (data: { data: any }) => {
      dispatch(socketReRender(true));
  
      setState((prev) => ({
        ...prev,
        notifications: [data.data, ...prev.notifications], // Prepend new notifications
        total: prev.total + 1,
        unreadCount: prev.unreadCount + 1,
      }));
  
      // Refresh the notifications to ensure the latest ones are reflected
      refreshNotifications();
    };
  
    socket.on('notification', handleNewNotification);
  
    return () => {
      socket.off('notification', handleNewNotification);
    };
  }, [dispatch, refreshNotifications]);

  // Load more notifications when the user scrolls or requests more
  const loadMore = useCallback(async () => {
    if (state.isLoading || !state.hasMore) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await fetchNotifications({
        page: state.page + 1,
        limit: ITEMS_PER_PAGE,
        search: '',
      });

      setState((prev) => ({ ...prev, page: prev.page + 1 }));
    } catch (error) {
      console.error('Failed to load more notifications:', error);
    }
  }, [state.isLoading, state.hasMore, state.page, fetchNotifications]);

  // Mark a notification as read
  const { mutate: markAsRead } = useApiMutation(
    'notification/mark-read',
    'post',
    {
      onSuccess: () => {
        refreshNotifications();
      },
    }
  );

  const handleNotificationRead = async (notificationId: string) => {
    await markAsRead({ _id: notificationId });
    refreshNotifications();
  };

  // Fetch notifications when the component mounts or when the socket is updated
  useEffect(() => {
    if (state.page === 1) {
      refreshNotifications();
    }
  }, [state.page, refreshNotifications]);

  return {
    ...state,
    loadMore,
    refreshNotifications,
    handleNotificationRead,
  };
};
