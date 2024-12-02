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

const PremiumDiscountOrder = ({ data }: any) => {
  const { t } = useTranslation();
  const { id } = useParams();


  const {
    data: getData,
    refetch,
    status: getStatus,
  } = useApi(`/discount/get/premium`, {}, { suspense: false });

  const { handleSubmit, register, watch, control, setValue, reset, formState: { errors }, } = useForm({
    defaultValues: {
      premiumDiscount: { amount: 0, type: "amount", number: 1 },
    },
  });

  const { mutate, status } = useApiMutation("/discount/premium/update", "post", {
    onSuccess({ data }) {
      if (data) {
        refetch();
        toast.success(t("general.success"));
      }
    },
  });

  const onSubmit = (data: any) => {
    mutate({
      premiumDiscount: {
        ...data.premiumDiscount,
        amount: Number(String(data.premiumDiscount?.amount)?.replace(" ", "")),
        number: 1
      },
    });
  };


  useEffect(() => {
    if (getStatus === "success") {
      console.log(getData?.data?.discounts);
      const cashback = getData?.data?.premiumDiscount;
      if (cashback) {
        reset({
          premiumDiscount: {
            amount: cashback.amount || 0,
            number: 1,
            type: cashback.type || "amount",
          },
        });
      }
    }
  }, [getStatus, getData, reset]);




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
        <Grid item md={8} xs={8} display={"flex"} gap={2} paddingBlock={1}>
          <Grid item md={4} xs={4}>
            <Input
              label={t(
                `driver.${watch(`premiumDiscount.type`)}`
              )}
              params={{
                ...register(
                  `premiumDiscount.amount`,
                  watch(`premiumDiscount.type`)
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
                        watch(`premiumDiscount.type`) ===
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
                          `premiumDiscount.amount`,
                          watch(`premiumDiscount.type`)
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
                          `premiumDiscount.amount`,
                          watch(`premiumDiscount.type`)
                            ? e?.target?.value
                            : currencyFormatter(e?.target?.value)
                        ),
                    }
                ),
              }}
              error={errors.premiumDiscount?.amount}
            />
          </Grid>

          <Grid item md={3} xs={3}>
            <Box display="flex" alignItems="start" marginTop={"22.6px"}>
              <StyledSwitch
                className={
                  watch(`premiumDiscount.type`) === "percent"
                    ? "show"
                    : ""
                }
                onClick={() =>
                  setValue(
                    `premiumDiscount.type`,
                    watch(`premiumDiscount.type`) ===
                      "percent"
                      ? "amount"
                      : "percent"
                  )
                }
                style={{
                  borderColor: errors.premiumDiscount?.type
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
        </Grid>
      </Grid>
    </form>
  );
};

export default PremiumDiscountOrder;
