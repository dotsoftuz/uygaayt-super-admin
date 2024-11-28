import { Badge, IconButton, Popover } from '@mui/material'
import React, { useState } from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationList } from './NotificationList';

const Notification = () => {

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
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
                <Badge badgeContent={2} color="primary">
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
                <NotificationList />
            </Popover>
        </>
    )
}



export default Notification