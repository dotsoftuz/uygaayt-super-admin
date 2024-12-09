import { useState, useEffect, useCallback } from 'react';
import { NotificationState, NotificationResponse } from '../types/notification';
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
        // @ts-ignore
        const total = response?.total || 0;
        const unreadCount = newNotifications.filter((n:any) => !n.isRead).length;
        console.log(unreadCount)

        setState((prev) => ({
          ...prev,
          notifications:
            prev.page === 1
              ? newNotifications
              : [...prev.notifications, ...newNotifications],
          total,
          unreadCount: prev.page === 1 ? unreadCount : prev.unreadCount + unreadCount,
          hasMore: newNotifications.length === ITEMS_PER_PAGE,
          isLoading: false,
        }));
      },
      onError: () => {
        setState((prev) => ({ ...prev, isLoading: false }));
      },
    }
  );

  const { mutate: markAsRead } = useApiMutation(
    'notification/mark-read',
    'post',
    {
      onSuccess: (response) => {
       
      },
    }
  );

  const handleNotificationRead = async (notificationId: string) => {
    console.log(notificationId)
    // if (!state.notifications.find(n => n.id === notificationId)?.isRead) {
      await markAsRead({ _id: notificationId });
    // }
  };

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

  const refreshNotifications = useCallback(() => {
    setState((prev) => ({ ...prev, page: 1, hasMore: true }));
    reset();
    fetchNotifications({
      page: 1,
      limit: ITEMS_PER_PAGE,
      search: '',
    });
  }, [fetchNotifications, reset]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    const handleNewNotification = (data: { data: any }) => {
      dispatch(socketReRender(true));
      setState((prev) => ({
        ...prev,
        notifications: [data.data, ...prev.notifications],
        total: prev.total + 1,
        unreadCount: prev.unreadCount + 1,
      }));
    };

    socket.on('notification', handleNewNotification);
    return () => {
      socket.off('notification', handleNewNotification);
    };
  }, [dispatch]);

  return {
    ...state,
    loadMore,
    refreshNotifications,
    handleNotificationRead,
  };
};