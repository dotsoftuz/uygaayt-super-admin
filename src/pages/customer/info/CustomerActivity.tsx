import { Box } from '@mui/material';
import { Table } from 'components';
import { useActivityColumns } from './activity.columns';
import { StatisticsCards } from './StatisticsCards';
import { FilterBar } from './FilterBar';
import { ActivityChart } from './ActivityChart';
import useAllQueryParams from 'hooks/useGetAllQueryParams/useAllQueryParams';

interface CustomerActivityProps {
  customerId: string;
}

export const CustomerActivity: React.FC<CustomerActivityProps> = ({ customerId }) => {
  const columns = useActivityColumns();
  const allParams = useAllQueryParams();

  if (!customerId) {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        Customer ID not provided
      </Box>
    );
  }

  const queryParams: any = {
    customerId: customerId,
  };

  if (allParams.eventType) {
    queryParams.eventType = allParams.eventType;
  }

  if (allParams.entityType) {
    queryParams.entityType = allParams.entityType;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <StatisticsCards customerId={customerId} />
      <ActivityChart customerId={customerId} />
      <FilterBar />
      <Table
        columns={columns}
        dataUrl="customer-analytics/paging"
        exQueryParams={queryParams}
      />
    </Box>
  );
};

