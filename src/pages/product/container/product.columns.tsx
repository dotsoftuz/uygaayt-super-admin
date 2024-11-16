import { GridColumns } from "@mui/x-data-grid";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { numberFormat } from "utils/numberFormat";

export const useProductColumns = (): GridColumns => {
  const { t } = useTranslation();

  return [
    {
      field: t("common.productName"),
      renderCell({ row }) {
        return get(row, "name", "");
      },
    },
    {
      field: t("common.price"),
      renderCell({ row }) {
        return numberFormat(get(row, "price", ""));
      },
    },
    {
      field: t("common.residue"),
      renderCell({ row }) {
        return numberFormat(get(row, "inStock", ""));
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
