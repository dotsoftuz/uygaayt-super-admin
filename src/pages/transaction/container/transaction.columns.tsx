import { Tooltip } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { numberFormat } from "utils/numberFormat";

export const useTransactionColumns = (): GridColumns => {
   const { t } = useTranslation();

   return [
      // {
      //    field: "Do'kon nomi",
      //    renderCell({ row }) {
      //       return row.store?.name;
      //    },
      // },
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
      },
      {
         field: t('common.date'),
         renderCell({ row }) {
            return row.createdAt && dayjs(row.createdAt).format('DD.MM.YYYY HH:mm');
         },
      },
      {
         field: t('common.comment'),
         renderCell({ row }) {
            return <Tooltip title={row.comment} placement="top"><span className="comment">{row.comment}</span></Tooltip>
         },
      },
   ];
};
