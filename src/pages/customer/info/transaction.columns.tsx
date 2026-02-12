import { GridColumns } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { numberFormat } from "utils/numberFormat";

export const useTransactionColumns = (): GridColumns => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return [
    {
      field: t("enum.amount"),
      renderCell({ row }) {
        return (
          <span
            style={{
              color: row.type === "income" ? "#17C657" : "#EB5757",
            }}
          >
            {row.type === "income"
              ? `+${numberFormat(row.amount)}`
              : `-${numberFormat(row.amount)}`}
          </span>
        );
      },
      flex: 0.5,
    },
    {
      field: t("common.type"),
      renderCell({ row }) {
        const type = row.customType;
        return t(`type.${type}`);
      },
    },
    {
      field: t("common.date"),
      renderCell({ row }) {
        return row.createdAt && dayjs(row.createdAt).format("DD.MM.YYYY HH:mm");
      },
      flex: 0.6,
    },
    {
      field: t("type.order"),
      renderCell({ row }) {
        if (!row?.order?.number) {
          return "-";
        }
        return (
          <span
            style={{
              color: "#1976d2",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate(`/order/${row.order._id}`)}
          >
            #{row.order.number}
          </span>
        );
      },
      flex: 0.4,
    },
  ];
};
