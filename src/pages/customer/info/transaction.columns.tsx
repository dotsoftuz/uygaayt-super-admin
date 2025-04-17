import { Tooltip } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { numberFormat } from "utils/numberFormat";

export const useTransactionColumns = (): GridColumns => {
   const { t } = useTranslation();

   return [
      {
         field: t('enum.amount'),
         renderCell({ row }) {
            return (
               <span
                  style={{
                     color: row.type === 'income' ? "#17C657" : "#EB5757"
                  }}
               >
                  {row.type === 'income' ? `+${numberFormat(row.amount)}` : `-${numberFormat(row.amount)}`}
               </span>
            )
         },
         flex: 0.5
      },
      {
         field: t('common.type'),
         renderCell({ row }) {
            const type = row.customType; 
            return t(`type.${type}`);
         },
      },
      {
         field: t('common.date'),
         renderCell({ row }) {
            return row.createdAt && dayjs(row.createdAt).format('DD.MM.YYYY HH:mm');
         },
         flex: 0.6
      },
      {
         field: t('type.order'),
         renderCell({ row }) {
            return "#" + row?.order?.number
         },
         flex: 0.4
      },
   ];
};
