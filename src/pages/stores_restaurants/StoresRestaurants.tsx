import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

const StoresRestaurants = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "20px" }}>
      <Grid container>
        <Grid item xs={12}>
          <h1>{t("sidebar.stores_restaurants")}</h1>
          <p>Do'konlar va Restoranlar sahifasi</p>
        </Grid>
      </Grid>
    </div>
  );
};

export default StoresRestaurants;

