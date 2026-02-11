import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaidIcon from "@mui/icons-material/Paid";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";
import { RangeDatePicker } from "components";
import DashboardMap from "components/common/DashboardMap/DashboardMap";
import useCommonContext from "context/useCommon";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Map, Placemark, YMaps } from "react-yandex-maps";
import { numberFormat } from "utils/numberFormat";
import MainCharts from "../components/mainCharts/MainCharts";
import TopTable from "../components/TopTable";
import { StyledCard, TypographyTitle } from "../style/StatisticsCard.style";

type SortField = "total_price" | "total_order";
type SortOrder = "1" | "-1";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const allParams = useAllQueryParams();
  const currentLang = localStorage.getItem("i18nextLng") || "uz";
  const [sortFieldUser, setSortFieldUser] = useState<SortField>("total_price");
  const [sortOrderUser, setSortOrderUser] = useState<SortOrder>("1");

  const [sortFieldCourier, setSortFieldCourier] =
    useState<SortField>("total_order");
  const [sortOrderCourier, setSortOrderCourier] = useState<SortOrder>("1");
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [activeStateIds, setActiveStateIds] = useState<string[]>([]);

  const { data: selectedOrderData } = useApi<any>(
    selectedDelivery?._id ? `order/get-by-id/${selectedDelivery._id}` : "",
    {},
    {
      enabled: !!selectedDelivery?._id,
      toast: false,
    },
  );

  const selectedOrder = selectedOrderData?.data || selectedDelivery;

  const {
    state: { data: settingsData },
  } = useCommonContext();

  const { mutate: attributesChooseMutate, data: attributesData } =
    useApiMutation<any>("report/order", "post", {}, true);

  const { mutate: totalIncomeMutate, data: totalIncomeData } = useApiMutation(
    "balance/total",
    "post",
    {},
    true,
  );

  const { mutate: customerMutate, data: customerData } = useApiMutation<any>(
    "report/customer/count",
    "post",
    {},
    true,
  );

  const { mutate: courierMutate, data: couriersData } = useApiMutation<any>(
    "report/courier/top",
    "post",
    {},
    true,
  );
  const { mutate: topCustomerMutate, data: topCustomerData } =
    useApiMutation<any>("report/customer/top", "post", {}, true);

  const mutations = [attributesChooseMutate, totalIncomeMutate, customerMutate];

  const mutateAll = () => {
    mutations.forEach((mutate) =>
      mutate({
        dateFrom: allParams.dateFrom,
        dateTo: allParams.dateTo,
      }),
    );
  };

  useEffect(mutateAll, [allParams.dateFrom, allParams.dateTo]);

  useEffect(() => {
    topCustomerMutate({
      dateFrom: allParams.dateFrom,
      dateTo: allParams.dateTo,
      sortBy: sortFieldUser,
      sortOrder: sortOrderUser,
    });
  }, [allParams.dateFrom, allParams.dateTo, sortFieldUser, sortOrderUser]);

  useEffect(() => {
    courierMutate({
      dateFrom: allParams.dateFrom,
      dateTo: allParams.dateTo,
      sortBy: sortFieldCourier,
      sortOrder: sortOrderCourier,
    });
  }, [
    allParams.dateFrom,
    allParams.dateTo,
    sortFieldCourier,
    sortOrderCourier,
  ]);

  const { mutate: customerReport, data: customerReportData } = useApiMutation(
    "report/customer/saved",
    "post",
    {
      onSuccess(response) {},
    },
  );

  useEffect(() => {
    customerReport({
      dateFrom: allParams.dateFrom,
      dateTo: allParams.dateTo,
    });
  }, [allParams.dateFrom, allParams.dateTo]);

  // Fetch order states to get active state IDs
  const { data: orderStatesData } = useApi<any>("order-state/get-all", {});

  // Fetch orders - bitta API so'rovi, ma'lumotlar ikki joyda ishlatiladi (aktiv buyurtmalar va xarita)
  const { mutate: fetchOrders, data: ordersData } = useApiMutation(
    "order/paging",
    "post",
    {
      onSuccess(response) {
        if (response?.data?.data) {
          const allOrders = response.data.data;

          // Xarita uchun barcha buyurtmalarni saqlash
          // (DashboardMap komponenti o'z ichida filter qiladi)

          // Aktiv buyurtmalar uchun filter qilish
          const excludedStates = ["completed", "cancelled"];
          const filteredOrders = allOrders.filter((order: any) => {
            const orderState = (order.state?.state || "").toLowerCase();
            const systemName = (order.state?.systemName || "").toLowerCase();
            const stateId = order.stateId?.toString() || "";

            // Check if order state is in excluded states
            const isExcluded = excludedStates.some(
              (excluded) =>
                orderState === excluded.toLowerCase() ||
                systemName === excluded.toLowerCase(),
            );

            // Also check if stateId matches any excluded state IDs
            if (!isExcluded && orderStatesData?.data) {
              const excludedStateIds = orderStatesData.data
                .filter((state: any) => {
                  const stateValue = (state.state || "").toLowerCase();
                  return excludedStates.includes(stateValue);
                })
                .map((state: any) => state._id.toString());

              if (excludedStateIds.includes(stateId)) {
                return false;
              }
            }

            return !isExcluded;
          });

          setActiveOrders(filteredOrders);
          // Set first order as selected if none selected
          if (!selectedDelivery && filteredOrders.length > 0) {
            setSelectedDelivery(filteredOrders[0]);
          } else if (selectedDelivery) {
            // Check if selected order is still in the list
            const isSelectedOrderStillActive = filteredOrders.some(
              (order: any) => order._id === selectedDelivery._id,
            );
            if (!isSelectedOrderStillActive && filteredOrders.length > 0) {
              setSelectedDelivery(filteredOrders[0]);
            } else if (!isSelectedOrderStillActive) {
              setSelectedDelivery(null);
            }
          }
        }
      },
    },
  );

  // Get active state IDs when order states are loaded
  useEffect(() => {
    if (orderStatesData?.data) {
      const activeStates = ["created", "inProcess", "inDelivery"];
      const excludedStates = ["completed", "cancelled"];
      const stateIds = orderStatesData.data
        .filter((state: any) => {
          const stateValue = (state.state || "").toLowerCase();
          const systemName = (state.systemName || "").toLowerCase();
          return (
            activeStates.some(
              (active) =>
                stateValue === active.toLowerCase() ||
                systemName === active.toLowerCase(),
            ) &&
            !excludedStates.some(
              (excluded) =>
                stateValue === excluded.toLowerCase() ||
                systemName === excluded.toLowerCase(),
            )
          );
        })
        .map((state: any) => state._id);
      setActiveStateIds(stateIds);
    }
  }, [orderStatesData]);

  // Fetch orders when state IDs are ready - bitta API so'rovi, ma'lumotlar ikki joyda ishlatiladi
  useEffect(() => {
    if (activeStateIds.length > 0) {
      fetchOrders({
        page: 1,
        limit: 200, // Xarita uchun ham yetarli bo'lishi uchun
        dateFrom: allParams.dateFrom,
        dateTo: allParams.dateTo,
        stateIds: activeStateIds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStateIds, allParams.dateFrom, allParams.dateTo]);

  return (
    <>
      <Grid className="bg-white p-2 flex rounded-lg">
        <Grid className="">
          <RangeDatePicker />
        </Grid>
      </Grid>
      <Grid className="grid mt-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2">
        <StyledCard>
          <TypographyTitle>{t("dashboard.total_orders")}</TypographyTitle>
          <div className="flex items-center gap-2">
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#FF6701",
              }}
            >
              {attributesData?.data?.total_amount}
            </Typography>
            <ShoppingCartIcon style={{ color: "#FF6701", fontSize: "24px" }} />
          </div>
        </StyledCard>
        {attributesData?.data?.states?.filter((item: any) => 
          item.state?.state === "completed" || item.state?.state === "cancelled"
        ).map((item: any) => (
          <StyledCard key={item.state?.state}>
            <TypographyTitle>
              {item.state?.state === "completed"
                ? t("dashboard.completed_orders")
                : t("dashboard.cancelled_orders")}
            </TypographyTitle>
            <div className="flex items-center gap-2">
              <Typography
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#FF6701",
                }}
              >
                {item.total_amount}
              </Typography>
              {item.state?.state === "completed" ? (
                <CheckCircleIcon
                  style={{
                    color: "#FF6701",
                    fontSize: "24px",
                  }}
                />
              ) : (
                <CancelIcon
                  style={{
                    color: "#FF6701",
                    fontSize: "24px",
                  }}
                />
              )}
            </div>
          </StyledCard>
        ))}

        <StyledCard>
          <TypographyTitle>{t("dashboard.total_income")}</TypographyTitle>
          <div className="flex items-center gap-2">
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#FF6701",
              }}
            >
              {numberFormat(totalIncomeData?.data?.income)}{" "}
              {get(settingsData, "currency", "uzs")}
            </Typography>
            <PaidIcon style={{ color: "#FF6701", fontSize: "24px" }} />
          </div>
        </StyledCard>

        <StyledCard>
          <TypographyTitle>
            {t("dashboard.registered_customer")}
          </TypographyTitle>
          <div className="flex items-center gap-2">
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#FF6701",
              }}
            >
              {customerData?.data?.registered}
            </Typography>
            <PersonAddIcon style={{ color: "#FF6701", fontSize: "24px" }} />
          </div>
        </StyledCard>

        <StyledCard>
          <TypographyTitle>{t("dashboard.active_customer")}</TypographyTitle>
          <div className="flex items-center gap-2">
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#FF6701",
              }}
            >
              {customerData?.data?.active}
            </Typography>
            <PersonIcon style={{ color: "#FF6701", fontSize: "24px" }} />
          </div>
        </StyledCard>

        <StyledCard>
          <TypographyTitle>{t("dashboard.sold_product")}</TypographyTitle>
          <div className="flex items-center gap-2">
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#FF6701",
              }}
            >
              {attributesData?.data?.productCount}
            </Typography>
            <InventoryIcon style={{ color: "#FF6701", fontSize: "24px" }} />
          </div>
        </StyledCard>

        {/* <StyledCard>
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
                </StyledCard> */}
        {/* <StyledCard>
          <TypographyTitle>{t("general.all_discounts_summ")}</TypographyTitle>
          <Typography
            style={{
              fontSize: "20px",
              fontWeight: 600,
              textAlign: "center",
              color: "#FF6701",
            }}
          >
            {numberFormat(attributesData?.data?.total_discount)}{" "}
            {get(settingsData, "currency", "uzs")}
          </Typography>
        </StyledCard> */}
        <StyledCard>
          <TypographyTitle>{t("general.all_promocode_summ")}</TypographyTitle>
          <div className="flex items-center gap-2">
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#FF6701",
              }}
            >
              {numberFormat(attributesData?.data?.total_promocode)}{" "}
              {get(settingsData, "currency", "uzs")}
            </Typography>
            <LocalOfferIcon style={{ color: "#FF6701", fontSize: "24px" }} />
          </div>
        </StyledCard>
      </Grid>

      <Grid container spacing={2} className="mt-2">
        {/* Left Panel - Ongoing Delivery List */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "16px",
              height: "calc(100vh - 250px)",
              overflowY: "auto",
              boxShadow: "0px 0px 9px -5px rgba(108, 175, 226, 0.96)",
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "16px",
                color: "#45556c",
              }}
            >
              Aktiv buyurtmalar
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {activeOrders.length === 0 ? (
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#666",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Aktiv buyurtmalar mavjud emas
                </Typography>
              ) : (
                activeOrders.map((order: any) => (
                  <Box
                    key={order._id}
                    onClick={() => setSelectedDelivery(order)}
                    sx={{
                      border:
                        selectedDelivery?._id === order._id
                          ? "2px solid #FF6701"
                          : "1px solid #e0e0e0",
                      borderRadius: "12px",
                      padding: "14px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedDelivery?._id === order._id
                          ? "#FFF5F0"
                          : "#fff",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 6px 16px rgba(255, 103, 1, 0.15)",
                        transform: "translateY(-3px)",
                        borderColor:
                          selectedDelivery?._id === order._id
                            ? "#FF6701"
                            : "#FF6701",
                      },
                      display: "flex",
                      gap: 2,
                      position: "relative",
                      marginBottom: "8px",
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          marginBottom: "8px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#45556c",
                            letterSpacing: "0.3px",
                          }}
                        >
                          #{order.number || order._id?.slice(-6)}
                        </Typography>
                        {order.state?.color && (
                          <Box
                            sx={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: order.state.color,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Box>

                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          backgroundColor: order.state?.color
                            ? `${order.state.color}15`
                            : "#f0f0f0",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: order.state?.color || "#666",
                            textTransform: "capitalize",
                          }}
                        >
                          {order.state?.name?.[currentLang] ||
                            (order.state?.state === "created" && "Yaratildi") ||
                            (order.state?.state === "inProcess" &&
                              "Jarayonda") ||
                            (order.state?.state === "inDelivery" &&
                              "Yetkazib berishda") ||
                            order.state?.state ||
                            "Aktiv"}
                        </Typography>
                      </Box>

                      {order.courier && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            marginBottom: "8px",
                          }}
                        >
                          <PersonIcon
                            sx={{ fontSize: "14px", color: "#666" }}
                          />
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: 500,
                              color: "#45556c",
                            }}
                          >
                            {order.courier?.firstName || ""}{" "}
                            {order.courier?.lastName || ""}
                          </Typography>
                        </Box>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 0.5,
                          }}
                        >
                          <LocationOnIcon
                            sx={{
                              fontSize: "14px",
                              color: "#FF6701",
                              marginTop: "2px",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#666",
                              lineHeight: 1.4,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {order.addressName || "Manzil ko'rsatilmagan"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            marginTop: "4px",
                          }}
                        >
                          <PaidIcon
                            sx={{ fontSize: "14px", color: "#FF6701" }}
                          />
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#FF6701",
                            }}
                          >
                            {numberFormat(order.totalPrice)}{" "}
                            {get(settingsData, "currency", "uzs")}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "40px",
                      }}
                    >
                      <DeliveryDiningIcon
                        sx={{
                          fontSize: "32px",
                          color:
                            selectedDelivery?._id === order._id
                              ? "#FF6701"
                              : "#45556c",
                          transition: "color 0.3s",
                        }}
                      />
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Grid>

        {/* Right Panel - Map with Order Details Overlay */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0px 0px 9px -5px rgba(108, 175, 226, 0.96)",
              height: "calc(100vh - 250px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Map View */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <YMaps query={{ load: "package.full" }}>
                <Map
                  width="100%"
                  height="100%"
                  defaultState={{
                    center: selectedDelivery?.addressLocation
                      ? [
                          selectedDelivery.addressLocation.latitude,
                          selectedDelivery.addressLocation.longitude,
                        ]
                      : [40.1158, 67.8422],
                    zoom: selectedDelivery?.addressLocation ? 14 : 12,
                    behaviors: ["default", "scrollZoom"],
                  }}
                  state={{
                    center: selectedDelivery?.addressLocation
                      ? [
                          selectedDelivery.addressLocation.latitude,
                          selectedDelivery.addressLocation.longitude,
                        ]
                      : [40.1158, 67.8422],
                    zoom: selectedDelivery?.addressLocation ? 14 : 12,
                  }}
                >
                  {selectedDelivery?.addressLocation && (
                    <>
                      {selectedDelivery.store?.addressLocation && (
                        <>
                          <Placemark
                            geometry={[
                              selectedDelivery.store.addressLocation.latitude,
                              selectedDelivery.store.addressLocation.longitude,
                            ]}
                            options={{
                              preset: "islands#blueCircleDotIcon",
                            }}
                            properties={{
                              balloonContent:
                                selectedDelivery.store?.name || "Do'kon",
                            }}
                          />
                          <Placemark
                            geometry={[
                              selectedDelivery.addressLocation.latitude,
                              selectedDelivery.addressLocation.longitude,
                            ]}
                            options={{
                              preset: "islands#redCircleDotIcon",
                            }}
                            properties={{
                              balloonContent:
                                selectedDelivery.addressName || "Manzil",
                            }}
                          />
                        </>
                      )}
                      {!selectedDelivery.store?.addressLocation && (
                        <Placemark
                          geometry={[
                            selectedDelivery.addressLocation.latitude,
                            selectedDelivery.addressLocation.longitude,
                          ]}
                          options={{
                            preset: "islands#redCircleDotIcon",
                          }}
                          properties={{
                            balloonContent:
                              selectedDelivery.addressName || "Manzil",
                          }}
                        />
                      )}
                    </>
                  )}
                </Map>
              </YMaps>
            </Box>

            {/* Order Details Card Overlay */}
            {selectedDelivery && (
              <Box
                sx={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "380px",
                  maxHeight: "calc(100% - 32px)",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                  overflowY: "auto",
                  zIndex: 1000,
                  "@media (max-width: 960px)": {
                    position: "relative",
                    top: "16px",
                    right: "auto",
                    width: "100%",
                    marginTop: "16px",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                    paddingBottom: "12px",
                    borderBottom: "2px solid #f0f0f0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      onClick={() => navigate(`/order/${selectedOrder._id}`)}
                      sx={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#45556c",
                        textDecoration: "underline",
                        cursor: "pointer",
                        textUnderlineOffset: "4px",
                        "&:hover": { color: "#FF6701" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Buyurtma #
                      {selectedOrder.number || selectedOrder._id?.slice(-6)}
                    </Typography>

                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        backgroundColor: selectedOrder.state?.color
                          ? `${selectedOrder.state.color}15`
                          : "#f0f0f0",
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: selectedOrder.state?.color || "#666",
                        }}
                      >
                        {selectedOrder.state?.name?.[currentLang] ||
                          (selectedOrder.state?.state === "created" &&
                            "Yaratildi") ||
                          (selectedOrder.state?.state === "inProcess" &&
                            "Jarayonda") ||
                          (selectedOrder.state?.state === "inDelivery" &&
                            "Yetkazib berishda") ||
                          selectedOrder.state?.state ||
                          "Aktiv"}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDelivery(null);
                    }}
                    sx={{
                      color: "#666",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        color: "#FF6701",
                      },
                      zIndex: 1001,
                      position: "relative",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Courier Info */}
                {selectedOrder.courier && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      marginBottom: "16px",
                      padding: "12px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <Avatar sx={{ width: 48, height: 48, bgcolor: "#FF6701" }}>
                      {selectedOrder.courier?.firstName?.[0] || ""}
                      {selectedOrder.courier?.lastName?.[0] || ""}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#45556c",
                          marginBottom: "4px",
                        }}
                      >
                        {selectedOrder.courier?.firstName || ""}{" "}
                        {selectedOrder.courier?.lastName || ""}
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#666" }}>
                        Kuryer
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Order Details */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Store Info */}
                  {selectedOrder.store && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        padding: "12px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                      }}
                    >
                      <StorefrontIcon
                        sx={{
                          fontSize: "20px",
                          color: "#FF6701",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#45556c",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedOrder.store?.name || "Ko'rsatilmagan"}
                      </Typography>
                    </Box>
                  )}

                  {/* Address */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      padding: "12px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <LocationOnIcon
                      sx={{
                        fontSize: "20px",
                        color: "#FF6701",
                        marginTop: "2px",
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#45556c",
                          marginBottom: "4px",
                        }}
                      >
                        Manzil
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "#666",
                          lineHeight: 1.5,
                        }}
                      >
                        {selectedOrder.addressName || "Ko'rsatilmagan"}
                      </Typography>
                      {selectedOrder.houseNumber && (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#999",
                            marginTop: "4px",
                          }}
                        >
                          {selectedOrder.houseNumber}
                          {selectedOrder.entrance &&
                            `, Kirish: ${selectedOrder.entrance}`}
                          {selectedOrder.apartmentNumber &&
                            `, Kv: ${selectedOrder.apartmentNumber}`}
                          {selectedOrder.floor &&
                            `, Qavat: ${selectedOrder.floor}`}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Customer Info */}
                  {selectedOrder.customer && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        padding: "12px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                      }}
                    >
                      <PersonIcon
                        sx={{
                          fontSize: "20px",
                          color: "#FF6701",
                          marginTop: "2px",
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#45556c",
                            marginBottom: "4px",
                          }}
                        >
                          Mijoz
                        </Typography>
                        <Typography sx={{ fontSize: "13px", color: "#666" }}>
                          {selectedOrder.customer?.firstName || ""}{" "}
                          {selectedOrder.customer?.lastName || ""}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#999",
                            marginTop: "2px",
                          }}
                        >
                          {selectedOrder.customer?.phoneNumber || ""}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Products */}
                  {Array.isArray(selectedOrder.items) &&
                    selectedOrder.items.length > 0 && (
                      <Box
                        sx={{
                          padding: "12px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#45556c",
                            marginBottom: "8px",
                          }}
                        >
                          Mahsulotlar
                        </Typography>

                        <Box
                          sx={{
                            maxHeight: "220px",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            pr: "6px",
                          }}
                        >
                          {selectedOrder.items.map((item: any, idx: number) => {
                            const name =
                              item?.product?.name?.[currentLang] ||
                              item?.product?.name ||
                              item?.name?.[currentLang] ||
                              item?.name ||
                              "Mahsulot";
                            const qty = item?.amount ?? item?.quantity ?? 1;
                            const price = item?.price ?? item?.itemPrice ?? 0;
                            const imageUrl = item?.product?.mainImage?.url
                              ? `${process.env.REACT_APP_BASE_URL}/${item.product.mainImage.url}`
                              : item?.product?.mainImage
                                ? `${process.env.REACT_APP_BASE_URL}/${item.product.mainImage}`
                                : item?.product?.image?.url
                                  ? `${process.env.REACT_APP_BASE_URL}/${item.product.image.url}`
                                  : "";

                            return (
                              <Box
                                key={`${item?._id || item?.productId || idx}`}
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  justifyContent: "space-between",
                                  gap: 2,
                                  padding: "8px 10px",
                                  backgroundColor: "#fff",
                                  borderRadius: "8px",
                                  border: "1px solid #eee",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    backgroundColor: "#f0f0f0",
                                    border: "1px solid #eee",
                                    flexShrink: 0,
                                  }}
                                >
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={name}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : null}
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    sx={{
                                      fontSize: "13px",
                                      fontWeight: 600,
                                      color: "#45556c",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {name}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      color: "#999",
                                      mt: "2px",
                                    }}
                                  >
                                    {qty} x {numberFormat(price)}{" "}
                                    {get(settingsData, "currency", "uzs")}
                                  </Typography>
                                </Box>

                                <Typography
                                  sx={{
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    color: "#FF6701",
                                    flexShrink: 0,
                                  }}
                                >
                                  {numberFormat(price * qty)}{" "}
                                  {get(settingsData, "currency", "uzs")}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    )}

                  {/* Price */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      backgroundColor: "#FFF5F0",
                      borderRadius: "8px",
                      border: "1px solid #FFE5D6",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PaidIcon sx={{ fontSize: "20px", color: "#FF6701" }} />
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#45556c",
                        }}
                      >
                        Umumiy summa
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#FF6701",
                      }}
                    >
                      {numberFormat(selectedOrder.totalPrice)}{" "}
                      {get(settingsData, "currency", "uzs")}
                    </Typography>
                  </Box>

                  {/* Dates */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      marginTop: "8px",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#999",
                          marginBottom: "4px",
                        }}
                      >
                        Yaratilgan
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#666",
                          fontWeight: 500,
                        }}
                      >
                        {selectedOrder.createdAt
                          ? new Date(
                              selectedOrder.createdAt,
                            ).toLocaleDateString("uz-UZ", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "Ko'rsatilmagan"}
                      </Typography>
                    </Box>
                    {selectedOrder.deliveryDate && (
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: "#999",
                            marginBottom: "4px",
                          }}
                        >
                          Yetkazish
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#666",
                            fontWeight: 500,
                          }}
                        >
                          {new Date(
                            selectedOrder.deliveryDate,
                          ).toLocaleDateString("uz-UZ", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      <Grid className="p-2 bg-white mt-2 rounded-lg">
        <MainCharts
          data={attributesData?.data?.states}
          all_orders={attributesData?.data?.total_amount}
        />
      </Grid>

      <Grid className="bg-white mt-2 rounded-lg p-4">
        <Typography
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "#FF6701",
          }}
        >
          {t("dashboard.orders_by_location")}
        </Typography>
        <DashboardMap
          useDemoData={false}
          orders={ordersData?.data?.data || []}
          isLoading={!ordersData}
        />
      </Grid>

      <Grid className="grid mt-2 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg">
          <p className="font-semibold text-lg p-3">
            {t("dashboard.top_users")}
          </p>
          <TopTable
            data={topCustomerData?.data}
            setSortField={setSortFieldUser}
            sortField={sortFieldUser}
            setSortOrder={setSortOrderUser}
            sortOrder={sortOrderUser}
          />
        </div>
        <div className="bg-white rounded-lg">
          <p className="font-semibold text-lg p-3">
            {t("dashboard.top_courier")}
          </p>
          <TopTable
            data={couriersData?.data}
            setSortField={setSortFieldCourier}
            sortField={sortFieldCourier}
            setSortOrder={setSortOrderCourier}
            sortOrder={sortOrderCourier}
          />
        </div>
      </Grid>
    </>
  );
};

export default Dashboard;
