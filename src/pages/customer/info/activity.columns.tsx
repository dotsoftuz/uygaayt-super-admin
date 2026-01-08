import { Chip } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export const useActivityColumns = (): GridColumns => {
   const { t } = useTranslation();

   const getEventTypeLabel = (eventType: string) => {
      const eventMap: Record<string, string> = {
         PRODUCT_VIEW: t('activity.product_view'),
         PRODUCT_ADD_TO_BASKET: t('activity.product_add_to_basket'),
         PRODUCT_REMOVE_FROM_BASKET: t('activity.product_remove_from_basket'),
         STORE_VIEW: t('activity.store_view'),
         CATEGORY_VIEW: t('activity.category_view'),
         SEARCH: t('activity.search'),
         FAVORITE_ADD: t('activity.favorite_add'),
         FAVORITE_REMOVE: t('activity.favorite_remove'),
         ORDER_CREATED: t('activity.order_created'),
         PRODUCT_LIST_VIEW: t('activity.product_view'),
         STORE_LIST_VIEW: t('activity.store_view'),
      };
      return eventMap[eventType] || eventType;
   };

   const getEventTypeColor = (eventType: string) => {
      if (eventType.includes('VIEW')) return 'primary';
      if (eventType.includes('ADD') || eventType.includes('CREATED')) return 'success';
      if (eventType.includes('REMOVE')) return 'error';
      if (eventType === 'SEARCH') return 'info';
      return 'default';
   };

   const getEntityName = (row: any) => {
      if (row.product?.name) {
         const name = row.product.name;
         return typeof name === 'string' ? name : (name.uz || name.ru || '');
      }
      if (row.store?.name) {
         return row.store.name;
      }
      if (row.category?.name) {
         const name = row.category.name;
         return typeof name === 'string' ? name : (name.uz || name.ru || '');
      }
      if (row.search?.query) {
         return row.search.query;
      }
      return '-';
   };

   const getDescription = (row: any) => {
      if (row.product) {
         return `${t('activity.product')}: ${getEntityName(row)}`;
      }
      if (row.store) {
         return `${t('activity.store')}: ${getEntityName(row)}`;
      }
      if (row.category) {
         return `${t('activity.category')}: ${getEntityName(row)}`;
      }
      if (row.search) {
         return `${t('activity.search_query')}: ${getEntityName(row)}`;
      }
      return '-';
   };

   return [
      {
         field: t('activity.event_type'),
         renderCell({ row }) {
            return (
               <Chip
                  label={getEventTypeLabel(row.eventType)}
                  color={getEventTypeColor(row.eventType) as any}
                  size="small"
               />
            );
         },
         flex: 1
      },
      {
         field: t('activity.entity_name'),
         renderCell({ row }) {
            return getEntityName(row);
         },
         flex: 1.5
      },
      {
         field: t('activity.description'),
         renderCell({ row }) {
            return getDescription(row);
         },
         flex: 2
      },
      {
         field: t('activity.date_time'),
         renderCell({ row }) {
            return row.createdAt && dayjs(row.createdAt).format('DD.MM.YYYY HH:mm:ss');
         },
         flex: 1
      },
   ];
};

