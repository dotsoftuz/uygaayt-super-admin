import { GridColumns } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

export const useConstructorColumns = (): GridColumns => {
  const { t } = useTranslation();

  return [
    {
      field: "name",
      headerName: t("common.name")!,
      flex: 1.5
    },
    {
      field: "date",
      headerName: t("common.date")!,
      flex: 1
    },
  ];
};

