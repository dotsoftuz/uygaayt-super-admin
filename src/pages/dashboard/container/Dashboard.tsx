import { Grid, Typography } from '@mui/material'
import { RangeDatePicker } from 'components';
import { useApiMutation } from 'hooks/useApi/useApiHooks';
import useAllQueryParams from 'hooks/useGetAllQueryParams/useAllQueryParams';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { numberFormat } from 'utils/numberFormat';
import TopTable from '../components/TopTable';
import useCommonContext from 'context/useCommon';
import { get } from 'lodash';
import MainCharts from '../components/mainCharts/MainCharts';
import { StyledCard, TypographyTitle } from '../style/StatisticsCard.style';
import { formatMinutes } from '../../../utils/formatMinutes';

type SortField = 'total_price' | 'total_order';
type SortOrder = "1" | "-1";


const Dashboard = () => {
    const { t } = useTranslation();
    const allParams = useAllQueryParams();
    const currentLang = localStorage.getItem("i18nextLng") || "uz";
    const [sortFieldUser, setSortFieldUser] = useState<SortField>('total_price');
    const [sortOrderUser, setSortOrderUser] = useState<SortOrder>("1");

    const [sortFieldCourier, setSortFieldCourier] = useState<SortField>('total_order');
    const [sortOrderCourier, setSortOrderCourier] = useState<SortOrder>("1");

    const {
        state: { data: settingsData },
    } = useCommonContext();

    const { mutate: attributesChooseMutate, data: attributesData } = useApiMutation<any>(
        "report/order",
        "post",
        {},
        true
    );

    const { mutate: totalIncomeMutate, data: totalIncomeData } = useApiMutation("balance/total", "post", {
    }, true);

    const { mutate: customerMutate, data: customerData } = useApiMutation<any>(
        "report/customer/count",
        "post",
        {},
        true
    );


    const { mutate: courierMutate, data: couriersData } = useApiMutation<any>(
        "report/courier/top",
        "post",
        {},
        true
    );
    const { mutate: topCustomerMutate, data: topCustomerData } = useApiMutation<any>(
        "report/customer/top",
        "post",
        {},
        true
    );

    const mutations = [
        attributesChooseMutate,
        totalIncomeMutate,
        customerMutate,
        courierMutate,
        topCustomerMutate
    ];

    const mutateAll = () => {
        mutations.forEach(mutate => mutate({
            dateFrom: allParams.dateFrom,
            dateTo: allParams.dateTo
        }));
    };

    useEffect(mutateAll, [allParams.dateFrom, allParams.dateTo]);

    useEffect(() => {
        topCustomerMutate({
            dateFrom: allParams.dateFrom,
            dateTo: allParams.dateTo,
            sortBy: sortFieldUser,
            sortOrder: sortOrderUser
        });
    }, [sortFieldUser, sortOrderUser]);

    useEffect(() => {
        courierMutate({
            dateFrom: allParams.dateFrom,
            dateTo: allParams.dateTo,
            sortBy: sortFieldCourier,
            sortOrder: sortOrderCourier
        });
    }, [sortFieldCourier, sortOrderCourier]);


    const { mutate: customerReport, data: customerReportData } = useApiMutation(
        "report/customer/saved",
        "post",
        {
          onSuccess(response) {
          },
        }
      );
    
      useEffect(() => {
        customerReport({
          dateFrom: allParams.dateFrom,
          dateTo: allParams.dateTo
        });
      }, [allParams.dateFrom, allParams.dateTo]);

    return (
        <>
            <Grid className='bg-white p-2 flex rounded-lg'>
                <Grid className=''>
                    <RangeDatePicker />
                </Grid>
            </Grid>
            <Grid className='grid mt-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2'>
                <StyledCard>
                    <TypographyTitle>
                        {t("dashboard.total_orders")}
                    </TypographyTitle>
                    <Typography
                        style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            textAlign: "center",
                            color: '#FF6701'
                        }}
                    >{attributesData?.data?.total_amount}</Typography>
                </StyledCard>
                {attributesData?.data?.states.map((item: any) => (
                    <StyledCard>
                        <TypographyTitle>
                            {item.state?.state === "completed" ? t('dashboard.completed_orders') : t('dashboard.cancelled_orders')}
                        </TypographyTitle>
                        <Typography
                            style={{
                                fontSize: "24px",
                                fontWeight: 600,
                                textAlign: "center",
                                color: '#FF6701'
                            }}>{item.total_amount}</Typography>
                    </StyledCard>
                ))}

                <StyledCard>
                    <TypographyTitle>
                        {t("dashboard.total_income")}
                    </TypographyTitle>
                    <Typography
                        style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            textAlign: "center",
                            color: '#FF6701'
                        }}>
                        {numberFormat(totalIncomeData?.data?.income)} {get(settingsData, "currency", "uzs")}
                    </Typography>
                </StyledCard>

                <StyledCard
                >
                    <TypographyTitle>
                        {t("dashboard.registered_customer")}
                    </TypographyTitle>
                    <Typography
                        style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            textAlign: "center",
                            color: '#FF6701'
                        }}>{customerData?.data?.registered}</Typography>
                </StyledCard>

                <StyledCard
                >
                    <TypographyTitle>
                        {t("dashboard.active_customer")}
                    </TypographyTitle>
                    <Typography
                        style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            textAlign: "center",
                            color: '#FF6701'
                        }}>{customerData?.data?.active}</Typography>
                </StyledCard>

                <StyledCard>
                    <TypographyTitle>
                        {t("dashboard.sold_product")}
                    </TypographyTitle>
                    <Typography
                        style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            textAlign: "center",
                            color: '#FF6701'
                        }}
                    >{attributesData?.data?.productCount}</Typography>
                </StyledCard>

                <StyledCard>
                    <TypographyTitle>
                        {t("dashboard.customers_saved_time")}
                    </TypographyTitle>
                    <Typography
                        style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            textAlign: "center",
                            color: '#FF6701'
                        }}
                    >{formatMinutes(customerReportData?.data?.saved_time)}</Typography>
                </StyledCard>

                <StyledCard>
                    <TypographyTitle>
                        {t("dashboard.customers_saved_amount")}
                    </TypographyTitle>
                    <Typography
                        style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            textAlign: "center",
                            color: '#FF6701'
                        }}
                    >{numberFormat(customerReportData?.data?.saved_amount)} {get(settingsData, "currency", "uzs")}</Typography>
                </StyledCard>
                <StyledCard>
                    <TypographyTitle>
                        {t("general.all_discounts_summ")}
                    </TypographyTitle>
                    <Typography
                        style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            textAlign: "center",
                            color: '#FF6701'
                        }}>
                        {numberFormat(attributesData?.data?.total_discount)} {get(settingsData, "currency", "uzs")}
                    </Typography>
                </StyledCard>
                <StyledCard>
                    <TypographyTitle>
                        {t("general.all_promocode_summ")}
                    </TypographyTitle>
                    <Typography
                        style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            textAlign: "center",
                            color: '#FF6701'
                        }}>
                        {numberFormat(attributesData?.data?.total_promocode)} {get(settingsData, "currency", "uzs")}
                    </Typography>
                </StyledCard>
            </Grid>

            <Grid className='p-2 bg-white mt-2 rounded-lg'>
                <MainCharts data={attributesData?.data?.states} all_orders={attributesData?.data?.total_amount} />
            </Grid>

            <Grid className='grid mt-2 md:grid-cols-2 gap-4'>
                <div className='bg-white rounded-lg'>
                    <p className='font-semibold text-lg p-3'>{t('dashboard.top_users')}</p>
                    <TopTable data={topCustomerData?.data} setSortField={setSortFieldUser} sortField={sortFieldUser} setSortOrder={setSortOrderUser} sortOrder={sortOrderUser} />
                </div>
                <div className='bg-white rounded-lg'>
                    <p className='font-semibold text-lg p-3'>{t('dashboard.top_courier')}</p>
                    <TopTable data={couriersData?.data} setSortField={setSortFieldCourier} sortField={sortFieldCourier} setSortOrder={setSortOrderCourier} sortOrder={sortOrderCourier} />
                </div>
            </Grid>
        </>
    )
}

export default Dashboard