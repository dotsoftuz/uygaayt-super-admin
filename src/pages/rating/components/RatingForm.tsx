import { FC, useEffect } from "react";
import { Grid } from "@mui/material";
import { ImageInput, TextInput } from "components";
import { UseFormReturn } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";

interface IRatingForm {
  formStore: UseFormReturn<any>;
  editingRatingId: string;
  resetForm: () => void;
  rate: number;
}

const RatingForm: FC<IRatingForm> = ({
  formStore,
  editingRatingId,
  resetForm,
  rate
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, watch, setValue } = formStore;

  const { mutate, status } = useApiMutation(
    editingRatingId ? `rate-comment/update` : "rate-comment/create",
    editingRatingId ? "put" : "post"
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(`rate-comment/get-by-id/${editingRatingId}`, {}, {
    enabled: !!editingRatingId,
    suspense: false,
  })

  useEffect(() => {
    if (status === "success") {
      resetForm();
    }
  }, [status]);

  const submit = (data: any) => {
    mutate({
      _id: editingRatingId,
      ...data,
      imageId: data.imageId?._id,
      rate
    });
  };

  useEffect(() => {
    if (getByIdStatus === 'success') {
      reset({
        title: getByIdData.data.title,
        imageId: getByIdData.data.image,
      });
    }
  }, [getByIdStatus, getByIdData]);

  return (
    <div className="custom-drawer">
      <form id="rating" onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="title.uz"
              label='Uz'
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="title.ru"
              label='Ru'
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="title.en"
              label='En'
            />
          </Grid>
          <Grid item md={12}>
            <label className="py-2" htmlFor="">{t('general.recommendation_img')}</label><br /><br />
            <ImageInput control={control} setValue={setValue} name="imageId" />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default RatingForm;
