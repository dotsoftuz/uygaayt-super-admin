import { Box, Container, Grid, Typography } from "@mui/material"
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TabStyled } from "./info.style";
import { CourierCard } from "./CouirierCard";
import { CourierTabs } from "./TabPanel";
import { useForm } from "react-hook-form";


const CourierInfo = () => {
  const [active, setActive] = useState("orders");
  const { t } = useTranslation();
  const { id } = useParams();
  const { control, watch, register, handleSubmit, setValue } = useForm();
  const allParams = useAllQueryParams();


  const { data: courierInfoData, status: courierInfoStatus } = useApi(`courier/get-by-id/${id}`, {}, {
    enabled: !!id,
    suspense: false,
  })

  const { mutate, data } = useApiMutation(
    "order/paging",
    "post",
    {},
    true
  );

  useEffect(() => {
    // Parametrlarni saqlashda `isCourierLeft` ning turini yaxshilab tekshiramiz.
    const isCourierLeft = allParams.isCourierLeft === 'true'; // string bo'lsa, true'ga o'zgartiramiz

    mutate({
      courierId: id,
      dateFrom: allParams.dateFrom,
      dateTo: allParams.dateTo,
      isCourierLeft: isCourierLeft,
    });
  }, [allParams.dateFrom, allParams.dateTo, allParams.isCourierLeft]);


  // courier online or offline

  const { mutate: offAndOn, data: offAndOnData } = useApiMutation(
    "courier/set-online",
    "post",
  );

  useEffect(() => {
    if (courierInfoData?.data?.isOnline !== undefined) {
      setValue("isOnline", courierInfoData.data.isOnline);
    }
  }, [courierInfoData, setValue]);


  return (
    <>
      {
        id && (
          <Grid className="grid md:grid-cols-2 gap-4 p-2">
            <CourierCard
              courierInfoData={courierInfoData}
              offAndOn={offAndOn}
              offAndOnData={offAndOnData}
              watch={watch}
              register={register}
              setValue={setValue}
            />
            <CourierTabs historyOrders={data?.data} courierInfoData={courierInfoData} />
          </Grid>
        )
      }
    </>
  )
}

export default CourierInfo