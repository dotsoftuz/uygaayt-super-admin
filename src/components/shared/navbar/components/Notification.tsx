import { Badge, IconButton, Popover } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationList } from './NotificationList';
import { useSearchParams } from 'react-router-dom';
import { useApiMutation } from 'hooks/useApi/useApiHooks';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useAppDispatch, useAppSelector } from 'store/storeHooks';
import { socketReRender } from 'store/reducers/SocketSlice';

const Notification = () => {
    const socketRender = useAppSelector((store) => store.SocketState.render);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const dis = useAppDispatch();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const [notifications, setNotifications] = useState<any[]>([]);
    const [notificationsTotal, setNotificationsTotal] = useState<any[]>([]);
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

                setNotifications(() => [...newNotifications]);
                setNotificationsTotal(total);
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

    
    useEffect(() => {
        if (socketRender) {
          reset();
          dis(socketReRender(false));
        }
      }, [socketRender, data]);

    return (
        <>
            <IconButton
                size="large"
                color="inherit"
                onClick={handleClick}
                aria-label="notifications"
            >
                <Badge badgeContent={notificationsTotal} color="primary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        width: 380,
                        maxHeight: '80vh',
                        mt: 1,
                    },
                }}
            >
                <NotificationList unreadCount={unreadCount} notifications={notifications} loadMoreRef={loadMoreRef} loading={loading} hasMore={hasMore} />
            </Popover>
        </>
    )
}



export default Notification