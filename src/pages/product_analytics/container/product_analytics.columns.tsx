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
      field: t("common.price"),
      renderCell({ row }) {
        return numberFormat(get(row, "product.price", ""));
      },
    },
    {
      field: t("common.discountValue"),
      renderCell({ row }) {
        return (
          numberFormat(get(row, "product.discountValue", "")) + 
          (row?.product?.discountType === "percent" ? "%" : "")
        );
      },
    },
    {
      field: t("common.residue"),
      renderCell({ row }) {
        return numberFormat(get(row, "product.inStock", ""));
      },
    },
    {
      field: "total_amount",
      headerName: t("common.sold")!,
      sortable: true,
      renderCell({ row }) {
        return numberFormat(get(row, "total_amount", ""));
      },
    },
    {
      field: "customerCount",
      headerName: t("common.customer_bought_count")!,
      sortable: true,
      renderCell({ row }) {
        return numberFormat(get(row, "customerCount", ""));
      },
    },
    {
      field: "total_price",
      headerName: t("order.totalPrice")!,
      sortable: true,
      renderCell({ row }) {
        return numberFormat(get(row, "total_price", ""));
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
