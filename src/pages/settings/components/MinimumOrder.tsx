import { Grid } from "@mui/material";
import { MinimumDollarIcon, WarningIcon } from "assets/svgs";
import { MainButton, TextInput } from "components";
import useCommonContext from "context/useCommon";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { get } from "lodash";
import { MinimumOrderStyled } from "pages/settings/container/Settings.styled";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { numberFormat } from "utils/numberFormat";

const MinimumOrder = () => {
  const { t } = useTranslation();
  const {
    state: { data: settingsData },
  } = useCommonContext();

  const { control, reset, handleSubmit } = useForm();

  const { data, status } = useApi("settings-general/store");
  const { data: adminData } = useApi("settings-general");

  const { mutate } = useApiMutation("settings-general/store", "post", {
    onSuccess() {
      toast.success(t("general.success"));
    },
  });

  useEffect(() => {
    if (status === "success") {
      reset(data.data);
    }
  }, [status]);

  const submit = handleSubmit((data: any) => {
    mutate(data);
  });

  return (
    <MinimumOrderStyled>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2>Minimal buyurtma miqdori</h2>
        <MainButton
          title={t("general.save")}
          variant="contained"
          onClick={submit}
        />
      </div>
      <div className="note">
        <MinimumDollarIcon />
        Admin tomonidan belgilangan minimal buyurtma miqdori{" "}
        {numberFormat(adminData?.data.orderMinimumPrice)}{" "}
        {get(settingsData, "currency", "uzs")}. Siz shu miqdordan kam kirita
        olmasligingizni eslatib o'tamiz.
      </div>
      <div className="warning">
        <WarningIcon />
        Agar minimal buyurtma miqdori ko'tarilsa sizdagi minimal miqdori ham
        avtomatik tarza ko'tariladi
      </div>
      <Grid container>
        <Grid item md={4}>
          <TextInput
            control={control}
            name="orderMinimumPrice"
            label={"Miqdori " + `(${get(settingsData, "currency", "uzs")})`}
            type="number"
            inputProps={{
              min: adminData?.data.orderMinimumPrice,
            }}
          />
        </Grid>
      </Grid>
    </MinimumOrderStyled>
  );
};

export default MinimumOrder;
