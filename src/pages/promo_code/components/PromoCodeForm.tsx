import { FC, useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import { AutoCompleteForm, DatePickerForm, ImageInput, TextInput } from "components";
import { Controller, UseFormReturn } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";
import TextEditor from "components/form/TextEditor/TextEditor";
import { debounce } from "lodash";

interface IEmployeesForm {
  formStore: UseFormReturn<any>;
  editingBannerId: string;
  resetForm: () => void;
}
const PromoCodeForm: FC<IEmployeesForm> = ({
  formStore,
  editingBannerId,
  resetForm,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, watch, setValue } = formStore;

  const { mutate, status } = useApiMutation(
    editingBannerId ? `/promocode/update` : "/promocode/create",
    editingBannerId ? "put" : "post"
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(
    `promocode/get-by-id/${editingBannerId}`,
    {},
    {
      enabled: !!editingBannerId,
      suspense: false,
    }
  );

  useEffect(() => {
    if (status === "success") {
      resetForm();
    }
  }, [status]);

  const submit = (data: any) => {
    mutate({
      _id: editingBannerId,
      ...data,
      maxUsageForUser: +data.maxUsageForUser,
    });
  };

  useEffect(() => {
    if (getByIdStatus === "success") {
      reset({
        name: getByIdData.data.name,
        code: getByIdData.data.code,
        amount: getByIdData.data.amount,
        minOrderPrice: getByIdData.data.minOrderPrice,
        fromDate: getByIdData.data.fromDate,
        toDate: getByIdData.data.toDate,
        maxUsage: getByIdData.data.maxUsage,
        maxUsageForUser: getByIdData.data.maxUsageForUser,
      });
    }
  }, [getByIdStatus, getByIdData]);


  return (
    <div className="custom-drawer">
      <form id="promo-code" onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="name"
              label={t("promo_code.name")}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="code"
              label={t("promo_code.code")}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              name="maxUsage"
              control={control}
              label={t("promo_code.usage")}
              type="number"
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              name="amount"
              control={control}
              label={t("promo_code.value")}
              type="number"
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              name="minOrderPrice"
              control={control}
              label={t("promo_code.min_order_price")}
              type="number"
            />
          </Grid>
          <Grid item md={12}>
            <label className="text-[15px]" htmlFor="">{t("promo_code.max_usage_for_user")}</label>
            <Controller
              name="maxUsageForUser"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mt-1"
                  type="number"
                  fullWidth
                  variant="outlined"
                  defaultValue={1}
                />
              )}
            />
          </Grid>
          <Grid item md={12}>
            <DatePickerForm
              control={control}
              name="fromDate"
              disableTime={true}
              // rules={{ required: { value: false, message: "Majburiy" } }}
              label={t("promo_code.start_date")}
              minDate={new Date()}
              readOnly
              maxDate={
                watch("dateTo")
                  // @ts-ignore
                  ? new Date(watch("dateTo"))
                  : undefined
              }
            />
          </Grid>
          <Grid item md={12}>
            <DatePickerForm
              control={control}
              name="toDate"
              // rules={{ required: { value: false, message: "Majburiy" } }}
              disableTime={true}
              label={t("promo_code.end_date")}
              readOnly
            // minDate={discountEndMinDate}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default PromoCodeForm;
