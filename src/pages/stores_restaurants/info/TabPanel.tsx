import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Paper, Button, Grid } from '@mui/material';
import { Analytics, History, AttachMoney, Download, AccountBalance } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { numberFormat } from 'utils/numberFormat';
import dayjs from 'dayjs';
import { RangeDatePicker, Table } from 'components';
import useAllQueryParams from 'hooks/useGetAllQueryParams/useAllQueryParams';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiMutation } from 'hooks/useApi/useApiHooks';
import { ExportButton } from 'components';
import Accounting from './Accounting';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface StoreTabsProps {
  storeId: string;
  store: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`store-tabpanel-${index}`}
      aria-labelledby={`store-tab-${index}`}
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

export const StoreTabs: React.FC<StoreTabsProps> = ({ storeId, store }) => {
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const allParams = useAllQueryParams();
  const navigate = useNavigate();

  const { mutate: getStatistics, data: statisticsData } = useApiMutation(
    "store/statistics",
    "post",
    {
      onError: () => {},
    }
  );

  useEffect(() => {
    if (value === 1 && storeId) {
      getStatistics({
        storeId: storeId,
        dateFrom: allParams.dateFrom,
        dateTo: allParams.dateTo
      });
    }
  }, [value, allParams.dateFrom, allParams.dateTo, storeId]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Exporting store ${storeId} as ${format}`);
  };

  const statistics = statisticsData?.data || {};

  return (
    <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', flex: 1 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="store tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
            },
            '& .Mui-selected': {
              color: '#EB5B00',
            },
          }}
        >
          <Tab icon={<History />} iconPosition="start" label="Buyurtmalar" />
          <Tab icon={<Analytics />} iconPosition="start" label="Statistika" />
          <Tab icon={<AccountBalance />} iconPosition="start" label="Hisob-kitoblar" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <RangeDatePicker />
            </Grid>
            <Grid item>
              <ExportButton
                url={`/store/${storeId}/export`}
                extraParams={{
                  dateFrom: allParams.dateFrom,
                  dateTo: allParams.dateTo,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Table
          columns={[
            {
              field: 'id',
              headerName: 'ID',
              width: 100,
              renderCell: ({ row }: { row: any }) => row._id?.slice(-4) || row.id || '-',
            },
            {
              field: 'date',
              headerName: 'Sana',
              flex: 1,
              minWidth: 150,
              renderCell: ({ row }: { row: any }) => row.createdAt 
                ? dayjs(row.createdAt).format('YYYY-MM-DD HH:mm')
                : '-',
            },
            {
              field: 'amount',
              headerName: 'Summa',
              flex: 1,
              minWidth: 120,
              renderCell: ({ row }: { row: any }) => numberFormat(row.totalPrice || row.amount || 0) + ' ' + t('common.symbol'),
            },
            {
              field: 'status',
              headerName: 'Status',
              width: 150,
              renderCell: ({ row }: { row: any }) => row.status || '-',
            },
          ]}
          dataUrl="order/paging"
          searchable={false}
          exQueryParams={{
            storeId: storeId,
            dateFrom: allParams.dateFrom,
            dateTo: allParams.dateTo,
          }}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Box sx={{ mb: 3 }}>
          <RangeDatePicker />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, backgroundColor: '#F7FAFC', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Kunlik buyurtmalar
              </Typography>
              <Typography variant="h4" color="primary">
                {statistics.dailyOrders || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, backgroundColor: '#F7FAFC', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Haftalik buyurtmalar
              </Typography>
              <Typography variant="h4" color="primary">
                {statistics.weeklyOrders || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, backgroundColor: '#F7FAFC', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Sahifa ko'rildi
              </Typography>
              <Typography variant="h4" color="primary">
                {statistics.storeViewsCount || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: '#F7FAFC', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Umumiy daromad
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => handleExport('excel')}
                  >
                    Excel
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => handleExport('pdf')}
                  >
                    PDF
                  </Button>
                </Box>
              </Box>
              <Typography variant="h4" color="primary">
                {numberFormat(statistics.totalRevenue || store.totalRevenue || 0)} {t('common.symbol')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Accounting storeId={storeId} store={store} />
      </TabPanel>
    </Paper>
  );
};

