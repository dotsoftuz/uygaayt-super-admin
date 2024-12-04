import { GridColumns } from "@mui/x-data-grid";
import { get } from "lodash";
import { useTranslation } from "react-i18next";

export const useCourierColumns = (): GridColumns => {
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
      field: t("common.rating"),
      renderCell(params) {
        return params.row.role?.name;
      },
    },
    {
      field: "true",
      headerName: t("common.late_order")!,
      sortable: true,
      renderCell(params) {
        return params.row.role?.name;
      },
    },
    {
      sortable: true,
      field: "false",
      headerName: t("common.delivered_on_time")!,
      renderCell(params) {
        return params.row.role?.name;
      },
    },
  ];
};
