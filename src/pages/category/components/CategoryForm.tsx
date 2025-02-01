import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { AutoCompleteForm, ImageInput, TextInput } from "components";
import { UseFormReturn } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";

interface IBranchForm {
  formStore: UseFormReturn<any>;
  resetForm: () => void;
  editingCategoryId?: any;
  setRender?: React.Dispatch<React.SetStateAction<boolean>>;

}

const CategoryForm: React.FC<IBranchForm> = ({
  formStore,
  resetForm,
  editingCategoryId,
  setRender,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, setValue } = formStore;

  const { mutate, status } = useApiMutation<any>(
    editingCategoryId
      ? `category/update`
      : "category/create",
    editingCategoryId ? "put" : "post",
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(`category/get-by-id/${editingCategoryId}`, {}, {
    enabled: !!editingCategoryId,
    suspense: false
  })

  const sumbit = (data: any) => {
    mutate({
      ...data,
      imageId: data.imageId?._id,
      _id: editingCategoryId,
    });
  };

  useEffect(() => {
    if (status === "success") {
      resetForm();
      setRender?.(prev => !prev);
    }
  }, [status]);

  useEffect(() => {
    if (getByIdStatus === 'success'  && getByIdData?.data) {
      reset({
        name: getByIdData.data.name,
        imageId: getByIdData.data.image,
      });
    }
  }, [getByIdStatus, getByIdData]);

  return (
    <div className="custom-drawer">
      <form id="category" onSubmit={handleSubmit(sumbit)}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <TextInput name="name.uz" control={control} label={t("common.name") + ' (Uz)'} />
          </Grid>
          <Grid item md={12}>
            <TextInput name="name.ru" control={control} label={t("common.name") + ' (Ru)'} />
          </Grid>
          <Grid item md={12}>
            <TextInput name="name.en" control={control} label={t("common.name") + ' (En)'} />
          </Grid>
          <Grid item md={12}>
            <label className="py-2" htmlFor="">{t('general.recommendation_img')}</label><br /><br />
            <ImageInput
              control={control}
              setValue={setValue}
              name="imageId"
              accept=".png, .jpg, .jpeg"
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CategoryForm;
