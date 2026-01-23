import {
  AttachMoney,
  Cancel,
  CheckCircle,
  ShoppingCart,
} from "@mui/icons-material";
import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { numberFormat } from "utils/numberFormat";

interface StoreStatisticsCardsProps {
  storeId: string;
}

export const StoreStatisticsCards: React.FC<StoreStatisticsCardsProps> = ({
  storeId,
}) => {
  const { t } = useTranslation();
  const allParams = useAllQueryParams();

  const {
    mutate: getStatistics,
    data: statisticsData,
    isLoading,
  } = useApiMutation("store/statistics", "post", {
    onError: (error) => {
      // Handle error silently or add proper error handling
    },
  });

  useEffect(() => {
    if (storeId) {
      const params: any = {
        storeId: storeId,
      };

      if (
        allParams.dateFrom &&
        allParams.dateFrom !== "undefined" &&
        allParams.dateFrom !== ""
      ) {
        params.dateFrom = allParams.dateFrom;
      }

      if (
        allParams.dateTo &&
        allParams.dateTo !== "undefined" &&
        allParams.dateTo !== ""
      ) {
        params.dateTo = allParams.dateTo;
      }

      getStatistics(params);
    }
  }, [storeId, allParams.dateFrom, allParams.dateTo, getStatistics]);

  const statistics = statisticsData?.data || {};

  const cards = [
    {
      title: t("sidebar.store_statistics.total_revenue"),
      value: `${numberFormat(statistics.totalRevenue || 0)} ${t("common.symbol")}`,
      icon: <AttachMoney sx={{ fontSize: 20, color: "#10B981" }} />,
      color: "#10B981",
    },
    {
      title: t("sidebar.store_statistics.total_orders"),
      value: statistics.totalOrders || 0,
      icon: <ShoppingCart sx={{ fontSize: 20, color: "#6B46C1" }} />,
      color: "#6B46C1",
    },
    {
      title: t("sidebar.store_statistics.completed_orders"),
      value: statistics.completedOrders || 0,
      icon: <CheckCircle sx={{ fontSize: 20, color: "#3B82F6" }} />,
      color: "#3B82F6",
    },
    {
      title: t("sidebar.store_statistics.cancelled_orders"),
      value: statistics.cancelledOrders || 0,
      icon: <Cancel sx={{ fontSize: 20, color: "#EF4444" }} />,
      color: "#EF4444",
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "#F7FAFC",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              position: "relative",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                {card.title}
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: card.color }}
              >
                {card.value}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: `${card.color}15`,
                borderRadius: "50%",
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.icon}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
