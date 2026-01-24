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
import { IIdImage } from "hooks/usePostFile";
import { DeleteIcon, PlusIcon } from "assets/svgs";
import { DISCOUNT_TYPES } from "types/enums";
import { IProduct } from "types/common.types";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CommonButton from "components/common/commonButton/Button";
import { Delete } from "@mui/icons-material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttributeForm from "./Fields";
import ImageInputPro from "components/form/ImageInputPro/ImageInputPro";
import ProductLocationSelector, { SelectedLocation } from "components/form/ProductLocationSelector";

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

  const [selectedParentCategory, setSelectedParentCategory] = useState<any>(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState<any>(null);
  const [storeSections, setStoreSections] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [mapImageUrl, setMapImageUrl] = useState<string>('');
  const [imageSize, setImageSize] = useState({ width: 837, height: 634 });

  const discountEndMinDate = new Date(watch("discountStartAt"));
  discountEndMinDate.setDate(discountEndMinDate.getDate() + 1);

  const { mutate, status } = useApiMutation<any>(
    editingProductId ? `/product/update` : "product/create",
    editingProductId ? "put" : "post",
    {},
    true
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
      })) : [],
      locationBlock: data.locationBlock || undefined,
      locationShelf: data.locationShelf || undefined,
      locationRow: data.locationRow || undefined,
      location: data.location || undefined,
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
      setSelectedLocation(null);
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

  // 2. Parent category change handler
  const handleParentCategoryChange = (item: any) => {
    setSelectedParentCategory(item);
    setSelectedChildCategory(null); // Reset child category
    setValue("categoryId", ""); // Clear form value
    setValue("parentCategoryId", item?._id || ""); // Update form value
  };

  // 3. Child category change handler
  const handleChildCategoryChange = (item: any) => {
    setSelectedChildCategory(item);
    setValue("categoryId", item?._id || ""); // Update form value
  };


  useEffect(() => {
    if (getByIdStatus === "success") {
      const productData = getByIdData.data;

      // Set initial category states
      if (productData.parentCategoryId) {
        setSelectedParentCategory({ _id: productData.parentCategoryId });
      }
      if (productData.categoryId) {
        setSelectedChildCategory({ _id: productData.categoryId });
      }
      reset({
        ...getByIdData.data,
        attributes: getByIdData.data.attributes?.reduce((acc, attr) => {
          return {
            ...acc,
            [attr.attribute._id]: attr.items
          }
        }, {}) || [],
        // categoryId: subChildCategory === undefined ? getByIdData.data.parentCategoryId : getByIdData.data.categoryId,
        parentCategoryId: productData.parentCategoryId || productData.categoryId || "",
        categoryId: productData.categoryId || "",
        isActiveQuery: formStore.watch("isActiveQuery"),
        description: getByIdData.data.description,
        compounds: getByIdData.data.compounds,
        attributeId: getByIdData.data.attributeDetails.map((item: any) => (
          item._id
        )) || [],
        locationBlock: getByIdData.data.locationBlock || undefined,
        locationShelf: getByIdData.data.locationShelf || undefined,
        locationRow: getByIdData.data.locationRow || undefined,
        location: getByIdData.data.location || undefined,
      });

      // if (!getByIdData.data.attributes?.length) {
      //   setValue("attributes", {});
      //   setValue("attributeId", []);
      // }

      setValue("isMyExpire", !!watch("expiryDate"));

      if (getByIdData.data.location) {
        setSelectedLocation({
          section_id: getByIdData.data.location.id,
          section_name: getByIdData.data.location.name,
          rect: getByIdData.data.location.rect,
        });
      } else {
        setSelectedLocation(null);
      }

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

  useEffect(() => {
    const loadStoreMapData = async () => {
      try {
        const response = await fetch('/store-map-sections.json');
        const data = await response.json();
        setStoreSections(data.sections || []);
        if (data.imageSize) {
          setImageSize(data.imageSize);
        }
        if (data.mapImageUrl) {
          setMapImageUrl(data.mapImageUrl);
        }
      } catch (error) {
        console.error('Error loading store map data:', error);
      }
    };
    loadStoreMapData();
  }, []);

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
              control={control}
              name="name.uz"
              label={t('common.productName') + ' (Uz)'}
              placeholder="Masalan: Olma"
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="name.ru"
              label={t('common.productName') + ' (Ru)'}
              placeholder="Например: Яблоко"
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="name.en"
              label={t('common.productName') + ' (En)'}
              placeholder="For example: Apple"
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              name="price"
              control={control}
              label={t("common.price")}
              type="number"
              placeholder="Masalan: 5000"
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              name="inStock"
              control={control}
              label={t("common.residue")}
              type="number"
              placeholder="Masalan: 100"
            />
          </Grid>
          <Grid item md={12} display={"flex"} justifyContent={"space-between"}>
            <Box>
              <TextInput
                name="redLine"
                control={control}
                type="number"
                label={t("Qizil chiziq")}
                placeholder="Masalan: 10"
                rules={{
                  required: false,
                }}
              />
            </Box>
            <Box>
              <TextInput
                name="yellowLine"
                control={control}
                label={t("Sariq chiziq")}
                type="number"
                placeholder="Masalan: 20"
                rules={{
                  required: false,
                }}
              />
            </Box>
          </Grid>
          {/* Product Location Fields */}
          <Grid item md={12}>
            <Box className="product-location-selector">
              <label className="custom-label">
                Mahsulot joylashuvi (Xarita)
                <span className="text-muted-foreground text-sm">(ixtiyoriy)</span>
              </label>
              {storeSections.length > 0 && (
                <ProductLocationSelector
                  sections={storeSections}
                  mapImageUrl={mapImageUrl || undefined}
                  imageSize={imageSize}
                  onLocationSelect={(location) => {
                    setSelectedLocation(location);
                    if (location) {
                      setValue('location', {
                        id: location.section_id,
                        name: location.section_name,
                        rect: location.rect,
                      });
                    } else {
                      setValue('location', undefined);
                    }
                  }}
                  selectedLocation={selectedLocation}
                />
              )}
            </Box>
          </Grid>
          <Grid item md={4}>
            <TextInput
              name="locationBlock"
              control={control}
              label="Blok"
              placeholder="Masalan: A blok"
              rules={{ required: false }}
            />
          </Grid>
          <Grid item md={4}>
            <TextInput
              name="locationShelf"
              control={control}
              label="Javon"
              placeholder="Masalan: 2 javon"
              rules={{ required: false }}
            />
          </Grid>
          <Grid item md={4}>
            <TextInput
              name="locationRow"
              control={control}
              label="Qator"
              placeholder="Masalan: 3 qator"
              rules={{ required: false }}
            />
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
              onChange={handleParentCategoryChange}
            />
            {selectedParentCategory && (
              <AutoCompleteForm
                control={control}
                name="categoryId"
                optionsUrl="category/paging"
                dataProp="data.data"
                label="Ichki kategoriya"
                rules={{ required: false }}
                onChange={handleChildCategoryChange}
                exQueryParams={{
                  parentId: selectedParentCategory?._id,
                }}
                key={`child-cat-${selectedParentCategory?._id}`} // Force re-render when parent changes
              />
            )}


          </Grid>
          <Grid item md={12}>
            <label className="custom-label">{t("common.description")} <span className="text-muted-foreground text-sm">(ixtiyoriy)</span></label>
            <Controller
              name="description"
              control={control}
              rules={{ required: false }}
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
              <label htmlFor="isActive">{t("common.isActive")} <span className="text-muted-foreground text-sm">(ixtiyoriy)</span></label>
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
              <label htmlFor="isMyExpire">Muddatli mahsulot <span className="text-muted-foreground text-sm">(ixtiyoriy)</span></label>
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
              <label htmlFor="discountEnabled">{t("common.discount")} <span className="text-muted-foreground text-sm">(ixtiyoriy)</span></label>
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
                    placeholder={watch("discountType") === "percent" ? "Masalan: 10" : "Masalan: 1000"}
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
              <label htmlFor="compounds">{t('general.compounds')} <span className="text-muted-foreground text-sm">(ixtiyoriy)</span></label>
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
                      placeholder="Masalan: Suv"
                    />
                  </Grid>
                  <Grid item md={5}>
                    <Input
                      label={t('general.quantity')}
                      placeholder="Masalan: 100ml"
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
              <label htmlFor="attributes">{t('general.attributes')} <span className="text-muted-foreground text-sm">(ixtiyoriy)</span></label>
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
              <ImageInputPro
                control={control}
                setValue={setValue}
                name="image"
                rules={{ required: false }}
                multiple
                getImage={(img) => {
                  setProductImages((prev) => [...prev, img]);
                  setValue("image", null);
                }}
                accept=".png, .jpg, .jpeg"
              />
              {productImages?.map((image) => (
                <div className="product-image" key={image._id}>
                  <img
                    src={process.env.REACT_APP_BASE_URL + image.url}
                    alt="product"
                  />
                  <div className="on-hover flex gap-2">
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
                      className="preview"
                      onClick={() => {
                        const modal = document.createElement('div');
                        modal.style.position = 'fixed';
                        modal.style.top = '0';
                        modal.style.left = '0';
                        modal.style.width = '100%';
                        modal.style.height = '100%';
                        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        modal.style.display = 'flex';
                        modal.style.justifyContent = 'center';
                        modal.style.alignItems = 'center';
                        modal.style.zIndex = '2000';

                        const img = document.createElement('img');
                        img.src = process.env.REACT_APP_BASE_URL + image.url;
                        img.alt = 'preview';
                        img.style.maxWidth = '90%';
                        img.style.maxHeight = '90%';
                        img.style.border = '2px solid white';
                        img.style.borderRadius = '8px';

                        const closeButton = document.createElement('span');
                        closeButton.innerText = '×';
                        closeButton.style.position = 'absolute';
                        closeButton.style.top = '20px';
                        closeButton.style.right = '20px';
                        closeButton.style.fontSize = '2rem';
                        closeButton.style.color = 'white';
                        closeButton.style.cursor = 'pointer';

                        closeButton.onclick = () => {
                          document.body.removeChild(modal);
                        };

                        modal.appendChild(img);
                        modal.appendChild(closeButton);
                        document.body.appendChild(modal);
                      }}
                    >
                      <VisibilityIcon className="text-white text-lg" />
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
