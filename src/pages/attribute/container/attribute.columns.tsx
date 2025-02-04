import { GridColumns } from "@mui/x-data-grid";
import { Tooltip } from "antd";
import { get } from "lodash";
import { useTranslation } from "react-i18next";

export const useAttributeColumns = (): GridColumns => {
  const { t } = useTranslation();
  const currentLang = localStorage.getItem("i18nextLng") || "uz"; 

  return [
    {
      field: t("common.name"),
      renderCell({ row }) {
        const title = row?.name?.[currentLang];
        const truncatedTitle = title?.length > 50 ? `${title.substring(0, 50)}...` : title;
    
        return (
          <Tooltip title={title} arrow>
            <span>{truncatedTitle}</span>
          </Tooltip>
        );
      },
    }
    
    // {
    //   field: t("common.store"),
    //   renderCell({ row }) {
    //     return get(row, "store.name", "-");
    //   },
    // },
  ];
};
