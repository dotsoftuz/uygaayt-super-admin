import { Dispatch, SetStateAction, useEffect } from "react";
import { Box, Grid, Switch } from "@mui/material";
import {
  AutoCompleteForm,
  DatePickerForm,
  ImageInput,
  SelectForm,
  TextInput,
} from "components";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";
import { ProductFormStyled } from "./ProductForm.styled";
import TextEditor from "components/form/TextEditor/TextEditor";
import { IIdImage } from "hooks/usePostImage";
import { DeleteIcon } from "assets/svgs";
import { DISCOUNT_TYPES } from "types/enums";
import { IProduct } from "types/common.types";
import dayjs from "dayjs";

interface IProductForm {
  formStore: any;
  resetForm: () => void;
  editingProductId: any;
  productProps: {
    productImages: IIdImage[];
    setProductImages: Dispatch<SetStateAction<IIdImage[]>>;
    mainImageId: any;
    setMainImageId: any;
  };
}

const ProductForm = ({
  formStore,
  resetForm,
  editingProductId,
  productProps,
}: IProductForm) => {
  const { productImages, setProductImages, mainImageId, setMainImageId } =
    productProps;
  const { t } = useTranslation();
  const { control, handleSubmit, reset, setValue, register, watch } = formStore;
  const discountEndMinDate = new Date(watch("discountStartAt"));
  discountEndMinDate.setDate(discountEndMinDate.getDate() + 1);

  const { mutate, status } = useApiMutation<any>(
    editingProductId ? `/product/update` : "product/create",
    editingProductId ? "put" : "post"
  );

  const { data: getByIdData, status: getByIdStatus } = useApi<IProduct>(
    `product/get-by-id/${editingProductId}`,
    {},
    {
      enabled: !!editingProductId,
      suspense: false,
    }
  );

  const sumbit = (data: any) => {
    const requestData = {
      ...data,
      imageIds: productImages.map((image) => image._id),
      mainImageId: productImages.length
        ? mainImageId || productImages?.[0]?._id
        : null,
      expiryDate: !data.isMyExpire
        ? null
        : typeof data.expiryDate === "string"
          ? data.expiryDate
          : typeof data.expiryDate === "object"
            ? data.expiryDate?.toISOString()
            : null,
      discountStartAt:
        typeof data.discountStartAt === "string"
          ? data.discountStartAt
          : typeof data.discountStartAt === "object"
            ? data.discountStartAt?.toISOString()
            : undefined,
      discountEndAt:
        typeof data.discountEndAt === "string"
          ? data.discountEndAt
          : typeof data.discountEndAt === "object"
            ? data.discountEndAt?.toISOString()
            : undefined,
      _id: editingProductId,
    };

    delete requestData.isMyExpire;

    mutate(requestData);
  };

  useEffect(() => {
    if (status === "success") {
      resetForm();
    }
  }, [status]);

  useEffect(() => {
    if (getByIdStatus === "success") {
      reset({
        ...getByIdData.data,
        categoryId: getByIdData.data.category?._id,
        isActiveQuery: formStore.watch("isActiveQuery"),
      });
      setValue("isMyExpire", !!watch("expiryDate"));

      setProductImages(getByIdData.data?.images || []);

      const foundMain = getByIdData.data?.images?.find(
        (img) => img?._id === getByIdData.data.mainImage?._id
      );
      if (foundMain && !!getByIdData.data?.images?.length) {
        setMainImageId(getByIdData.data.mainImage?._id);
      } else setMainImageId(getByIdData.data?.images?.[0]?._id);
    }
  }, [getByIdStatus, getByIdData]);

  useEffect(() => {
    const foundMain = productImages.find((main) => main._id === mainImageId);
    if (foundMain) {
      setMainImageId(foundMain._id);
    } else if (productImages.length) {
      setMainImageId(productImages[0]._id);
    }
  }, [productImages]);

  return (
    <ProductFormStyled className="custom-drawer">
      <form id="product" onSubmit={handleSubmit(sumbit)}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <TextInput
              name="name"
              control={control}
              label={t("common.productName")}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              name="price"
              control={control}
              label={t("common.price")}
              type="number"
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              name="inStock"
              control={control}
              label={t("common.residue")}
              type="number"
            />
          </Grid>
          <Grid item md={12} display={"flex"} justifyContent={"space-between"}>
            <Box>
              <TextInput
                name="redLine"
                control={control}
                type="number"
                label={t("Qizil chiziq")}
                rules={{ required: false }}
              />
            </Box>
            <Box>
              <TextInput
                name="yellowLine"
                control={control}
                label={t("Sariq chiziq")}
                type="number"
                rules={{ required: false }}
              />
            </Box>
          </Grid>
          {/* <Grid item md={12}>
            <AutoCompleteForm
              control={control}
              name="measureId"
              optionsUrl="measure"
              dataProp="data.data"
              label={t("common.measure")}
            />
          </Grid> */}
          <Grid item md={12}>
            <AutoCompleteForm
              control={control}
              name="categoryId"
              optionsUrl="category/paging"
              dataProp="data.data"
              label={t("common.category")}
            />
          </Grid>
          <Grid item md={12}>
            <label className="custom-label">{t("common.description")}</label>
            <TextEditor
              value={watch("description")}
              onChange={(value) => {
                setValue("description", value);
              }}
            />
          </Grid>
          <Grid item md={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <label htmlFor="isActive">{t("common.isActive")}</label>
              <Switch
                checked={!!watch("isActive")}
                id="isActive"
                {...register("isActive")}
              />
            </Box>
          </Grid>
          <Grid item md={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <label htmlFor="isActive">Muddatli mahsulot</label>
              <Switch
                checked={!!watch("isMyExpire")}
                id="isMyExpire"
                {...register("isMyExpire")}
              />
            </Box>
            {watch("isMyExpire") && (
              <Grid container>
                <Grid item md={12}>
                  <DatePickerForm
                    control={control}
                    name="expiryDate"
                    rules={{ required: { value: true, message: "Majburiy" } }}
                    disableTime={true}
                    label={t("common.validatyPariod")}
                    readOnly
                    minDate={new Date()}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item md={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <label htmlFor="discountEnabled">{t("common.discount")}</label>
              <Switch
                checked={!!watch("discountEnabled")}
                id="discountEnabled"
                {...register("discountEnabled")}
              />
            </Box>
            {watch("discountEnabled") && (
              <Grid container spacing={2} alignItems="end">
                <Grid item md={6}>
                  <TextInput
                    control={control}
                    name="discountValue"
                    label={t("common.discountValue")}
                    type="number"
                    inputProps={
                      watch("discountType") === "percent"
                        ? {
                          max: 100,
                        }
                        : {
                          max: Number(watch("price")),
                        }
                    }
                  />
                </Grid>
                <Grid item md={6}>
                  <SelectForm
                    control={control}
                    name="discountType"
                    options={DISCOUNT_TYPES}
                    label={t("common.type")}
                  />
                </Grid>
                <Grid item md={6}>
                  <DatePickerForm
                    control={control}
                    name="discountStartAt"
                    disableTime={true}
                    rules={{ required: { value: true, message: "Majburiy" } }}
                    label={t("common.discountStartAt")}
                    minDate={new Date()}
                    readOnly
                    maxDate={
                      watch("discountEndAt")
                        ? new Date(watch("discountEndAt"))
                        : undefined
                    }
                  />
                </Grid>
                <Grid item md={6}>
                  <DatePickerForm
                    control={control}
                    name="discountEndAt"
                    rules={{ required: { value: true, message: "Majburiy" } }}
                    disableTime={true}
                    label={t("common.discountEndAt")}
                    readOnly
                    minDate={discountEndMinDate}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item md={12}>
            <div className="product-images">
              <ImageInput
                control={control}
                setValue={setValue}
                name="image"
                rules={{ required: false }}
                multiple
                getImage={(img) => setProductImages((prev) => [...prev, img])}
                accept=".png, .jpg, .jpeg"
              />
              {productImages?.map((image) => (
                <div className="product-image" key={image._id}>
                  <img
                    src={process.env.REACT_APP_BASE_URL + image.url}
                    alt="product"
                  />
                  <div className="on-hover">
                    <span
                      className="delete"
                      onClick={() =>
                        setProductImages((prev) =>
                          prev.filter((prevImg) => prevImg._id !== image._id)
                        )
                      }
                    >
                      <DeleteIcon />
                    </span>
                    <span
                      className={`main-image ${image._id === mainImageId && "active"
                        }`}
                      onClick={() => setMainImageId(image?._id)}
                    ></span>
                  </div>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </form>
    </ProductFormStyled>
  );
};

export default ProductForm;
