import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Avatar, Box, Paper, Switch, Grid } from '@mui/material';
import { Mail, Phone } from '@mui/icons-material';
import { StarIcon } from 'assets/svgs';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface CourierCardProps {
    courierInfoData: any;
    offAndOn: any;
    offAndOnData: any;
    watch: any;
    register: any;
    setValue: any;
}

export const CourierCard: React.FC<CourierCardProps> = ({
    courierInfoData,
    offAndOn,
    offAndOnData, watch, register, setValue }) => {

    const { t } = useTranslation();
    const { id } = useParams();

    return (
        <Grid>
            <Box sx={{
                background: 'linear-gradient(135deg, #3E5089 0%, #4834A8 100%)',
                pt: 6,
                pb: 8,
                px: 4,
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px"
            }}>
                <Avatar
                    src={
                        process.env.REACT_APP_BASE_URL +
                        '/' +
                        courierInfoData?.data?.image?.url
                    }
                    sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        border: '4px solid white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.05)'
                        }
                    }}
                />
                <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                    {courierInfoData?.data?.fullName}
                </Typography>
            </Box>
            <CardContent sx={{
                backgroundColor: 'white',
                px: 4,
                py: 3
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    {/* <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        backgroundColor: '#F7FAFC',
                        borderRadius: 2,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                            transform: 'translateX(8px)'
                        }
                    }}>
                        <Mail style={{ fontSize: 20, color: '#6B46C1' }} />
                        <Typography variant="body1" color="text.primary">
                            {courierInfoData?.data?.phoneNumber}
                        </Typography>
                    </Box> */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        backgroundColor: '#F7FAFC',
                        borderRadius: 2,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                            transform: 'translateX(8px)'
                        }
                    }}>
                        <Phone style={{ fontSize: 20, color: '#6B46C1' }} />
                        <Typography variant="body1" color="text.primary">
                            {courierInfoData?.data?.phoneNumber}
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        backgroundColor: '#F7FAFC',
                        borderRadius: 2,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                            transform: 'translateX(8px)'
                        }
                    }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#546e7a',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <span style={{ fontWeight: 'bold', color: '#333333' }}>Reyting:</span>
                            <span style={{ fontSize: '0.9rem', color: 'goldenrod' }}>
                                {Number(courierInfoData?.data?.rating?.toFixed(1)) !== 5 ? courierInfoData?.data?.rating?.toFixed(1) : '5'}
                            </span>
                            <span style={{ fontSize: '0.9rem', color: 'goldenrod' }}> / 5</span>
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "space-between",
                        gap: 2,
                        p: 2,
                        backgroundColor: '#F7FAFC',
                        borderRadius: 2,
                    }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: watch("isOnline") ? 'green' : 'red' }}>
                            {watch("isOnline") ? t("general.online") : t("general.offline")}
                        </Typography>

                        <Switch
                            checked={watch("isOnline")}
                            id="isOnline"
                            {...register("isOnline")}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                setValue("isOnline", isChecked);
                                offAndOn({
                                    _id: id,
                                    isOnline: isChecked,
                                });
                            }}
                            sx={{
                                '& .MuiSwitch-thumb': {
                                    backgroundColor: watch("isOnline") ? 'green' : 'red',  // Custom color for thumb
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor: watch("isOnline") ? 'green' : 'red',  // Custom color for track
                                },
                            }}
                        />
                    </Box>
                </Box>
            </CardContent>
        </Grid>
    );
};