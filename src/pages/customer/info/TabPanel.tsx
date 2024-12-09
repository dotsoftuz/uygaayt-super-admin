import React from 'react';
import { Tabs, Tab, Box, Typography, Paper, Chip, LinearProgress } from '@mui/material';
import { Money, ShoppingBag } from '@mui/icons-material';
import HistoryIcon from '@mui/icons-material/History';
import BackpackIcon from '@mui/icons-material/Backpack';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import useCommonContext from 'context/useCommon';
import dayjs from 'dayjs';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface CustomerTabsProps {
  historyOrders: any
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

const OrderItem = ({ id, amount, status, currency, date, status_color }: { id: string; amount: string; status: string; currency: string, date: string, status_color: any }) => (
  <Box sx={{
    mb: 2,
    p: 3,
    backgroundColor: '#F7FAFC',
    borderRadius: 2,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <BackpackIcon style={{ fontSize: 20, color: '#6B46C1' }} />
        <Typography variant="subtitle1" fontWeight="bold">
          Order #{id}
        </Typography>
      </Box>
      <span  style={{backgroundColor: status_color, color: 'white', padding: '8px', borderRadius: "10px", fontSize: "13px"}}>{status}</span>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {date}
      </Typography>
      <Typography variant="subtitle1" fontWeight="bold" color="#6B46C1">
        {amount} {currency}
      </Typography>
    </Box>
  </Box>
);

export const CustomerTabs: React.FC<CustomerTabsProps> = ({ historyOrders }) => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const {
    state: { data: settingsData },
  } = useCommonContext();

  console.log(historyOrders?.data)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
              color: '#6B46C1 !important'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#6B46C1'
            }
          }}
        >
          <Tab
            icon={<ShoppingBag style={{ fontSize: 20 }} />}
            iconPosition="start"
            label={t('tabs.orders')}
          />
          {/* <Tab 
            icon={<HistoryIcon style={{ fontSize: 20 }} />} 
            iconPosition="start" 
            label="History" 
          /> */}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {historyOrders?.data?.map((orders: any) => (
          <OrderItem
            id={orders?.number}
            amount={orders?.totalPrice}
            status={orders?.state?.name}
            status_color={orders?.state?.color}
            currency={get(settingsData, "currency", "uzs")}
            date={orders?.completedAt ? dayjs(orders.completedAt).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
          />
        ))}
      </TabPanel>
      {/* <TabPanel value={value} index={1}>
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
      </TabPanel> */}
    </Paper>
  );
};