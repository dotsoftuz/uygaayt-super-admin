import { FC, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { AutoCompleteForm, ImageInput, TextInput } from "components";
import { UseFormReturn } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";
import TextEditor from "components/form/TextEditor/TextEditor";
import { debounce } from "lodash";

interface IEmployeesForm {
  formStore: UseFormReturn<any>;
  editingNewsId: string;
  resetForm: () => void;
}
const BannerForm: FC<IEmployeesForm> = ({
  formStore,
  editingNewsId,
  resetForm,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, watch, setValue } = formStore;

  const { mutate, status } = useApiMutation(
    editingNewsId ? `/news/update` : "/news/create",
    editingNewsId ? "post" : "post"
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(
    `news/get-by-id/${editingNewsId}`,
    {},
    {
      enabled: !!editingNewsId,
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
      _id: editingNewsId,
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
      });
    }
  }, [getByIdStatus, getByIdData]);


  const submitDescriptionUz = debounce((value) => {
    setValue("description.uz", value);
  }, 2000);
  const submitDescriptionRu = debounce((value) => {
    setValue("description.ru", value);
  }, 2000);
  const submitDescriptionEn = debounce((value) => {
    setValue("description.en", value);
  }, 2000);


  return (
    <div className="custom-drawer">
      <form id="banner" onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="title.uz"
              label={t('common.title') + '(Uz)'}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="title.ru"
              label={t('common.title') + '(Ru)'}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="title.en"
              label={t('common.title') + '(En)'}
            />
          </Grid>
          <Grid item md={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t('common.description') + '(Uz)'}
              </Typography>
              <TextEditor
                value={watch("description.uz")}
                onChange={(value) => submitDescriptionUz(value)}
              />
            </Box>
          </Grid>
          <Grid item md={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t('common.description') + '(Ru)'}
              </Typography>
              <TextEditor
                value={watch("description.ru")}
                onChange={(value) => submitDescriptionRu(value)}
              />
            </Box>
          </Grid>
          <Grid item md={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t('common.description') + '(En)'}
              </Typography>
              <TextEditor
                value={watch("description.en")}
                onChange={(value) => submitDescriptionEn(value)}
              />
            </Box>

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
