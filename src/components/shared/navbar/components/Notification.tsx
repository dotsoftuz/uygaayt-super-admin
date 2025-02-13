import React, { useState } from 'react';
import { Badge, IconButton, Popover } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationList } from './NotificationList';
import { useNotifications } from '../hooks/useNotifications';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { 
    notifications, 
    unreadCount,
    hasMore, 
    loadMore,
    refreshNotifications,
    handleNotificationRead 
  } = useNotifications();
  
  const { loadMoreRef, loading } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    refreshNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        size="large"
        color="inherit"
        onClick={handleClick}
        aria-label="notifications"
      >
        <Badge badgeContent={unreadCount} color="warning">
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
        <NotificationList
          notifications={notifications}
          unreadCount={unreadCount}
          loadMoreRef={loadMoreRef}
          loading={loading}
          hasMore={hasMore}
          onNotificationRead={handleNotificationRead}
          refreshNotifications={refreshNotifications}
        />
      </Popover>
    </>
  );
};

export default Notification;