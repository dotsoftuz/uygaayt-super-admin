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
        const discountValue = get(row, "discountValue", "");
        if (discountValue === 0) {
          return ""; 
        }
        return (
          numberFormat(discountValue) + 
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
      field: t("common.parent_category"),
      renderCell({ row }) {
        return get(row, "category.parent.name", "")?.[currentLang] || get(row, "category.name", "")?.[currentLang];
      },
    },
    {
      field: t("common.child_category"),
      renderCell({ row }) {
        return  get(row, "category.parent.name", "")?.[currentLang] && get(row, "category.name", "")?.[currentLang];
      },
    },
  ];
};
