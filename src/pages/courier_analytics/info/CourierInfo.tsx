import { Box, Container, Typography } from "@mui/material"
import DriverCard from './DriverCard';
import { useApi } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TabStyled } from "./info.style";

const CourierInfo = () => {
  const [active, setActive] = useState("orders");
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: courierInfoData, status: courierInfoStatus } = useApi(`courier/get-by-id/${id}`, {}, {
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
            py: 6,
            px: 4
          }}>
            <Container maxWidth="xl">
              <Box sx={{
                display: 'flex',
                gap: 6,
                alignItems: 'flex-start',
                backgroundColor: "#fff"
              }}>
                <Box
                  sx={{
                    flex: '0 0 400px',
                    padding: '20px',
                    position: 'relative',
                    '& img': {
                      width: '100%', 
                      height: '250px',
                      objectFit: 'cover',
                      borderRadius: 4,
                    },
                  }}
                >
                  <img
                    src={
                      process.env.REACT_APP_BASE_URL +
                      '/' +
                      courierInfoData?.data?.image?.url
                    }
                    alt=""
                  />
                </Box>


                <Box sx={{ flex: 1 }}>
                  <DriverCard courierInfoData={courierInfoData?.data} />
                </Box>
              </Box>
            </Container >
            {/* <Container> */}
            <TabStyled >
              <div className="tab">
                <button
                  className={`tab-btn ${active === "orders" && "active"}`}
                  onClick={() => setActive("orders")}
                >
                  {t("tabs.orders")}
                </button>
                <button
                  className={`tab-btn ${active === "basket" && "active"}`}
                  onClick={() => setActive("basket")}
                >
                  {t("order.basket")}
                </button>
              </div>


              {
                active === "orders" && (
                  <> {t("tabs.orders")}</>
                )
              }
              {
                active === "basket" && (
                  <> {t("tabs.basket")}</>
                )
              }
            </TabStyled >
          </Box >
        )
      }


    </>
  )
}

export default CourierInfo