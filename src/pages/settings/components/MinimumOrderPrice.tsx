import { Alert, Grid } from "@mui/material";
import { MainButton, TextInput } from "components";
import TextEditor from "components/form/TextEditor/TextEditor";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { HeaderOfSettings, SettingTitle } from "../container/Settings.styled";
import { get } from "lodash";

const MinimumOrderPrice = () => {
  const { t } = useTranslation();
  const { handleSubmit, watch, control, setValue } = useForm();

  const {
    data: getData,
    refetch,
    status: getStatus,
  } = useApi("/site-settings", {}, { suspense: false });

  const { mutate, status } = useApiMutation("/site-settings", "post", {
    onSuccess({ data }) {
      if (data) {
        refetch();
        toast.success(t("general.success"));
      }
    },
  });

  const onSubmit = (data: any) => {
    mutate(data);
  };

  useEffect(() => {
    setValue("termsOfUse", getData?.data?.termsOfUse);
  }, [getData]);

  return (
    <form id="website_conditions" onSubmit={handleSubmit(onSubmit)}>
      <HeaderOfSettings>
        <SettingTitle>Dastlabki chegirmalar</SettingTitle>
        <MainButton
          title={t("general.save")}
          variant="contained"
          type="submit"
          form="website_conditions"
          disabled={status === "loading"}
        />
      </HeaderOfSettings>

      <Grid container>
        <Grid md={12} sm={12} style={{ paddingBottom: "20px" }}>
          <Alert severity="warning">Dastlabni 3ta buyurtma uchun kiritilgan foiz umumiy buyurtma narxidan ayiriladi</Alert>
        </Grid>
        <Grid item md={12} xs={12}>
          <div className="item">
            <span className="key">Foiz %</span>
            <TextInput
              control={control}
              name="percent"
              type="number"
              rules={{ required: false }}
            />
          </div>
        </Grid>
      </Grid>
    </form>
  );
};

export default MinimumOrderPrice;
