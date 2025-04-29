import { GridColumns } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { numberFormat } from "utils/numberFormat";

export const useCustomerColumns = (): GridColumns => {
  const { t } = useTranslation();

  return [
    {
      field: t("common.firstName"),
      renderCell({ row }) {
        return get(row, "firstName", "")
      },
    },
    {
      field: t("common.lastName"),
      renderCell({ row }) {
        return get(row, "lastName", "")
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
    {
      field: t("common.date"),
      renderCell({ row }) {
        return dayjs(get(row, "createdAt", "")).format("YYYY-MM-DD HH:mm");
      },
    },

  ];
};
