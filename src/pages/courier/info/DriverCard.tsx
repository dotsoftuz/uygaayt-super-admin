import { Box, Card, CardContent, Switch, Typography } from "@mui/material"
import { StarIcon } from "assets/svgs"
import { InfoSection } from "./InfoSelection"

const DriverCard = ({ courierInfoData}: any) => {

    return (
        <Card sx={{
            width: '100%',
            boxShadow: "none",
        }}>
            <CardContent sx={{ p: 4, }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography variant="h4" sx={{
                                fontWeight: 700,
                                textTransform: 'capitalize',
                                color: '#EB5B00'
                            }}>
                                {courierInfoData?.fullName}
                            </Typography>
                            <Box sx={{
                                bgcolor: '#e3f2fd',
                                p: 1,
                                borderRadius: '50%',
                                display: 'flex',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: '#bbdefb'
                                }
                            }}>
                                {/* <Edit size={20} color="#2196F3" /> */}
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1" sx={{ color: '#546e7a' }}>
                                {courierInfoData?.phoneNumber}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <StarIcon  />
                                <Typography variant="body2" sx={{ color: '#546e7a' }}>
                                    {courierInfoData?.rating}/5
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    {/* <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: '#4CAF50',
                        color: 'white',
                        py: 1.5,
                        px: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(76,175,80,0.2)'
                    }}>
                        <Typography variant="h6" sx={{ mr: 2, fontWeight: 600 }}>
                            8 999.0 So'm
                        </Typography>
                        <Switch size="small" defaultChecked sx={{
                            '& .MuiSwitch-thumb': { bgcolor: 'white' },
                            '& .MuiSwitch-track': { bgcolor: 'rgba(255,255,255,0.3)' }
                        }} />
                    </Box> */}
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: 6,
                    '& > div': {
                        flex: 1,
                        bgcolor: '#edf7fd',
                        p: 3,
                        borderRadius: 3,
                        transition: 'all 0.2s',
                    }
                }}>
                    {/* <Box>
                        <Typography variant="h6" sx={{ mb: 3, color: '#1a237e', fontWeight: 600 }}>
                            Shaxsiy ma'lumotlar
                        </Typography>
                        <InfoSection data={{
                            "Shahar": courierInfoData?.city,
                            "Agent": courierInfoData?.agent,
                            "Tug'ilgan joy": courierInfoData?.birthPlace,
                            "Reyting": courierInfoData?.rating,
                            "Faoliyat": courierInfoData?.activity,
                            "Tug'ilgan sana": courierInfoData?.birthDate,
                            "INN": courierInfoData?.inn,
                            "JSHSHIR": courierInfoData?.jshshir,
                            "Haydovchi ID": courierInfoData?.driverId
                        }} />
                    </Box> */}

                    <Box>
                        <Typography variant="h6" sx={{ mb: 3, color: '#1a237e', fontWeight: 600 }}>
                            Avtomabil ma'lumotlari
                        </Typography>
                        <InfoSection data={{
                            "Brend": courierInfoData?.carBrand,
                            "Model": courierInfoData?.carModel,
                            "Rang": courierInfoData?.carColor,
                            "Raqam": courierInfoData?.carNumber,
                        }} />
                    </Box>

                    {/* <Box>
                        <Typography variant="h6" sx={{ mb: 3, color: '#1a237e', fontWeight: 600 }}>
                            Guvohnoma ma'lumotlari
                        </Typography>
                        <InfoSection data={{
                            "Seriya raqami": courierInfoData?.serialNumber,
                            "Berilgan sana": courierInfoData?.issueDate,
                            "Amal qilish muddati": courierInfoData?.expiryDate,
                            "Berilgan mamlakat": courierInfoData?.issuingCountry,
                            "Qurilma IMEI": courierInfoData?.imei,
                            "Qurilma malumoti": courierInfoData?.deviceInfo,
                            "Versiya": courierInfoData?.version
                        }} />
                    </Box> */}
                </Box>
            </CardContent>
        </Card>

    )
}

export default DriverCard