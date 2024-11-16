import { FC, useEffect } from "react";
import { Grid } from "@mui/material";
import { AutoCompleteForm, ImageInput, TextInput } from "components";
import { UseFormReturn } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";
import TextEditor from "components/form/TextEditor/TextEditor";

interface IEmployeesForm {
  formStore: UseFormReturn<any>;
  editingBannerId: string;
  resetForm: () => void;
}
const BannerForm: FC<IEmployeesForm> = ({
  formStore,
  editingBannerId,
  resetForm,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, watch, setValue } = formStore;

  const { mutate, status } = useApiMutation(
    editingBannerId ? `banner/${editingBannerId}` : "banner",
    editingBannerId ? "put" : "post"
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(
    `banner/${editingBannerId}`,
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
    });
  };

  useEffect(() => {
    if (getByIdStatus === "success") {
      reset({
        title: getByIdData.data.title,
        imageId: getByIdData.data.image,
        description: getByIdData.data.description,
        storeId: getByIdData.data.storeId,
      });
    }
  }, [getByIdStatus, getByIdData]);

  return (
    <div className="custom-drawer">
      <form id="banner" onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="title"
              label={t("common.name")}
            />
          </Grid>
          <Grid item md={12}>
            <AutoCompleteForm
              control={control}
              name="storeId"
              optionsUrl="/store/pagin"
              dataProp="data.data"
              label={t("common.store")}
              exQueryParams={{
                page: 1,
                limit: 10,
              }}
            />
          </Grid>
          <Grid item md={12}>
            <TextEditor
              value={watch("description")}
              onChange={(value) => {
                setValue("description", value);
              }}
            />
          </Grid>
          <Grid item md={12}>
            <ImageInput control={control} setValue={setValue} name="imageId" />
            <div className="d-flex justify-content-between mt-3">
              <span>O'lcham</span>
              <span>1080(px) - 250(px)</span>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default BannerForm;
