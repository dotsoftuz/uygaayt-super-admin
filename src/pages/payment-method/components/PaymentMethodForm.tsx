import { FC, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { ImageInput, TextInput } from "components";
import { Controller, UseFormReturn } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";

interface IEmployeesForm {
  formStore: UseFormReturn<any>;
  editingPaymentMethodId: string | undefined;
  resetForm: () => void;
}

const PaymentMethodForm: FC<IEmployeesForm> = ({
  formStore,
  editingPaymentMethodId,
  resetForm,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, watch, setValue } = formStore;

  const { mutate, status } = useApiMutation(
    editingPaymentMethodId ? `/payment-method/update` : "/payment-method/create",
    editingPaymentMethodId ? "put" : "post"
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(
    `payment-method/get-by-id/${editingPaymentMethodId}`,
    {},
    {
      enabled: !!editingPaymentMethodId,
      suspense: false,
    }
  );

  useEffect(() => {
    if (status === "success") {
      resetForm(); // Reset form after successful submission
    }
  }, [status]);

  const submit = (data: any) => {
    mutate({
      _id: editingPaymentMethodId,
      ...data,
      link: data.link.url
    });
  };

  useEffect(() => {
    if (getByIdStatus === "success") {
      reset({
        name: getByIdData.data.name,
        link: getByIdData.data.link
      });
    }
  }, [getByIdStatus, getByIdData]);

  useEffect(() => {
    // Reset the form if editingAttributeId changes to undefined (for create mode)
    if (!editingPaymentMethodId) {
      reset({
        name: "",
        link: "",
      });
    }
  }, [editingPaymentMethodId, reset]);

  return (
    <div className="custom-drawer">
      <form id="payment-method" onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="name"
              label={t('common.title')}
            />
          </Grid>
          <Grid item md={12}>
            <label className="py-2" htmlFor="">QR code</label><br /><br />
            <ImageInput rules={{ required: false }} control={control} setValue={setValue} name="link" /><br />
            <label className="py-2" htmlFor="">{t('general.recommendation_img')}</label>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default PaymentMethodForm;
