import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ImageIcon from '@mui/icons-material/Image';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CommonButton from 'components/common/commonButton/Button';
import { useApi, useApiMutation } from 'hooks/useApi/useApiHooks';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function getIcon(type: any) {
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
}

const AcceptButton = styled(Button)(({ theme }) => ({
    backgroundColor: "green",
    color: "white",
    '&:hover': {
        backgroundColor: "black",
    },
}));

// Custom styled button for 'accepted' state
const AcceptedButton = styled(Button)(({ theme }) => ({
    backgroundColor: "red",
    color: "white",
    '&:hover': {
        backgroundColor: "gray",
    },
}));


export function NotificationItem({ notification }: NotificationItemProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const currentLang = localStorage.getItem("i18nextLng") || "uz";


    const { mutate, reset } = useApiMutation(`courier/accept/${notification.documentId}`, "get", {
        onSuccess(data) {
            console.log("Success:", data);
            reset();
        },
    });

    const handleAcceptClick = () => {
        mutate({})
    };

    console.log(notification)

    return (
        <Box
            sx={{
                display: 'flex',
                p: 2,
                gap: 2,
                '&:hover': {
                    bgcolor: 'action.hover',
                },
            }}
            onClick={() => navigate(`/courier/${notification.courierId}`)}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    bgcolor: notification.read ? 'action.selected' : 'primary.main',
                    color: notification.read ? 'text.secondary' : 'white',
                }}
            >
                {getIcon(notification.type)}
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {notification.shortText?.[currentLang]}:{' '}
                </Typography>
                {notification?.isRead !== undefined && notification.isRead === false ? (
                    <AcceptButton variant="contained" onClick={handleAcceptClick}>
                        {t("notification.confirmation")}
                    </AcceptButton>
                ) : notification?.isRead !== undefined ? (
                    <AcceptedButton variant="contained" disabled>
                        {t("notification.approved")}
                    </AcceptedButton>
                ) : null}

                {/* <Typography variant="body2" color="text.secondary">
                    {notification.date} | {notification.time}
                </Typography> */}
            </Box>
        </Box>
    );
}