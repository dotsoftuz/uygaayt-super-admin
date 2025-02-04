import { FC, useEffect } from "react";
import { Grid } from "@mui/material";
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
    editingBannerId ? `/banner/update` : "/banner/create",
    editingBannerId ? "put" : "post"
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(
    `banner/get-by-id/${editingBannerId}`,
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
      imageId: data.imageId?._id,
      productId: data.productId,
    });
  };

  useEffect(() => {
    if (getByIdStatus === "success") {
      reset({
        title: getByIdData.data.title,
        imageId: getByIdData.data.image,
        productId: getByIdData.data.productId,
        description: getByIdData.data.description,
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
              name="usage"
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
            <DatePickerForm
              control={control}
              name="dateFrom"
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
              name="dateTo"
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
