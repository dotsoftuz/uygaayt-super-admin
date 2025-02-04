import { FC, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { AutoCompleteForm, ImageInput, TextInput } from "components";
import { Controller, UseFormReturn } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";
import TextEditor from "components/form/TextEditor/TextEditor";
import { debounce } from "lodash";

interface IEmployeesForm {
  formStore: UseFormReturn<any>;
  editingAttributeId: string;
  resetForm: () => void;
}
const AttributeForm: FC<IEmployeesForm> = ({
  formStore,
  editingAttributeId,
  resetForm,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, watch, setValue } = formStore;

  const { mutate, status } = useApiMutation(
    editingAttributeId ? `/attribute/update` : "/attribute/create",
    editingAttributeId ? "post" : "post"
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(
    `attribute/get-by-id/${editingAttributeId}`,
    {},
    {
      enabled: !!editingAttributeId,
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
      _id: editingAttributeId,
      ...data,
    });
  };

  useEffect(() => {
    if (getByIdStatus === "success") {
      reset({
        name: getByIdData.data.name,
      });
    }
  }, [getByIdStatus, getByIdData]);



  return (
    <div className="custom-drawer">
      <form id="attribute" onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="name.uz"
              label={t('common.title') + ' (Uz)'}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="name.ru"
              label={t('common.title') + ' (Ru)'}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="name.en"
              label={t('common.title') + ' (En)'}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AttributeForm;
