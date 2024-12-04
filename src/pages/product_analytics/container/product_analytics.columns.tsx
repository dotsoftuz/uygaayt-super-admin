import { GridColumns } from "@mui/x-data-grid";
import { Tooltip } from "antd";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { numberFormat } from "utils/numberFormat";

export const useProductColumns = (): GridColumns => {
  const { t } = useTranslation();

  return [
    {
      field: t("common.productName"),
      renderCell({ row }) {
        const title = row?.name;
        const truncatedTitle = title?.length > 30 ? `${title.substring(0, 30)}...` : title;
    
        return (
          <Tooltip title={title} arrow>
            <span>{truncatedTitle}</span>
          </Tooltip>
        );
      },
    },
    {
      field: t("common.price"),
      renderCell({ row }) {
        return numberFormat(get(row, "price", ""));
      },
    },
    {
      field: t("common.discountValue"),
      renderCell({ row }) {
        return (
          numberFormat(get(row, "discountValue", "")) + 
          (row.discountType === "percent" ? "%" : "")
        );
      },
    },
    {
      field: t("common.residue"),
      renderCell({ row }) {
        return numberFormat(get(row, "inStock", ""));
      },
    },
    {
      field: "sold",
      headerName: t("common.sold")!,
      sortable: true,
      renderCell({ row }) {
        return numberFormat(get(row, "", ""));
      },
    },
    {
      field: "customer_bought_count",
      headerName: t("common.customer_bought_count")!,
      sortable: true,
      renderCell({ row }) {
        // return numberFormat(get(row, "inStock", ""));
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
