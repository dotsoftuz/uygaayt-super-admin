import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import useAllQueryParams from 'hooks/useGetAllQueryParams/useAllQueryParams';

const EventType = {
  PRODUCT_VIEW: 'PRODUCT_VIEW',
  PRODUCT_ADD_TO_BASKET: 'PRODUCT_ADD_TO_BASKET',
  PRODUCT_REMOVE_FROM_BASKET: 'PRODUCT_REMOVE_FROM_BASKET',
  STORE_VIEW: 'STORE_VIEW',
  CATEGORY_VIEW: 'CATEGORY_VIEW',
  SEARCH: 'SEARCH',
  FAVORITE_ADD: 'FAVORITE_ADD',
  FAVORITE_REMOVE: 'FAVORITE_REMOVE',
  ORDER_CREATED: 'ORDER_CREATED',
};

const EntityType = {
  PRODUCT: 'PRODUCT',
  STORE: 'STORE',
  CATEGORY: 'CATEGORY',
  SEARCH: 'SEARCH',
};

interface FilterBarProps {
  onFilterChange?: (filters: { eventType?: string; entityType?: string }) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const allParams = useAllQueryParams();

  const eventTypeOptions = [
    { value: '', label: t('activity.all_events') },
    { value: EventType.PRODUCT_VIEW, label: t('activity.product_view') },
    { value: EventType.PRODUCT_ADD_TO_BASKET, label: t('activity.product_add_to_basket') },
    { value: EventType.PRODUCT_REMOVE_FROM_BASKET, label: t('activity.product_remove_from_basket') },
    { value: EventType.STORE_VIEW, label: t('activity.store_view') },
    { value: EventType.CATEGORY_VIEW, label: t('activity.category_view') },
    { value: EventType.FAVORITE_ADD, label: t('activity.favorite_add') },
    { value: EventType.FAVORITE_REMOVE, label: t('activity.favorite_remove') },
    { value: EventType.ORDER_CREATED, label: t('activity.order_created') },
  ];

  const entityTypeOptions = [
    { value: '', label: t('activity.all_entities') },
    { value: EntityType.PRODUCT, label: t('activity.product') },
    { value: EntityType.STORE, label: t('activity.store') },
    { value: EntityType.CATEGORY, label: t('activity.category') },
  ];

  const handleEventTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSearchParams({
      ...allParams,
      eventType: value || '',
    });
    onFilterChange?.({ eventType: value || undefined });
  };

  const handleEntityTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSearchParams({
      ...allParams,
      entityType: value || '',
    });
    onFilterChange?.({ entityType: value || undefined });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <FormControl sx={{ minWidth: 200 }}>
        <Select
          value={allParams.eventType || ''}
          onChange={handleEventTypeChange}
          displayEmpty
          sx={{
            backgroundColor: 'white',
            borderRadius: 1,
          }}
        >
          {eventTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <Select
          value={allParams.entityType || ''}
          onChange={handleEntityTypeChange}
          displayEmpty
          sx={{
            backgroundColor: 'white',
            borderRadius: 1,
          }}
        >
          {entityTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

