import { Box, Container, Grid, Typography } from "@mui/material"
import { CustomerCard } from './CustomerCard';
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TabStyled } from "./info.style";
import { CustomerTabs } from "./TabPanel";

const CustomerInfo = () => {
  const [active, setActive] = useState("orders");
  const { t } = useTranslation();
  const { id } = useParams();
  const allParams = useAllQueryParams();

  const { data: customerInfoData, status: customerInfoStatus } = useApi(`customer/get-by-id/${id}`, {}, {
    enabled: !!id,
    suspense: false
  })


  const { mutate, data } = useApiMutation(
    "order/paging",
    "post",
    {
      onSuccess(response) {
      },
    }
  );

  const { mutate: customerReport, data: customerReportData } = useApiMutation(
    "order/customer/report",
    "post",
    {
      onSuccess(response) {
      },
    }
  );

  useEffect(() => {
    mutate({
      customerId: id,
      dateFrom: allParams.dateFrom,
      dateTo: allParams.dateTo
    });
  }, [allParams.dateFrom, allParams.dateTo]);

  useEffect(() => {
    customerReport({
      customerId: id,
      dateFrom: allParams.dateFrom,
      dateTo: allParams.dateTo
    });
  }, [allParams.dateFrom, allParams.dateTo]);

  return (
    <>
      {
        id && (
          <Grid className="grid md:grid-cols-2 gap-4 p-2">
            <CustomerCard
              customerInfoData={customerInfoData}
            />
            <CustomerTabs historyOrders={data?.data} customerReportData={customerReportData} />
          </Grid>
        )
      }
    </>
  )


}

export default CustomerInfo