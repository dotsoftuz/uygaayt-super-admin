import { Grid } from "@mui/material";
import { MainButton } from "components";
import TextEditor from "components/form/TextEditor/TextEditor";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { HeaderOfSettings, SettingTitle } from "../container/Settings.styled";
import { get } from "lodash";

const WebsiteConditions = () => {
  const { t } = useTranslation();
  const { handleSubmit, watch, setValue } = useForm();

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
        <SettingTitle>{t("settings.website_conditions")}</SettingTitle>
        <MainButton
          title={t("general.save")}
          variant="contained"
          type="submit"
          form="website_conditions"
          disabled={status === "loading"}
        />
      </HeaderOfSettings>

      <Grid container>
        <Grid md={12} sm={12}>
          {/* <label className="custom-label">{t("common.description")}</label> */}
          <TextEditor
            value={watch("termsOfUse")}
            onChange={(value) => setValue("termsOfUse", value)}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default WebsiteConditions;
