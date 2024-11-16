import {
  AutoCompleteForm,
  MainButton,
  SelectForm,
  TextInput,
} from "components";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MinimumOrderStyled } from "../container/Settings.styled";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { get } from "lodash";
import { toast } from "react-toastify";

interface IStates {
  _id: string;
  state: string;
  color: string;
  name: string;
  connectedState: string;
}

interface IBitoStates {
  _id: string;
  name: string;
}
const StateMap = () => {
  const [bitoOptions, setBitoOptions] = useState<any>([]);
  const { t } = useTranslation();
  const { control, handleSubmit, setValue, getValues } = useForm();

  const { data: stateMaps, status, refetch } = useApi("/state-map-store", {});

  const { mutate, status: updateStatus } = useApiMutation(
    "/state-map-store",
    "post",
    {
      onSuccess() {
        toast.success("Muvvaffaqiyatli");
        refetch();
      },
    }
  );

  const submit = (data: any) => {
    const requestData: any = [];
    Object.entries(data).forEach(([key, value]) => {
      requestData.push({
        stateId: key,
        connectedState: value ? value : null,
      });
    });
    const mp: Record<string, boolean> = {};
    const check = () => {
      for (let i = 0; i < requestData.length; i++) {
        if (requestData[i]?.connectedState) {
          if (mp[requestData[i].connectedState]) {
            return true;
          } else mp[requestData[i].connectedState] = true;
        }
      }

      return false;
    };

    if (!!check()) {
      toast.error("Bir hil xolat tanlash mumkin emas!!!");
    } else {
      mutate({ states: requestData });
    }
  };

  const handleChange = (e: any) => {};

  useEffect(() => {
    if (status == "success") {
      setBitoOptions(get(stateMaps, "data.bitoStates", []));
      get(stateMaps, "data.states", []).forEach((item: any) => {
        const bito = get(stateMaps, "data.bitoStates", []).find(
          (b: any) => b._id === item?.connectedState
        );

        if (item.connectedState && bito) {
          setValue(item._id, bito?._id);
        }
      });
    }
  }, [status]);

  return (
    <form onSubmit={handleSubmit(submit)} id="state-map">
      <MinimumOrderStyled>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2>Holat integratsiyalari</h2>
          <MainButton
            title={t("general.save")}
            variant="contained"
            type="submit"
            form="state-map"
          />
        </div>

        <Grid container mb={3} spacing={2}>
          <Grid item md={6}>
            <h3 style={{ color: "#006FFD" }}>Bito market</h3>
          </Grid>
          <Grid item md={6}>
            <h3 style={{ color: "#006FFD" }}>Bito</h3>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {get(stateMaps, "data.states", []).map(
            (state: IStates, index: number) => (
              <Fragment key={state._id}>
                <Grid item md={6}>
                  <TextInput
                    control={control}
                    // name={state._id}
                    name=""
                    inputProps={{ value: state.name }}
                    rules={{ required: false }}
                    type="text"
                    disabled
                  />
                </Grid>
                <Grid item md={6}>
                  <AutoCompleteForm
                    control={control}
                    name={state._id}
                    options={bitoOptions}
                    rules={{ required: false }}
                    onChange={handleChange}
                  />
                </Grid>
              </Fragment>
            )
          )}
        </Grid>
      </MinimumOrderStyled>
    </form>
  );
};

export default StateMap;
