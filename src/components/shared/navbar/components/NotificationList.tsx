import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { NotificationItem } from './NotificationItem';
import { useTranslation } from 'react-i18next';
import { NotificationType } from '../types/notification';

interface NotificationListProps {
  notifications: NotificationType[];
  unreadCount: number;
  loadMoreRef: any;
  loading: boolean;
  hasMore: boolean;
  onNotificationRead: (id: string) => void;
  refreshNotifications: any;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  unreadCount,
  loadMoreRef,
  loading,
  hasMore,
  onNotificationRead,
  refreshNotifications
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{t('general.notifications')}</Typography>
        {unreadCount > 0 && (
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
            {unreadCount} {t('new')}
          </Typography>
        )}
      </Box>
      <Divider />
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {notifications?.length > 0 ? (
          notifications.map((notification, index) => (
            <Box key={notification.id}>
              <NotificationItem
                notification={notification}
                onRead={onNotificationRead}
                refreshNotifications={refreshNotifications}
              />
              {index < notifications.length - 1 && <Divider />}
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            {t('general.no_notifications')}
          </Typography>
        )}
        <Box ref={loadMoreRef} sx={{ p: 2, textAlign: 'center' }}>
          {loading && <CircularProgress size={24} />}
          {!hasMore && notifications.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {t('general.no_more_notifications')}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};