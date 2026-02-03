import { Grid } from "@mui/material";
import { AutoCompleteForm, ImageInput, TextInput } from "components";
import TextEditor from "components/form/TextEditor/TextEditor";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { FC, useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
  const { control, handleSubmit, reset, setValue } = formStore;

  const { mutate, status } = useApiMutation(
    editingBannerId ? `/banner/update` : "/banner/create",
    editingBannerId ? "put" : "post",
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(
    `banner/get-by-id/${editingBannerId}`,
    {},
    {
      enabled: !!editingBannerId,
      suspense: false,
    },
  );

  useEffect(() => {
    if (status === "success") {
      resetForm();
    }
  }, [status, resetForm]);

  const submit = (data: any) => {
    mutate({
      _id: editingBannerId,
      ...data,
      imageId: data.imageId?._id,
      productId: data.productId?._id || data.productId, // Backward compatibility
      productIds:
        data.productIds?.map((p: any) => p._id || p) || data.productIds, // Array uchun
    });
  };

  useEffect(() => {
    if (getByIdStatus === "success") {
      reset({
        title: getByIdData.data.title,
        imageId: getByIdData.data.image,
        productId: getByIdData.data.productId, // Backward compatibility
        productIds: getByIdData.data.productIds, // Yangi - array
        description: getByIdData.data.description,
      });
    }
  }, [getByIdStatus, getByIdData, reset]);

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
              name="productId"
              optionsUrl="product/choose"
              dataProp="data.data"
              label={t("common.product")}
              rules={{ required: false }}
            />
          </Grid>
          <Grid item md={12}>
            <AutoCompleteForm
              control={control}
              name="productIds"
              optionsUrl="product/choose"
              dataProp="data.data"
              label={t("common.products")} // Ko'p mahsulotlar
              rules={{ required: false }}
              multiple={true} // Multi-select uchun
            />
          </Grid>
          <Grid item md={12}>
            <label className="py-2" htmlFor="description">
              {t("common.description")}
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextEditor
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            />
          </Grid>
          <Grid item md={12}>
            <label className="py-2" htmlFor="">
              {t("general.recommendation_img")}
            </label>
            <br />
            <br />
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
