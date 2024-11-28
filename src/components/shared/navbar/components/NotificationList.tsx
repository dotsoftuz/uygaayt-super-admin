import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { NotificationItem } from './NotificationItem';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useApiMutation } from 'hooks/useApi/useApiHooks';
import { useSearchParams } from 'react-router-dom';

export function NotificationList() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchParams] = useSearchParams();

    const queryParams = {
        page: searchParams.get('page') || 1,
        limit: searchParams.get('limit') || 10,
        search: searchParams.get('search') || '',
    };

    const { mutate, reset, data, isLoading } = useApiMutation(
        'notification/paging',
        'post',
        {
            onSuccess(response) {
                const newNotifications = response?.data?.data || [];
                const total = response?.data?.total || 0;

                setNotifications((prev) => [...prev, ...newNotifications]);
                setHasMore(newNotifications.length > 0 && notifications.length < total);
            },
        }
    );

    const loadMore = async () => {
        if (!hasMore || isLoading) return;
        const nextPage = page + 1;

        setPage(nextPage);

        await mutate({
            page: nextPage,
            limit: queryParams.limit,
            search: queryParams.search,
        });
    };

    const { loadMoreRef, loading } = useInfiniteScroll({
        onLoadMore: loadMore,
        hasMore,
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    useEffect(() => {
        reset();
        setPage(1);
        setNotifications([]);
        setHasMore(true);

        mutate({
            page: 1,
            limit: queryParams.limit,
            search: queryParams.search,
        });
    }, [searchParams, reset, mutate, queryParams.limit, queryParams.search]);

    return (
        <Box>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Bildirishnomalar</Typography>
                <Typography
                    variant="caption"
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 8,
                    }}
                >
                    {unreadCount} yangi
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {notifications.map((notification, index) => (
                    <Box key={notification.id}>
                        <NotificationItem notification={notification} />
                        {index < notifications.length - 1 && <Divider />}
                    </Box>
                ))}
                <Box ref={loadMoreRef} sx={{ p: 2, textAlign: 'center' }}>
                    {loading && <CircularProgress size={24} />}
                    {!hasMore && notifications.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                            Boshqa bildirishnomalar yo'q
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
