import { useTranslation } from "react-i18next";

const NoDataFound = () => {
  const { t } = useTranslation();

  return (
    <div className="no-data-found">
      <h2>{t("general.notFound")}</h2>
    </div>
  );
};

export default NoDataFound;
