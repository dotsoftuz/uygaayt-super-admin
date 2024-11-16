import { GridColumns } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

export const useRoleColumns = (): GridColumns<any> => {
  const { t } = useTranslation();

  return [
    {
      field: t("common.name"),
      renderCell({ row }) {
        return row.name;
      },
    },
  ];
};
