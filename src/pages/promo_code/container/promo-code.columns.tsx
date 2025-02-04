import { GridColumns } from "@mui/x-data-grid";
import { Tooltip } from "antd";
import { get } from "lodash";
import { useTranslation } from "react-i18next";

export const useBannerColumns = (): GridColumns => {
  const { t } = useTranslation();

  return [
 
    {
      field: t("promo_code.name"),
      renderCell({ row }) {
        const title = row?.title;
        const truncatedTitle = title?.length > 50 ? `${title.substring(0, 50)}...` : title;
    
        return (
          <Tooltip title={title} arrow>
            <span>{truncatedTitle}</span>
          </Tooltip>
        );
      },
    },
    {
      field: t("ID"),
      renderCell({ row }) {
        return get(row, "uuid", "-");
      },
    },
    {
      field: t("promo_code.value"),
      renderCell({ row }) {
        return get(row, "amount", "-");
      },
    },
    {
      field: t("promo_code.usage"),
      renderCell({ row }) {
        return get(row, "used", "-");
      },
    },
    {
      field: t("promo_code.start_date"),
      renderCell({ row }) {
        return get(row, "dateFrom", "-");
      },
    },
    {
      field: t("promo_code.end_date"),
      renderCell({ row }) {
        return get(row, "dateTo", "-");
      },
    },
    {
      field: t("promo_code.status"),
      renderCell({ row }) {
        return get(row, "status", "-");
      },
    }
  ];
};
