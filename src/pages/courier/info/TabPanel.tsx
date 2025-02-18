import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Typography, Paper, Chip, LinearProgress, Button, Grid } from '@mui/material';
import { DeliveryDining, Money, ShoppingBag } from '@mui/icons-material';
import HistoryIcon from '@mui/icons-material/History';
import BackpackIcon from '@mui/icons-material/Backpack';
import { t } from 'i18next';
import useCommonContext from 'context/useCommon';
import { get } from 'lodash';
import dayjs, { Dayjs } from 'dayjs';
import { RangeDatePicker } from 'components';
import useAllQueryParams from 'hooks/useGetAllQueryParams/useAllQueryParams';
import isBetween from "dayjs/plugin/isBetween";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { formatSeconds } from 'utils/formatSeconds';
import { numberFormat } from 'utils/numberFormat';

dayjs.extend(isBetween);


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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

const OrderItem = ({ _id, id, amount, status, currency, date, status_color, courierLateTime, courierLateTimeToStore, courierInStoreAt }: { _id: string, id: string; amount: string; status: string; currency: string, date: string, status_color: any, courierLateTime: any, courierLateTimeToStore: any, courierInStoreAt: any }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        mb: 2,
        p: 3,
        backgroundColor: '#F7FAFC',
        borderRadius: 2,
        cursor: "pointer",
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span>Buyurtma yaratilgan vaqti:</span>
        <Typography variant="body2" color="text.secondary">
          {date}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Buyurtma narxi:</span>
        <Typography variant="subtitle1" fontWeight="bold" color="#EB5B00">
          {numberFormat(amount)} {currency}
        </Typography>
      </Box>

      {courierLateTime ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Kechikdi buyurtmaga:</span>
          <span className='text-red-500'>
            {formatSeconds(courierLateTime)} {t('general.late')}
          </span>
        </Box>
      ) : null}
      {courierLateTimeToStore ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Kechikdi do'konga:</span>
          <span className='text-red-500'>
            {formatSeconds(courierLateTimeToStore)} {t('general.late')}
          </span>
        </Box>
      ) : null}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Do'konga yetib kelgan vaqti:</span>
        <Typography variant="body2" color="text.secondary">
          {courierInStoreAt}
        </Typography>
      </Box>
    </Box>

  )
};

interface CourierTabProps {
  courierInfoData: any,
  historyOrders: any,
}


export const CourierTabs: React.FC<CourierTabProps> = ({
  courierInfoData, historyOrders }) => {
  const [value, setValue] = React.useState(1);
  const [isCourierLeft, setIsCourierLeft] = useState<boolean>(false);
  const [isCourierLateToStore, setIsCourierLateToStore] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const allParams = useAllQueryParams();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const {
    state: { data: settingsData },
  } = useCommonContext();

  const handleClick = () => {
    setIsCourierLeft((prev) => !prev);
  };
  const handleClick2 = () => {
    setIsCourierLateToStore((prev) => !prev);
  };

  useEffect(() => {
    lateFilter(isCourierLeft);
  }, [isCourierLeft]);

  useEffect(() => {
    lateToStoreFilter(isCourierLateToStore);
  }, [isCourierLateToStore]);

  const lateFilter = (value: any) => {
    setSearchParams({
      ...allParams,
      isCourierLeft: value,
    });
  };
  const lateToStoreFilter = (value: any) => {
    setSearchParams({
      ...allParams,
      isCourierLateToStore: value,
    });
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
      <Box sx={{
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: '#F7FAFC'
      }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem'
            },
            '& .Mui-selected': {
              color: '#EB5B00 !important'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#EB5B00'
            }
          }}
        >
          <Tab
            icon={<DeliveryDining style={{ fontSize: 20 }} />}
            iconPosition="start"
            label={t("tabs.avto")}
          />
          <Tab
            icon={<HistoryIcon style={{ fontSize: 20 }} />}
            iconPosition="start"
            label={t('tabs.orders')}
          />

        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Box
          sx={{
            display: 'block',
            mb: 2
          }}
        >
          {[
            { label: t("COURIER.carBrand"), value: courierInfoData?.data?.carBrand },
            { label: t("COURIER.carModel"), value: courierInfoData?.data?.carModel },
            { label: t("COURIER.carNumber"), value: courierInfoData?.data?.carNumber },
            { label: t("COURIER.carColor"), value: courierInfoData?.data?.carColor },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1
              }}
            >
              <Typography
                variant="body1"
                fontWeight="500"
                color="text.secondary"
                sx={{ minWidth: "120px" }} // Yorliq kengligini ushlab turish uchun
              >
                {item.label}:
              </Typography>
              <Typography
                variant="body1"
                fontWeight="700"
                color="text.primary"
              >
                {item.value || "-"}
              </Typography>
            </Box>
          ))}
        </Box>

      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid className='flex items-center gap-2 pb-3'>
          <RangeDatePicker />
          <Button className='bg-[#EB5B00] w-full' variant='outlined' onClick={handleClick}>
            {isCourierLeft ? t('driver.all_orders') : t('driver.late_orders')}
          </Button>
          <Button className='bg-[#EB5B00] w-full' variant='outlined' onClick={handleClick2}>
            {isCourierLateToStore ? t('driver.all_orders') : t('driver.late_store')}
          </Button>
        </Grid>
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
              courierLateTime={orders?.courierLateTime}
              courierLateTimeToStore={orders?.courierLateTimeToStore}
              courierInStoreAt={orders?.courierInStoreAt ? dayjs(orders.courierInStoreAt).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
            />
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Money style={{ fontSize: 24, color: '#6B46C1' }} />
              <Typography variant="h6">Total Spent</Typography>
            </Box>
            <Typography variant="h4" color="#6B46C1" fontWeight="bold" mb={1}>
              $1,250.00
            </Typography>
            <LinearProgress
              variant="determinate"
              value={70}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#E9D8FD',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#6B46C1'
                }
              }}
            />
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 3
          }}>
            <Paper sx={{ p: 3, backgroundColor: '#F7FAFC' }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Member Since
              </Typography>
              <Typography variant="h6">
                January 15, 2024
              </Typography>
            </Paper>
            <Paper sx={{ p: 3, backgroundColor: '#F7FAFC' }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Total Orders
              </Typography>
              <Typography variant="h6">
                15 orders
              </Typography>
            </Paper>
          </Box>
        </Box>
      </TabPanel>
    </Paper>
  );
};