import { GridColumns } from "@mui/x-data-grid";
import { get } from "lodash";
import { useTranslation } from "react-i18next";

export const useCourierColumns = (): GridColumns => {
  const { t } = useTranslation();

  return [
    {
      field: t("common.fullName"),
      renderCell(params) {
        return get(params, 'row.courier.firstName', '') + " " + get(params, 'row.courier.lastName', '');
      },
      flex: 1.5
    },
    {
      field: t("common.phoneNumber"),
      renderCell(params) {
        return params.row.courier.phoneNumber;
      },
    },
    {
      field: t("common.rating"),
      renderCell(params) {
        return params?.row?.courier.rating.toFixed(1) !== 5 ? params?.row?.courier.rating.toFixed(1) : '5';
      },
    },
    {
      field: "totalFinished",
      headerName: t("common.late_order")!,
      sortable: true,
      renderCell(params) {
        return params.row.totalFinished - params.row.totalArrivedOnTime
      },
    },
    {
      sortable: true,
      field: "totalArrivedOnTime",
      headerName: t("common.delivered_on_time")!,
      renderCell(params) {
        return params.row.totalArrivedOnTime
      },
    },
  ];
};
