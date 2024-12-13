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
        const fullName = get(row, "customer.fullName", "");
        const isLong = fullName.length > 20;
        const displayText = isLong ? `${fullName.slice(0, 20)}...` : fullName;
    
        return (
          <span title={isLong ? fullName : undefined}>
            {displayText}
          </span>
        );
      },
    },
    {
      field: t("common.phoneNumber"),
      renderCell({ row }) {
        return get(row, "customer.phoneNumber", "");
      },
    },
    {
      field: "totalOrders",
      sortable: true,
      headerName: t("common.orderAmount")!,
      renderCell({ row }) {
        return get(row, "total_amount", "");
      },
    },
    {
      field: "totalOrdersPrice",
      sortable: true,
      headerName: t("common.orderPrice")!,
      renderCell({ row }) {
        return numberFormat(get(row, "total_price", ""));
      },
    },
  ];
};
