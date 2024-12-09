import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Paper } from '@mui/material';
import { Mail, Phone } from '@mui/icons-material';
import CustomerInfo from './CustomerInfo';

interface CustomerCardProps {
    customerInfoData: any
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
    customerInfoData, }) => {


    console.log(customerInfoData)
    return (
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{
                background: 'linear-gradient(135deg, #3E5089 0%, #4834A8 100%)',
                pt: 6,
                pb: 8,
                px: 4,
                textAlign: 'center',
                color: 'white',
                position: 'relative'
            }}>
                <Avatar
                    src={
                        process.env.REACT_APP_BASE_URL +
                        '/' +
                        customerInfoData?.data?.image?.url
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
                    {customerInfoData?.data?.firstName}
                </Typography>
            </Box>
            <CardContent sx={{
                backgroundColor: 'white',
                borderRadius: '20px 20px 0 0',
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
                            {customerInfoData?.data?.phoneNumber}
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
                            {customerInfoData?.data?.phoneNumber}
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
                        <Typography variant="body1" color="text.primary">
                            {customerInfoData?.data?.isPremium
                                ? "Ushbu mijoz Premium obunasini sotib olgan."
                                : "Ushbu mijoz hali Premium obunasini sotib olmagan."}
                        </Typography>

                    </Box>
                </Box>
            </CardContent>
        </Paper>
    );
};