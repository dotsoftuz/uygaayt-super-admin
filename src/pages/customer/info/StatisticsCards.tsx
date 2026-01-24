import {
  Favorite,
  RemoveShoppingCart,
  ShoppingCart,
  TrendingUp,
  Visibility,
} from "@mui/icons-material";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useApi } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useTranslation } from "react-i18next";

interface StatisticsCardsProps {
  customerId: string;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  customerId,
}) => {
  const { t } = useTranslation();
  const allParams = useAllQueryParams();

  const { data: statisticsData } = useApi(
    `customer-analytics/statistics/${customerId}`,
    {
      dateFrom: allParams.dateFrom,
      dateTo: allParams.dateTo,
    },
    {
      enabled: !!customerId,
      suspense: false,
    },
  );

  const statistics = statisticsData?.data || {};

  const cards = [
    {
      title: t("activity.total_events"),
      value: statistics.totalEvents || 0,
      icon: <TrendingUp sx={{ fontSize: 20, color: "#6B46C1" }} />,
      color: "#6B46C1",
    },
    {
      title: t("activity.today_events"),
      value: statistics.todayEvents || 0,
      icon: <Visibility sx={{ fontSize: 20, color: "#10B981" }} />,
      color: "#10B981",
    },
    {
      title: t("activity.product_views"),
      value:
        statistics.eventTypeDistribution?.find(
          (e: any) => e.eventType === "PRODUCT_VIEW",
        )?.count || 0,
      icon: <Visibility sx={{ fontSize: 20, color: "#3B82F6" }} />,
      color: "#3B82F6",
    },
    {
      title: t("activity.basket_adds"),
      value:
        statistics.eventTypeDistribution?.find(
          (e: any) => e.eventType === "PRODUCT_ADD_TO_BASKET",
        )?.count || 0,
      icon: <ShoppingCart sx={{ fontSize: 20, color: "#F59E0B" }} />,
      color: "#F59E0B",
    },
    {
      title: t("activity.basket_removes"),
      value:
        statistics.eventTypeDistribution?.find(
          (e: any) => e.eventType === "PRODUCT_REMOVE_FROM_BASKET",
        )?.count || 0,
      icon: <RemoveShoppingCart sx={{ fontSize: 20, color: "#EF4444" }} />,
      color: "#EF4444",
    },
    {
      title: t("activity.favorites"),
      value:
        statistics.eventTypeDistribution?.find(
          (e: any) => e.eventType === "FAVORITE_ADD",
        )?.count || 0,
      icon: <Favorite sx={{ fontSize: 20, color: "#8B5CF6" }} />,
      color: "#8B5CF6",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
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
