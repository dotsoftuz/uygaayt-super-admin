import { Grid } from "@mui/material";
import { MainButton, TextInput } from "components";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  HeaderOfSettings,
  MinimumOrderStyled,
} from "../container/Settings.styled";
import {
  FullscreenControl,
  GeolocationControl,
  Map,
  Placemark,
  TypeSelector,
  YMaps,
  ZoomControl,
} from "react-yandex-maps";
import { useEffect, useState } from "react";
import YandexMap from "components/common/YandexMap/YandexMap";
import { ILocation } from "./../../../types/common.types";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { toast } from "react-toastify";

interface IStates {
  _id: string;
  state: string;
  color: string;
  name: string;
  connectedState: string;
}

const MainAddress = () => {
  const { t } = useTranslation();
  const [addressLocation, setAddressLocation] = useState<ILocation>();
  const { handleSubmit, watch, setValue } = useForm();

  const { data, status, refetch } = useApi("/settings-general");
  const { mutate } = useApiMutation("/settings-general", "put", {
    onSuccess() {
      refetch();
      toast.success(t("general.success"));
    },
  });

  const onSubmit = (data: Record<string, any>) => {
    const requestData = {
      locationCenter: addressLocation,
    };

    mutate(requestData);
  };

  useEffect(() => {
    if (status === "success") {
      const mainLoc = data.data;
      setAddressLocation(mainLoc.locationCenter);
    }
  }, [status]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="main-map-center">
      <HeaderOfSettings>
        <h2>{t("settings.map_address")}</h2>
        <MainButton
          title={t("general.save")}
          variant="contained"
          type="submit"
          form="main-map-center"
        />
      </HeaderOfSettings>
      <Grid container mb={3} spacing={2}>
        {/* <Grid item md={12}>
          <TextInput
            control={control}
            name="addressName"
            label={t("common.address")}
          />
        </Grid> */}
        <Grid item md={12}>
          <YandexMap
            getCoordinate={setAddressLocation}
            center={addressLocation}
            height="480px"
            // zoom={11}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default MainAddress;
