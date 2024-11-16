import { FC, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { ImageInput, TextInput } from "components";
import { UseFormReturn } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";

interface IMeasureForm {
  formStore: UseFormReturn<any>;
  editingMeasureId: string;
  resetForm: () => void;
}

const MeasureForm: FC<IMeasureForm> = ({
  formStore,
  editingMeasureId,
  resetForm,
}) => {
  const { control, handleSubmit, reset } = formStore;
  const { t } = useTranslation()

  const { mutate, status } = useApiMutation(
    editingMeasureId ? `measure/${editingMeasureId}` : "measure",
    editingMeasureId ? "put" : "post"
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(`measure/${editingMeasureId}`, {}, {
    enabled: !!editingMeasureId,
    suspense: false,
  })

  useEffect(() => {
    if (status === "success") {
      resetForm();
    }
  }, [status]);

  const submit = (data: any) => {
    mutate({
      _id: editingMeasureId,
      ...data,
    });
  };

  useEffect(() => {
    if (getByIdStatus === 'success') {
      reset(getByIdData.data);
    }
  }, [getByIdStatus, getByIdData]);

  return (
    <div className="custom-drawer">
      <form id="rating" onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="name"
              label={t('common.name')}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="symbol"
              label={t('common.symbol')}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default MeasureForm;
