import { GridColumns } from "@mui/x-data-grid";
import { get } from "lodash";
import { useTranslation } from "react-i18next";

export const useRatingColumns = (): GridColumns => {
  const { t } = useTranslation();

  return [
    {
      field: t("common.name"),
      renderCell({ row }) {
        return get(row, 'name', '')
      },
    },
    {
      field: t("common.symbol"),
      renderCell({ row }) {
        return get(row, 'symbol', '')
      },
    },
  ];
};
