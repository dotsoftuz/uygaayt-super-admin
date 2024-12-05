import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { NotificationItem } from './NotificationItem';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useApiMutation } from 'hooks/useApi/useApiHooks';
import { useSearchParams } from 'react-router-dom';

export function NotificationList(props: any) {

    const { notifications, unreadCount, loadMoreRef, loading, hasMore , reset} = props

    console.log(notifications)

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
                    {/* {unreadCount} yangi */}
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {notifications?.map((notification: any, index: any) => (
                    <Box key={notification.id}>
                        <NotificationItem reset={reset} notification={notification} />
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
