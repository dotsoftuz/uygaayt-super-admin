import { CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t } = useTranslation();

    return (
        <>
            <Grid className='grid  md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
                <div className='bg-white p-3 rounded-lg'>
                    {/* <h4>{get(data, "data.totalClasses")}</h4> */}
                    <h4 className="font-bold text-xl">10</h4>
                    <Typography color={"#999999"} fontSize={"14px"}>
                        {t("dashboard.total_classes")}
                    </Typography>
                </div>
                <div className='bg-white p-3 rounded-lg'>
                    {/* <h4>{get(data, "data.totalClasses")}</h4> */}
                    <h4 className="font-bold text-xl">10</h4>
                    <Typography color={"#999999"} fontSize={"14px"}>
                        {t("dashboard.total_classes")}
                    </Typography>
                </div>
                <div className='bg-white p-3 rounded-lg'>
                    {/* <h4>{get(data, "data.totalClasses")}</h4> */}
                    <h4 className="font-bold text-xl">10</h4>
                    <Typography color={"#999999"} fontSize={"14px"}>
                        {t("dashboard.total_classes")}
                    </Typography>
                </div>
                <div className='bg-white p-3 rounded-lg'>
                    {/* <h4>{get(data, "data.totalClasses")}</h4> */}
                    <h4 className="font-bold text-xl">10</h4>
                    <Typography color={"#999999"} fontSize={"14px"}>
                        {t("dashboard.total_classes")}
                    </Typography>
                </div>
                <div className='bg-white p-3 rounded-lg'>
                    {/* <h4>{get(data, "data.totalClasses")}</h4> */}
                    <h4 className="font-bold text-xl">10</h4>
                    <Typography color={"#999999"} fontSize={"14px"}>
                        {t("dashboard.total_classes")}
                    </Typography>
                </div>
                <div className='bg-white p-3 rounded-lg'>
                    {/* <h4>{get(data, "data.totalClasses")}</h4> */}
                    <h4 className="font-bold text-xl">10</h4>
                    <Typography color={"#999999"} fontSize={"14px"}>
                        {t("dashboard.total_classes")}
                    </Typography>
                </div>
            </Grid>
        </>
    )
}

export default Dashboard