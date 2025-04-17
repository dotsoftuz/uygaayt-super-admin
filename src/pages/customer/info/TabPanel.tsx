import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Paper, Chip, LinearProgress, Button } from '@mui/material';
import { Money, ShoppingBag } from '@mui/icons-material';
import HistoryIcon from '@mui/icons-material/History';
import BackpackIcon from '@mui/icons-material/Backpack';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import useCommonContext from 'context/useCommon';
import dayjs, { Dayjs } from 'dayjs';
import { RangeDatePicker, Table } from 'components';
import useAllQueryParams from 'hooks/useGetAllQueryParams/useAllQueryParams';
import isBetween from "dayjs/plugin/isBetween";
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { numberFormat } from 'utils/numberFormat';
import { formatSeconds } from 'utils/formatSeconds';
import { formatMinutes } from 'utils/formatMinutes';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useTransactionColumns } from './transaction.columns';

dayjs.extend(isBetween);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface CustomerTabsProps {
  historyOrders: any;
  customerReportData: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;


  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const OrderItem = ({ _id, id, amount, status, currency, date, status_color }: { _id: string, id: string; amount: string; status: string; currency: string, date: string, status_color: any }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={{
      mb: 2,
      p: 3,
      backgroundColor: '#F7FAFC',
      borderRadius: 2,
      cursor: "pointer",
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }
    }}
      onClick={() => navigate(`/order/${_id}`)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BackpackIcon style={{ fontSize: 20, color: '#6B46C1' }} />
          <Typography variant="subtitle1" fontWeight="bold">
            {t('general.order')} #{id}
          </Typography>
        </Box>
        <span style={{ backgroundColor: status_color, color: 'white', padding: '8px', borderRadius: "10px", fontSize: "13px" }}>{status}</span>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {date}
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" color="#6B46C1">
          {numberFormat(amount)} {currency}
        </Typography>
      </Box>
    </Box>
  )
};

export const CustomerTabs: React.FC<CustomerTabsProps> = ({ historyOrders, customerReportData }) => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const allParams = useAllQueryParams();
  const { id } = useParams();
  const columns = useTransactionColumns();


  const {
    state: { data: settingsData },
  } = useCommonContext();


  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSetYearFilter = () => {
    const from = dayjs().startOf("year");
    const to = dayjs();

    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      dateFrom: from.toISOString(),
      dateTo: to.toISOString(),
    });
  };

  return (
    <Paper elevation={3} sx={{ width: "75%", borderRadius: 4, overflow: 'hidden' }}>
      <Box sx={{
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: '#F7FAFC'
      }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={(theme) => ({
            overflow: "auto",
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              [theme.breakpoints.down('sm')]: {
                fontSize: '0.8rem',
                minHeight: 48,
                padding: '6px 8px'
              }
            },
            '& .Mui-selected': {
              color: '#6B46C1 !important'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#6B46C1'
            }
          })}
        >
          <Tab
            icon={
              <ShoppingBag
                style={{
                  fontSize: 20,
                  marginRight: 4
                }}
              />
            }
            iconPosition="start"
            label={t('tabs.order_history')}
          />
          <Tab
            icon={
              <AnalyticsIcon
                style={{
                  fontSize: 20,
                  marginRight: 4
                }}
              />
            }
            iconPosition="start"
            label={t('tabs.customer_statistics')}
          />
          <Tab
            icon={
              <AnalyticsIcon
                style={{
                  fontSize: 20,
                  marginRight: 4
                }}
              />
            }
            iconPosition="start"
            label={t('tabs.transaction_history')}
          />
        </Tabs>

      </Box>
      <Box sx={{ p: 2, backgroundColor: 'white' }}>
        <RangeDatePicker />
      </Box>
      <TabPanel value={value} index={0}>
        <Box
          sx={{
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          {historyOrders?.data?.map((orders: any) => (
            <OrderItem
              key={orders?.number}
              id={orders?.number}
              _id={orders?._id}
              amount={orders?.totalPrice}
              status={orders?.state?.name}
              status_color={orders?.state?.color}
              currency={get(settingsData, "currency", "uzs")}
              date={orders?.createdAt ? dayjs(orders.createdAt).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
            />
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Box sx={{ p: 1 }}>
          <Box sx={{ mb: 1 }}>
            <Button variant="contained" color="primary" onClick={handleSetYearFilter}>
              {t("customer_info.years")}
            </Button>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Money style={{ fontSize: 24, color: '#6B46C1' }} />
              <Typography variant="h6">{t('customer_info.total_purchases')}</Typography>
            </Box>
            <Typography variant="h4" color="#6B46C1" fontWeight="bold" mb={1}>
              {customerReportData?.data?.total_amount}
            </Typography>
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 3
          }}>
            <Paper sx={{ p: 3, backgroundColor: '#F7FAFC' }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                {t('customer_info.total_amount')}
              </Typography>
              <Typography variant="h6">
                {numberFormat(customerReportData?.data?.total_price) + " " + get(settingsData, "currency", "uzs")}
              </Typography>
            </Paper>
            <Paper sx={{ p: 3, backgroundColor: '#F7FAFC' }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                {t('customer_info.savings_money')}
              </Typography>
              <Typography variant="h6">
                {numberFormat(customerReportData?.data?.saved_amount) + " " + get(settingsData, "currency", "uzs")}
              </Typography>
            </Paper>
            <Paper sx={{ p: 3, backgroundColor: '#F7FAFC' }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                {t('customer_info.savings_time')}
              </Typography>
              <Typography variant="h6">
                {formatMinutes(customerReportData?.data?.saved_time)}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Table
          columns={columns}
          dataUrl="balance/paging"
          exQueryParams={{
            customerId: id
          }}
        />
      </TabPanel>
    </Paper>
  );
};