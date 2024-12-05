import { Box, Container, Typography } from "@mui/material"
import { CustomerCard } from './CustomerCard';
import { useApi } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TabStyled } from "./info.style";
import { CustomerTabs } from "./TabPanel";

const CustomerInfo = () => {
  const [active, setActive] = useState("orders");
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: customerInfoData, status: customerInfoStatus } = useApi(`customer/get-by-id/${id}`, {}, {
    enabled: !!id,
    suspense: false
  })

  console.log(id)

  return (
    <>
      {
        id && (
          <Box sx={{
            // minHeight: '100vh',
            py: 2,
            px: 2
          }}>
            <Container maxWidth="lg" sx={{ py: 2 }}>
              <Box sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', md: 'row' }
              }}>
                <Box sx={{
                  flex: { xs: '1', md: '0 0 380px' },
                  minWidth: 0
                }}>
                  <CustomerCard
                      customerInfoData={customerInfoData}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <CustomerTabs />
                </Box>
              </Box>
            </Container>

          </Box >
        )
      }


    </>
  )
}

export default CustomerInfo