import { Box, Container, Typography } from "@mui/material"
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TabStyled } from "./info.style";
import { CourierCard } from "./CouirierCard";
import { CourierTabs } from "./TabPanel";


const CourierInfo = () => {
  const [active, setActive] = useState("orders");
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: courierInfoData, status: courierInfoStatus } = useApi(`courier/get-by-id/${id}`, {}, {
    enabled: !!id,
    suspense: false
  })

  const { mutate, reset, data, isLoading } = useApiMutation(
    "order/paging",
    "post",
    {
      onSuccess(response) {
       
      },
    }
  );

  useEffect(() => {
    mutate({
      courierId: id
    });
  }, [mutate]);

  console.log(data)


  return (
    <>
      <>
        {
          id && (
            <Box sx={{
              // minHeight: '100vh',
              py: 1,
              px: 1
            }}>
              <Container maxWidth="xl" sx={{ py: 1 }}>
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  flexDirection: { xs: 'column', md: 'row' }
                }}>
                  <Box sx={{
                    flex: { xs: '1', md: '0 0 500px' },
                    minWidth: 0
                  }}>
                    <CourierCard
                      courierInfoData={courierInfoData}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <CourierTabs historyOrders={data?.data} courierInfoData={courierInfoData} />
                  </Box>
                </Box>
              </Container>

            </Box >
          )
        }
      </>


    </>
  )
}

export default CourierInfo