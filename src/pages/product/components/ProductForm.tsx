import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Box, Grid, Switch } from "@mui/material";
import {
  AutoCompleteForm,
  DatePickerForm,
  ImageInput,
  Input,
  SelectForm,
  TextInput,
} from "components";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";
import { ProductFormStyled } from "./ProductForm.styled";
import TextEditor from "components/form/TextEditor/TextEditor";
import { IIdImage } from "hooks/usePostImage";
import { DeleteIcon, PlusIcon } from "assets/svgs";
import { DISCOUNT_TYPES } from "types/enums";
import { IProduct } from "types/common.types";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CommonButton from "components/common/commonButton/Button";
import { Delete } from "@mui/icons-material";
import AttributeForm from "./Fields";

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
  const { control, handleSubmit, reset, setValue, register, watch, formState: { errors } } = formStore;
  const currentLang = localStorage.getItem("i18nextLng") || "uz";
  const [hasAttributesEnabled, setHasAttributesEnabled] = useState(false);
  const [hasCompoundsEnabled, setHasCompoundsEnabled] = useState(false);


  const [subCategory, setSubCategory] = useState<any>(null);
  const [subChildCategory, setSubChildCategory] = useState<any>(null);

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

  const submit = (data: any) => {
    console.log(data);
    const cleanedAttributes = Object.entries(data.attributes || {})
      .filter(([key]) => data.attributeId?.includes(key))
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value
      }), {});
    const requestData: any = {
      // ...data,
      name: data.name,
      price: +data.price,
      inStock: +data.inStock,
      redLine: +data.redLine || null,
      yellowLine: +data.yellowLine || null,
      categoryId: subChildCategory ? data.categoryId : data.parentCategoryId,
      isActive: data.isActive,
      // categoryId: data.categoryId,
      // parentCategoryId: data.parentCategoryId,
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
      _id: editingProductId,
      discountEnabled: data.discountEnabled,
      description: data.description,
      compounds: data.compounds || [],
      attributes: hasAttributesEnabled ? Object.entries(cleanedAttributes).map(([key, item]: [string, any]) => ({
        attributeId: key,
        items: Array.isArray(item)
          ? item.map((itm: any) => ({
            attributeItem: itm?.attributeItem || null,
            amount: Number(itm?.amount) || 0,
          }))
          : []
      })) : []
    };

    // discountEnabled = true bo'lganda discount ma'lumotlarini qo'shish
    if (data.discountEnabled) {
      requestData.discountType = data.discountType;
      requestData.discountValue = data.discountValue;
      requestData.discountStartAt =
        typeof data.discountStartAt === "string"
          ? data.discountStartAt
          : typeof data.discountStartAt === "object"
            ? data.discountStartAt?.toISOString()
            : undefined;
      requestData.discountEndAt =
        typeof data.discountEndAt === "string"
          ? data.discountEndAt
          : typeof data.discountEndAt === "object"
            ? data.discountEndAt?.toISOString()
            : undefined;
    }

    // discountEnabled = false bo'lganda chegirma maydonlarini olib tashlash
    if (!data.discountEnabled) {
      delete requestData.discountType;
      delete requestData.discountValue;
      delete requestData.discountStartAt;
      delete requestData.discountEndAt;
    }

    delete requestData.isMyExpire;

    mutate(requestData); // API so'rovini yuborish
  };

  useEffect(() => {
    // Agar chegirma o'chirilgan bo'lsa, qiymatlarni tozalash
    if (!watch("discountEnabled")) {
      setValue("discountType", undefined);
      setValue("discountValue", undefined);
      setValue("discountStartAt", "");
      setValue("discountEndAt", undefined);
    }
  }, [watch("discountEnabled")]);


  useEffect(() => {
    const selectedAttributeIds = watch("attributeId") || [];
    const currentAttributes = watch("attributes") || {};

    // Remove attributes that are no longer selected
    const cleanedAttributes = Object.entries(currentAttributes)
      .filter(([key]) => selectedAttributeIds.includes(key))
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value
      }), {});

    setValue("attributes", cleanedAttributes);
  }, [watch("attributeId")]);

  useEffect(() => {
    if (status === "success") {
      resetForm();
    }
  }, [status]);

  useEffect(() => {
    if (getByIdData?.data) {
      setSubCategory(getByIdData.data.parentCategoryId || null);
      setSubChildCategory(getByIdData.data.categoryId || null);
      setHasAttributesEnabled(!!getByIdData.data.attributes?.length);
      setHasCompoundsEnabled(!!getByIdData.data.compounds?.length);
    }
  }, [getByIdData]);


  useEffect(() => {
    if (getByIdStatus === "success") {
      reset({
        ...getByIdData.data,
        attributes: getByIdData.data.attributes?.reduce((acc, attr) => {
          return {
            ...acc,
            [attr.attribute._id]: attr.items
          }
        }, {}) || [],
        // categoryId: subChildCategory === undefined ? getByIdData.data.parentCategoryId : getByIdData.data.categoryId,
        parentCategoryId: getByIdData.data.parentCategoryId || getByIdData.data.categoryId || "",
        categoryId: getByIdData.data.categoryId || "",
        isActiveQuery: formStore.watch("isActiveQuery"),
        description: getByIdData.data.description,
        compounds: getByIdData.data.compounds,
        attributeId: getByIdData.data.attributeDetails.map((item: any) => (
          item._id
        )) || [],
      });

      // if (!getByIdData.data.attributes?.length) {
      //   setValue("attributes", {});
      //   setValue("attributeId", []);
      // }

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

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    name: "compounds",
    control,
  });

  const selectedAttributes = watch("attributeId") || [];


  const { mutate: attributesChoose, data: attributesData, status: attributesStatus } = useApiMutation<any>(
    "attribute/choose",
    "post"
  );

  useEffect(() => {
    attributesChoose({})
  }, [])


  const filteredAttributes = attributesData?.data?.data?.filter((item: any) =>
    selectedAttributes?.some((selected: any) => selected === item._id)
  );

  const isActive = watch("isActive");
  const hasCompounds = watch("compounds");


  const handleSwitchChange = useCallback((name: string, value: boolean) => {
    if (name === "compounds") {
      setHasCompoundsEnabled(value);
      if (!value) {
        setValue("compounds", []);
      } else {
        setValue("compounds", []);
      }
    } else if (name === "attributes") {
      setHasAttributesEnabled(value);
      if (!value) {
        setValue("attributes", {});
        setValue("attributeId", []);
      }
    }

    setValue(name, value);
  }, [setValue]);


  return (
    <ProductFormStyled className="custom-drawer">
      <form id="product" onSubmit={handleSubmit(submit)}>
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
              />
            </Box>
            <Box>
              <TextInput
                name="yellowLine"
                control={control}
                label={t("Sariq chiziq")}
                type="number"
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
              // name="parentCategoryId"
              name={subChildCategory !== undefined ? "parentCategoryId" : "categoryId"}
              optionsUrl="category/paging"
              dataProp="data.data"
              label="Kategoriya"
              onChange={(item: any) => {
                setSubCategory(item || null);
                setValue("categoryId", "");
              }}
            />
            {(subCategory || getByIdData?.data?.parentCategoryId) ? (
              <AutoCompleteForm
                control={control}
                name="categoryId"
                optionsUrl="category/paging"
                dataProp="data.data"
                label="Ichki Kategriya"
                rules={{ required: false }}
                onChange={(item: any) => setSubChildCategory?.(item || null)}
                exQueryParams={{
                  parentId: subCategory?._id || getByIdData?.data?.parentCategoryId || "",
                }}
              />
            ) : null}


          </Grid>
          <Grid item md={12}>
            <label className="custom-label">{t("common.description")}</label>
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
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <label htmlFor="isActive">{t("common.isActive")}</label>
              <Switch
                checked={!!isActive}
                onChange={(e) => handleSwitchChange("isActive", e.target.checked)}
                id="isActive"
              />
            </Box>
          </Grid>
          <Grid item md={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <label htmlFor="isMyExpire">Muddatli mahsulot</label>
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

          {/* Chegirma */}
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
                    rules={{ required: { value: false, message: "Majburiy" } }}
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
                    rules={{ required: { value: false, message: "Majburiy" } }}
                  />
                </Grid>
                <Grid item md={6}>
                  <DatePickerForm
                    control={control}
                    name="discountStartAt"
                    disableTime={true}
                    rules={{ required: { value: false, message: "Majburiy" } }}
                    label={t("common.discountStartAt")}
                    minDate={new Date()}
                    readOnly
                    maxDate={
                      watch("discountEndAt")
                        // @ts-ignore
                        ? new Date(watch("discountEndAt"))
                        : undefined
                    }
                  />
                </Grid>
                <Grid item md={6}>
                  <DatePickerForm
                    control={control}
                    name="discountEndAt"
                    rules={{ required: { value: false, message: "Majburiy" } }}
                    disableTime={true}
                    label={t("common.discountEndAt")}
                    readOnly
                    minDate={discountEndMinDate}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>

          {/* Tarkibli tovar */}
          <Grid item md={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <label htmlFor="compounds">{t('general.compounds')}</label>
              <Switch
                checked={hasCompoundsEnabled}
                onChange={(e) => handleSwitchChange("compounds", e.target.checked)}
                id="compounds"
              />
            </Box>
            {hasCompoundsEnabled && (
              fields.map((field: any, index: any) => (
                <Grid container key={field.id} className="flex items-end justify-between mt-2">
                  <Grid item md={5}>
                    <TextInput
                      control={control}
                      name={`compounds.${index}.name`}
                      type="text"
                      rules={{ required: false }}
                      label={t('general.composition')}
                    />
                  </Grid>
                  <Grid item md={5}>
                    <Input
                      label={t('general.quantity')}
                      params={{
                        ...register(
                          `compounds.${index}.value`,
                        ),
                      }}
                    // error={errors?.compounds?.[index]?.value}
                    />
                  </Grid>
                  <Grid item md={1}>
                    <Delete
                      sx={{
                        cursor: "pointer",
                        color: "#D54239",
                        fontSize: "1.5rem",
                      }}
                      className="mb-2.5"
                      onClick={() => {
                        remove(index);
                      }}
                    />
                  </Grid>
                </Grid>
              ))
            )}
          </Grid>
          {hasCompoundsEnabled && (
            <Grid item xs={3} md={2} paddingBlock={2} className="flex flex-col ">
              <CommonButton
                startIcon={<PlusIcon />}
                type="button"
                // title={`${t("general.add")}`}
                onClick={() => {
                  const newValue = {
                    name: null,
                    value: null,
                  };
                  append(newValue);
                }}
              />
            </Grid>
          )}

          {/* Qoshimcha xusiyat tovar */}
          <Grid item md={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <label htmlFor="attributes">{t('general.attributes')}</label>
              <Switch
                checked={hasAttributesEnabled}
                onChange={(e) => handleSwitchChange("attributes", e.target.checked)}
                id="attributes"
              />
            </Box>
          </Grid>
          {
            hasAttributesEnabled &&
            <Grid item md={12}>
              <AutoCompleteForm
                control={control}
                name="attributeId"
                optionsUrl="attribute/choose"
                dataProp="data.data"
                rules={{ required: false }}
                multiple
              />
            </Grid>
          }


          {hasAttributesEnabled &&
            selectedAttributes?.map((attributeId: any) => (
              <Grid key={attributeId} item md={12}>
                <p className="text-[#EB5B00] font-bold text-xl">
                  {
                    filteredAttributes
                      ?.filter((item: any) => item?._id === attributeId)
                      ?.map((item: any) => (
                        <div key={item?._id}>
                          {item.name?.[currentLang]}:
                        </div>
                      ))
                  }
                </p>
                <AttributeForm
                  attributeId={attributeId}
                  getByIdData={getByIdData}
                  control={control}
                  register={register}
                />
              </Grid>
            ))
          }

          {/* Images */}
          <Grid item md={12}>
            <label className="py-2" htmlFor="">{t('general.recommendation_img')}</label><br /><br />
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
