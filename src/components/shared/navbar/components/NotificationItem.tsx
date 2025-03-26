import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ImageIcon from '@mui/icons-material/Image';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useApiMutation } from 'hooks/useApi/useApiHooks';
import { NotificationType } from '../types/notification';

const AcceptButton = styled(Button)(() => ({
  backgroundColor: "green",
  color: "white",
  '&:hover': {
    backgroundColor: "black",
  },
}));

const AcceptedButton = styled(Button)(() => ({
  backgroundColor: "red",
  color: "white",
  '&:hover': {
    backgroundColor: "gray",
  },
}));

function getIcon(type: string) {
  switch (type) {
    case 'yangi_mashina':
      return <ImageIcon fontSize="small" />;
    case 'yangi_haydovchi':
      return <PersonIcon fontSize="small" />;
    default:
      return <NotificationsIcon fontSize="small" />;
  }
}

interface NotificationItemProps {
  notification: any;
  onRead: (id: string) => void;
  refreshNotifications: any;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead, refreshNotifications }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentLang = localStorage.getItem("i18nextLng") || "uz";

  const { mutate: acceptCourier, isLoading } = useApiMutation(
    `courier/accept/${notification?.documentId}`,
    "get",
    {
      onSuccess() {
        onRead(notification._id);
        refreshNotifications()
        toast.success("Tasdiqlandi!");
      },
    }
  );

  const handleAcceptClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onRead(notification._id);
    acceptCourier({});
  };

  const handleItemClick = () => {
    if (notification?.type === "courier_arrived") {
      navigate(`/courier/${notification?.courierId}`);
    } else {
      onRead(notification._id);
      navigate('/product');
    }
  };


  return (
    <Box
      sx={{
        display: 'flex',
        p: 2,
        gap: 2,
        '&:hover': {
          bgcolor: 'action.hover',
        },
        cursor: 'pointer'
      }}
      onClick={handleItemClick}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          width: 40,
          height: 40,
          bgcolor: notification?.isRead ? 'action.selected' : '#EB5B00',
          color: notification?.isRead ? 'text.secondary' : 'white',
        }}
      >
        {getIcon(notification?.type)}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {notification?.shortText?.[currentLang]}
        </Typography> 

        {notification?.type === "courier_arrived" && (
          <Box my={1}>
            {!notification?.isRead ? (
              <AcceptButton
                disabled={isLoading}
                variant="contained"
                onClick={handleAcceptClick}
              >
                {t("notification.confirmation")}
              </AcceptButton>
            ) : (
              <AcceptedButton variant="contained" disabled>
                {t("notification.approved")}
              </AcceptedButton>
            )}
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" my={1}>
          {dayjs(notification?.date).format('DD.MM.YYYY HH:mm')}
        </Typography>
      </Box>
    </Box>
  );
};