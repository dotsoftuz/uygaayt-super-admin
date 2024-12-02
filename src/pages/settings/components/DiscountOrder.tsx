import { Alert, Box, Grid } from "@mui/material";
import { Input, MainButton, SwitchBox, TextInput } from "components";
import TextEditor from "components/form/TextEditor/TextEditor";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { HeaderOfSettings, SettingTitle } from "../container/Settings.styled";
import { get } from "lodash";
import { StyledPercent, StyledSwitch } from "../style/discount.style";
import { Delete, Percent } from "@mui/icons-material";
import CommonButton from "components/common/commonButton/Button";
import { PlusIcon } from "assets/svgs";
import currencyFormatter from "utils/currencyFormatter";
import { realNumberPattern } from "utils/pattern";
import { useParams } from "react-router-dom";

const DiscountOrder = ({data}:any) => {
  const { t } = useTranslation();
  const { id } = useParams();


  const {
    data: getData,
    refetch,
    status: getStatus,
  } = useApi(`/discount/get/regular`, {}, { suspense: false });

  const { handleSubmit, register, watch, control, setValue, reset, formState: { errors }, } = useForm({
    defaultValues: {
      // orderCashback: 0,
      // orderCashbackType: "amount",
      discounts: [{ number: 0, amount: 0, type: "amount" }],
    },
  });

  const { mutate, status } = useApiMutation("/discount/update", "post", {
    onSuccess({ data }) {
      if (data) {
        refetch();
        toast.success(t("general.success"));
      }
    },
  });

  const onSubmit = (data: any) => {
    mutate({
      // _id: getData?.data._id,
      discounts: data.discounts?.map((item: any) => ({
        ...item,
        amount: Number(String(item.amount)?.replace(" ", "")),
      })),
    });
  };

  useEffect(() => {
    if (getStatus === "success") {
      console.log(getData?.data?.discounts); 
      const cashback = getData?.data?.discounts || [];
      reset({
        discounts: cashback.map((item: any) => ({
          number: item.number || 0,
          amount: item.amount || 0,
          type: item.type || "amount",
        })),
      });
    }
  }, [getStatus, getData, reset]);


  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    name: "discounts",
    control,
  });

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

      <Grid container display={'block'}>
        {/* <Grid md={12} sm={12} style={{ paddingBottom: "20px" }}>
          <Alert severity="warning">Dastlabni 3ta buyurtma uchun kiritilgan foiz umumiy buyurtma narxidan ayiriladi</Alert>
        </Grid> */}
        {fields.map((field: any, index: any) => (
          <Grid item md={6} xs={6} key={field.id} display={"flex"} gap={2} paddingBlock={1}>
            <Grid item md={3} xs={3}>
              <TextInput
                control={control}
                name={`discounts.${index}.number`}
                type="number"
                rules={{ required: false }}
                label={"Soni"}
              />
            </Grid>
            <Grid item md={3} xs={3}>
              <Input
                label={t(
                  `driver.${watch(`discounts.${index}.type`)}`
                )}
                params={{
                  ...register(
                    `discounts.${index}.amount`,
                    watch(`discounts.${index}.type`)
                      ? {
                        required: {
                          value: true,
                          message: t(
                            "error_messages.percent_field_required"
                          ),
                        },
                        pattern: {
                          value: realNumberPattern,
                          message: t(
                            "error_messages.place_enter_a_number"
                          ),
                        },
                        max:
                          watch(`discounts.${index}.type`) ===
                            "percent"
                            ? {
                              value: 100,
                              message: t(
                                "error_messages.no_more_then_100_can_be_entered"
                              ),
                            }
                            : undefined,
                        onChange: (e: any) =>
                          setValue(
                            `discounts.${index}.amount`,
                            watch(`discounts.${index}.type`)
                              ? e?.target?.value
                              : currencyFormatter(e?.target?.value)
                          ),
                      }
                      : {
                        required: {
                          value: true,
                          message: t(
                            "error_messages.percent_field_required"
                          ),
                        },
                        onChange: (e: any) =>
                          setValue(
                            `discounts.${index}.amount`,
                            watch(`discounts.${index}.type`)
                              ? e?.target?.value
                              : currencyFormatter(e?.target?.value)
                          ),
                      }
                  ),
                }}
                error={errors.discounts?.[index]?.amount}
              />
            </Grid>

            <Grid item md={2} xs={2}>
              <Box display="flex" alignItems="start" marginTop={"22.6px"}>
                <StyledSwitch
                  className={
                    watch(`discounts.${index}.type`) === "percent"
                      ? "show"
                      : ""
                  }
                  onClick={() =>
                    setValue(
                      `discounts.${index}.type`,
                      watch(`discounts.${index}.type`) ===
                        "percent"
                        ? "amount"
                        : "percent"
                    )
                  }
                  style={{
                    borderColor: errors.discounts?.[index]?.type
                      ? "red"
                      : "rgba(49,57,73,0.1)",
                  }}
                >
                  <StyledPercent>
                    <Percent />
                  </StyledPercent>
                  <StyledPercent style={{ fontWeight: "500" }}>
                    {data?.data?.currency}
                  </StyledPercent>
                </StyledSwitch>
              </Box>
            </Grid>

            <Grid item md={1} xs={1}>
              <span style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', position: "relative",
                top: "35px"
              }}>
                <Delete
                  style={{
                    cursor: "pointer",
                    color: "#D54239",
                  }}
                  onClick={() => {
                    remove(index);
                  }}
                />
              </span>
            </Grid>
          </Grid>
        ))}
        <Grid item md={8} xs={12} paddingBlock={2}>
          <CommonButton
            startIcon={<PlusIcon />}
            type="button"
            onClick={() => {
              const newValue = {
                number: 0,
                amount: 0,
                type: "amount",
              };
              append(newValue);
            }}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default DiscountOrder;
