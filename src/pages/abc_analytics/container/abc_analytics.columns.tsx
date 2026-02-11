import { GridColumns } from "@mui/x-data-grid";
import { Tooltip } from "antd";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { numberFormat } from "utils/numberFormat";

export const useProductColumns = (): GridColumns => {
  const { t } = useTranslation();
  const currentLang = localStorage.getItem("i18nextLng") || "uz";


  return [
    {
      field: t("common.productName"),
      renderCell({ row }) {
        const title = row?.product?.name?.[currentLang];
        const truncatedTitle = title?.length > 30 ? `${title.substring(0, 30)}...` : title;
    
        return (
          <Tooltip title={title} arrow>
            <span>{truncatedTitle}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "total_amount",
      headerName: t("common.sold")!,
      renderCell({ row }) {
        return numberFormat(get(row, "total_amount", ""));
      },
    },
    {
      field: "total_price",
      headerName: t("order.totalPrice")!,
      renderCell({ row }) {
        return numberFormat(get(row, "total_price", ""));
      },
    },
    {
      field: "share",
      headerName: t("general.share") + " (%)"!,
      renderCell({ row }) {
        return numberFormat(get(row, "share", ""));
      },
    },
    {
      field: "group",
      headerName: t("common.type")!,
      renderCell({ row }) {
        return get(row, "group", "");
      },
    },
    // {
    //   field: t("common.status"),
    //   renderCell({ row }) {
    //     return get(row, "status", "");
    //   },
    // },
  ];
};
