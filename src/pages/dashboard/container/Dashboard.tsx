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

type SortField = 'total_price' | 'total_order';
type SortOrder = 1 | -1;


const Dashboard = () => {
    const { t } = useTranslation();
    const allParams = useAllQueryParams();
    const currentLang = localStorage.getItem("i18nextLng") || "uz";
    const [sortFieldUser, setSortFieldUser] = useState<SortField>('total_price');
    const [sortOrderUser, setSortOrderUser] = useState<SortOrder>(1);

    const [sortFieldCourier, setSortFieldCourier] = useState<SortField>('total_order');
    const [sortOrderCourier, setSortOrderCourier] = useState<SortOrder>(1);

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

    return (
        <>
            <Grid className='bg-white p-2 flex'>
                <Grid className=''>
                    <RangeDatePicker />
                </Grid>
            </Grid>
            <Grid className='grid mt-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2'>
                <div
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 6px 4px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 0px 0px rgba(0, 0, 0, 0.1)";
                    }}
                    className='bg-white p-3 rounded-lg transition-shadow duration-200 ease-in-out'>
                    {/* <h4>{get(data, "data.totalClasses")}</h4> */}
                    <h4 className="font-bold text-xl">{attributesData?.data?.total_amount}</h4>
                    <Typography color={"#999999"} fontSize={"14px"}>
                        {t("dashboard.total_orders")}
                    </Typography>
                </div>
                {attributesData?.data?.states.map((item: any) => (
                    <div
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 6px 4px rgba(0, 0, 0, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "0 0px 0px rgba(0, 0, 0, 0.1)";
                        }}
                        className='bg-white p-3 rounded-lg transition-shadow duration-200 ease-in-out'>
                        {/* <h4>{get(data, "data.totalClasses")}</h4> */}
                        <h4 className="font-bold text-xl">{item.total_amount}</h4>
                        <Typography color={"#999999"} fontSize={"14px"}>
                            {item.state?.state === "completed" ? t('dashboard.completed_orders') : t('dashboard.cancelled_orders')}
                        </Typography>
                    </div>
                ))}

                <div
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 6px 4px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 0px 0px rgba(0, 0, 0, 0.1)";
                    }}
                    className='bg-white p-3 rounded-lg transition-shadow duration-200 ease-in-out'>
                    {/* <h4>{get(data, "data.totalClasses")}</h4> */}
                    <h4 className="font-bold text-xl">{numberFormat(totalIncomeData?.data?.income)} {get(settingsData, "currency", "uzs")}</h4>
                    <Typography color={"#999999"} fontSize={"14px"}>
                        {t("dashboard.total_income")}
                    </Typography>
                </div>

                <div
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 6px 4px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 0px 0px rgba(0, 0, 0, 0.1)";
                    }}
                    className='bg-white p-3 rounded-lg transition-shadow duration-200 ease-in-out'>
                    {/* <h4>{get(data, "data.totalClasses")}</h4> */}
                    <h4 className="font-bold text-xl">{customerData?.data?.registered}</h4>
                    <Typography color={"#999999"} fontSize={"14px"}>
                        {t("dashboard.registered_customer")}
                    </Typography>
                </div>

                <div
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 6px 4px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 0px 0px rgba(0, 0, 0, 0.1)";
                    }}
                    className='bg-white p-3 rounded-lg transition-shadow duration-200 ease-in-out'>
                    {/* <h4>{get(data, "data.totalClasses")}</h4> */}
                    <h4 className="font-bold text-xl">{customerData?.data?.active}</h4>
                    <Typography color={"#999999"} fontSize={"14px"}>
                        {t("dashboard.active_customer")}
                    </Typography>
                </div>

            </Grid>
            <Grid className='grid mt-5 md:grid-cols-2 gap-4'>
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