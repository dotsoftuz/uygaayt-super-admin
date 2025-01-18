import { CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t } = useTranslation();

    return (
        <>
            <Grid className='grid  md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
                {
                    Array.from({ length: 10 }).map((item) => (
                        <div
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = "0 6px 4px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "0 0px 0px rgba(0, 0, 0, 0.1)";
                            }}
                            className='bg-white p-3 rounded-lg transition-shadow duration-200 ease-in-out'>
                            {/* <h4>{get(data, "data.totalClasses")}</h4> */}
                            <h4 className="font-bold text-xl">10</h4>
                            <Typography color={"#999999"} fontSize={"14px"}>
                                {t("dashboard.total_classes")}
                            </Typography>
                        </div>
                    ))
                }

            </Grid>
        </>
    )
}

export default Dashboard