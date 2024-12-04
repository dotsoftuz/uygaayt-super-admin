import { GridColumns } from "@mui/x-data-grid";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { numberFormat } from "utils/numberFormat";

export const useCustomerColumns = (): GridColumns => {
  const { t } = useTranslation();

  return [
    {
      field: t("common.fullName"),
      renderCell({ row }) {
        return get(row, "fullName", "");
      },
    },
    {
      field: t("common.phoneNumber"),
      renderCell({ row }) {
        return get(row, "phoneNumber", "");
      },
    },
    {
      field: t("common.orderAmount"),
      renderCell({ row }) {
        return get(row, "totalOrders", "");
      },
    },
    {
      field: t("common.orderPrice"),
      renderCell({ row }) {
        return numberFormat(get(row, "totalOrdersPrice", ""));
      },
    },
  ];
};
