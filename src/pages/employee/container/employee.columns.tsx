import { GridColumns } from "@mui/x-data-grid";
import { get } from "lodash";
import { useTranslation } from "react-i18next";

export const useEmployeeColumns = (): GridColumns => {
  const { t } = useTranslation();

  return [
    {
      field: t("common.fullName"),
      renderCell(params) {
        return get(params, 'row.firstName', '') + " " + get(params, 'row.lastName', '');
      },
      flex: 1.5
    },
    {
      field: t("common.phoneNumber"),
      renderCell(params) {
        return params.row.phoneNumber;
      },
    },
    {
      field: t("common.role"),
      renderCell(params) {
        return params.row.role?.name;
      },
    },
  ];
};
