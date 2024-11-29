import { GridColumns } from "@mui/x-data-grid";
import { get } from "lodash";
import { useTranslation } from "react-i18next";

export const useBannerColumns = (): GridColumns => {
  const { t } = useTranslation();
  const currentLang = localStorage.getItem("i18nextLng") || "uz"; 

  return [
    {
      field: t("common.name"),
      renderCell({ row }) {
        return row?.title?.[currentLang];
      },
    },
    // {
    //   field: t("common.store"),
    //   renderCell({ row }) {
    //     return get(row, "store.name", "-");
    //   },
    // },
  ];
};
