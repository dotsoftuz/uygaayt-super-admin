import { Box, Grid } from "@mui/material";
import { Input, MainButton, TextInput } from "components";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { HeaderOfSettings, SettingTitle } from "../container/Settings.styled";
import { StyledPercent, StyledSwitch } from "../style/discount.style";
import { Delete, Percent } from "@mui/icons-material";
import CommonButton from "components/common/commonButton/Button";
import { PlusIcon } from "assets/svgs";
import currencyFormatter from "utils/currencyFormatter";
import { realNumberPattern } from "utils/pattern";
import { useParams } from "react-router-dom";

const BonusOrder = ({ data }: any) => {
  const { t } = useTranslation();
  const { id } = useParams();


  const {
    data: getData,
    refetch,
    status: getStatus,
  } = useApi(`/discount/get/bonus`, {}, { suspense: false });

  const { handleSubmit, register, watch, control, setValue, reset, formState: { errors }, } = useForm({
    defaultValues: {
      // orderCashback: 0,
      // orderCashbackType: "amount",
      discounts: [{ number: 0, amount: 0, type: "amount" }],
      defaultDiscount: { amount: 0, type: "amount" }
    },
  });

  const { mutate, status } = useApiMutation("discount/bonus/update", "post", {
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
      defaultDiscount: {
        ...data.defaultDiscount,
        amount: Number(String(data.defaultDiscount?.amount)?.replace(" ", "")),
        number: 1
      },
      discounts: data.discounts?.map((item: any) => ({
        ...item,
        amount: Number(String(item.amount)?.replace(" ", "")),
      })),
    });
  };

  useEffect(() => {
    if (getStatus === "success") {
      const cashback = getData?.data?.discounts || [];
      const defaultDiscount = getData?.data?.defaultDiscount || [];
      reset({
        discounts: cashback.map((item: any) => ({
          number: item.number || 0,
          amount: item.amount || 0,
          type: item.type || "amount",
        })),
        defaultDiscount: {
          amount: defaultDiscount.amount || 0,
          type: defaultDiscount.type || "amount",
        },
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
        <SettingTitle>{t("settings.initial_bonus")}</SettingTitle>
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
                `driver.${watch(`defaultDiscount.type`)}`
              )}
              params={{
                ...register(
                  `defaultDiscount.amount`,
                  watch(`defaultDiscount.type`)
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
                        watch(`defaultDiscount.type`) ===
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
                          `defaultDiscount.amount`,
                          watch(`defaultDiscount.type`)
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
                          `defaultDiscount.amount`,
                          watch(`defaultDiscount.type`)
                            ? e?.target?.value
                            : currencyFormatter(e?.target?.value)
                        ),
                    }
                ),
              }}
              error={errors.defaultDiscount?.amount}
            />
          </Grid>

          <Grid item md={3} xs={3}>
            <Box display="flex" alignItems="start" marginTop={"28px"}>
              <StyledSwitch
                className={
                  watch(`defaultDiscount.type`) === "percent"
                    ? "show"
                    : ""
                }
                onClick={() =>
                  setValue(
                    `defaultDiscount.type`,
                    watch(`defaultDiscount.type`) ===
                      "percent"
                      ? "amount"
                      : "percent"
                  )
                }
                style={{
                  borderColor: errors.defaultDiscount?.type
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
        {fields.map((field: any, index: any) => (
          <Grid
            container
            spacing={2}
            key={field.id}
            sx={{ paddingBlock: 1, display: "flex", flexWrap: "wrap" }}
          >
            <Grid item xs={12} sm={6} md={3} className="flex items-end">
              <TextInput
                control={control}
                name={`discounts.${index}.number`}
                type="number"
                rules={{ required: false }}
                label={t("settings.number")}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3} className="flex items-end">
              <Input
                label={t(`driver.${watch(`discounts.${index}.type`)}`)}
                params={{
                  ...register(
                    `discounts.${index}.amount`,
                    watch(`discounts.${index}.type`)
                      ? {
                        required: {
                          value: true,
                          message: t("error_messages.percent_field_required"),
                        },
                        pattern: {
                          value: realNumberPattern,
                          message: t("error_messages.place_enter_a_number"),
                        },
                        max:
                          watch(`discounts.${index}.type`) === "percent"
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
                          message: t("error_messages.percent_field_required"),
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

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="flex items-end mt-5"
            >
              <StyledSwitch
                className={
                  watch(`discounts.${index}.type`) === "percent" ? "show" : ""
                }
                onClick={() =>
                  setValue(
                    `discounts.${index}.type`,
                    watch(`discounts.${index}.type`) === "percent"
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
                <StyledPercent style={{ fontWeight: 500 }}>
                  {data?.data?.currency}
                </StyledPercent>
              </StyledSwitch>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="flex items-end mt-5"
            >
              <Delete
                sx={{
                  cursor: "pointer",
                  color: "#D54239",
                  fontSize: "1.5rem",
                }}
                onClick={() => {
                  remove(index);
                }}
              />
            </Grid>
          </Grid>

        ))}
        <Grid item xs={12} md={2}  paddingBlock={2}>
          <CommonButton
            startIcon={<PlusIcon />}
            type="button"
            title={`${t("general.add")}`}
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

export default BonusOrder;
