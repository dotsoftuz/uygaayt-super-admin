import { Box, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useApi } from 'hooks/useApi/useApiHooks';
import useAllQueryParams from 'hooks/useGetAllQueryParams/useAllQueryParams';

interface ActivityChartProps {
  customerId: string;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ customerId }) => {
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
    }
  );

  const chartData = statisticsData?.data?.last7Days || [];

  if (!chartData || chartData.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>
          {t('activity.activity_chart')}
        </Typography>
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          {t('activity.no_data')}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        {t('activity.activity_chart')}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#6B46C1"
            strokeWidth={2}
            name={t('activity.events_count') || ''}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

