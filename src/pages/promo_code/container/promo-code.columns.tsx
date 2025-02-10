import { GridColumns } from "@mui/x-data-grid";
import { Tooltip } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { numberFormat } from "utils/numberFormat";

export const useBannerColumns = (): GridColumns => {
  const { t } = useTranslation();

  return [
 
    {
      field: t("promo_code.name"),
      renderCell({ row }) {
        const title = row?.name;
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
        return get(row, "code", "-");
      },
    },
    {
      field: t("promo_code.value"),
      renderCell({ row }) {
        return numberFormat(get(row, "amount", "-"));
      },
    },
    {
      field: t("promo_code.usage"),
      renderCell({ row }) {
        return get(row, "maxUsage", "-");
      },
    },
    {
      field: t("promo_code.used_count"),
      renderCell({ row }) {
        return get(row, "usedCount", "-");
      }
    },
    {
      field: t("promo_code.start_date"),
      renderCell({ row }) {
        return dayjs(get(row, "fromDate", "-")).format('DD.MM.YYYY HH:mm')
      },
    },
    {
      field: t("promo_code.end_date"),
      renderCell({ row }) {
        return dayjs(get(row, "toDate", "-")).format('DD.MM.YYYY HH:mm')
      },
    },
    {
      field: t("promo_code.status"),
      renderCell({ row }) {
        return get(row, "state", "-");
      },
    }
  ];
};
