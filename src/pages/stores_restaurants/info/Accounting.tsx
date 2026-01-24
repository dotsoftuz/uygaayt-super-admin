import {
  AttachMoney,
  CalendarToday,
  Download,
  TrendingUp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { RangeDatePicker } from "components";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { numberFormat } from "utils/numberFormat";

interface AccountingProps {
  storeId: string;
  store: any;
}

const Accounting: React.FC<AccountingProps> = ({
  storeId,
  store: storeProp,
}) => {
  const { t } = useTranslation();
  const allParams = useAllQueryParams();

  const [accountingData, setAccountingData] = useState<any>(null);

  // Hisob-kitob ma'lumotlarini olish
  const { mutate: getAccountingData, data: accountingResponse } =
    useApiMutation("store/accounting", "post", {});

  useEffect(() => {
    if (storeId && allParams.dateFrom && allParams.dateTo) {
      getAccountingData({
        storeId: storeId,
        dateFrom: allParams.dateFrom,
        dateTo: allParams.dateTo,
      });
    }
  }, [storeId, allParams.dateFrom, allParams.dateTo]);

  useEffect(() => {
    if (accountingResponse?.data) {
      setAccountingData(accountingResponse.data);
    }
  }, [accountingResponse]);

  const handleExportPDF = () => {
    // PDF export funksiyasi (keyinchalik)
  };

  const handleExportExcel = () => {
    // Excel export funksiyasi (keyinchalik)
  };

  if (!storeProp) {
    return <div>Yuklanmoqda...</div>;
  }

  const data = accountingData || {
    totalPaid: 0,
    weeklyPayments: [],
    monthlyPayments: [],
    platformCommission: 0,
    storeRevenue: 0,
  };

  const commissionPercent = storeProp.commissionPercent || 0;
  const platformShare = data.totalPaid * (commissionPercent / 100);
  const storeRevenue = data.totalPaid - platformShare;

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Hisob-kitoblar - {storeProp.name}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportPDF}
          >
            PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportExcel}
          >
            Excel
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <RangeDatePicker />
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: "#F7FAFC", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <AttachMoney style={{ fontSize: 24, color: "#EB5B00" }} />
              <Typography variant="h6">To'langan summalar</Typography>
            </Box>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {numberFormat(data.totalPaid || 0)} {t("common.symbol")}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: "#F7FAFC", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <TrendingUp style={{ fontSize: 24, color: "#EB5B00" }} />
              <Typography variant="h6">Platforma ulushi</Typography>
            </Box>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {numberFormat(platformShare)} {t("common.symbol")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              ({commissionPercent}% komissiya)
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: "#F7FAFC", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <AttachMoney style={{ fontSize: 24, color: "#10B981" }} />
              <Typography variant="h6">Do'kon daromadi</Typography>
            </Box>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {numberFormat(storeRevenue)} {t("common.symbol")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              (100% - {commissionPercent}% = {100 - commissionPercent}%)
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <CalendarToday style={{ fontSize: 24, color: "#EB5B00" }} />
              <Typography variant="h6" fontWeight="bold">
                Haftalik to'lov hisoboti
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Hafta</TableCell>
                    <TableCell align="right">Summa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.weeklyPayments && data.weeklyPayments.length > 0 ? (
                    data.weeklyPayments.map((payment: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          {payment.week || `Hafta ${index + 1}`}
                        </TableCell>
                        <TableCell align="right">
                          {numberFormat(payment.amount || 0)}{" "}
                          {t("common.symbol")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        Ma'lumot yo'q
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <CalendarToday style={{ fontSize: 24, color: "#EB5B00" }} />
              <Typography variant="h6" fontWeight="bold">
                Oylik to'lov hisoboti
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Oy</TableCell>
                    <TableCell align="right">Summa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.monthlyPayments && data.monthlyPayments.length > 0 ? (
                    data.monthlyPayments.map((payment: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          {payment.month || `Oy ${index + 1}`}
                        </TableCell>
                        <TableCell align="right">
                          {numberFormat(payment.amount || 0)}{" "}
                          {t("common.symbol")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        Ma'lumot yo'q
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Accounting;
