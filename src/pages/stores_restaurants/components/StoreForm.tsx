import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Grid, InputLabel, Button } from "@mui/material";
import {
  AutoCompleteForm,
  ImageInput,
  PhoneInput,
  TextInput,
  SelectForm,
} from "components";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";
import TextEditor from "components/form/TextEditor/TextEditor";
import TimePicker from "components/form/TimePicker/TimePicker";
import YandexMap from "components/common/YandexMap/YandexMap";
import { ILocation } from "types/common.types";
import useDebounce from "hooks/useDebounce";
import { Checkbox } from "components";
import { IIdImage } from "hooks/usePostImage";
import { toast } from "react-toastify";
import { Add, Delete } from "@mui/icons-material";

interface IStoreForm {
  formStore: UseFormReturn<any>;
  editingStoreId?: any;
  resetForm: () => void;
  storeProps: {
    logoImage: IIdImage | null;
    setLogoImage: Dispatch<SetStateAction<IIdImage | null>>;
    bannerImage: IIdImage | null;
    setBannerImage: Dispatch<SetStateAction<IIdImage | null>>;
  };
}

const StoreForm: FC<IStoreForm> = ({
  formStore,
  editingStoreId,
  resetForm,
  storeProps,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, watch, setValue, formState } =
    formStore;
  const { logoImage, setLogoImage, bannerImage, setBannerImage } = storeProps;

  const [showOptions, setShowOptions] = useState(false);
  const [addressLocation, setAddressLocation] = useState<ILocation>();
  const [address, setAddress] = useState("");
  const [imageIds, setImageIds] = useState<IIdImage[]>([]);
  const { debouncedValue } = useDebounce(address, 1000);

  const {
    fields: workDaysFields,
    append: appendWorkDay,
    remove: removeWorkDay,
  } = useFieldArray({
    control,
    name: "workDays",
  });

  const { mutate, status } = useApiMutation(
    editingStoreId ? "store/update" : "store/create",
    editingStoreId ? "put" : "post",
    {
      // onSuccess callback'ni olib tashlang - useApiMutation'da allaqachon drawer yopiladi va table refresh qilinadi
    }
  );

  const { mutate: addressByName, data: addressData } = useApiMutation(
    `address/by-name`,
    "post",
    {
      onSuccess() {
        setShowOptions(true);
      },
    }
  );

  const { mutate: addressByPointName } = useApiMutation(
    `address/by-point`,
    "post",
    {
      onSuccess({ data }) {
        setValue("addressName", data?.name);
      },
    }
  );

  useEffect(() => {
    if (typeof address === "string" && address.trim()) {
      addressByName({ name: address });
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (addressLocation?.latitude && addressLocation?.longitude) {
      addressByPointName({
        latitude: addressLocation.latitude,
        longitude: addressLocation.longitude,
      });
    }
  }, [addressLocation]);

  const { data: getByIdData, status: getByIdStatus } = useApi(
    `store/get-by-id/${editingStoreId}`,
    {},
    {
      enabled: !!editingStoreId && !editingStoreId?.startsWith("store_"),
      suspense: false,
    }
  );

  // API'dan ma'lumotlarni o'qish
  useEffect(() => {
    if (getByIdStatus === "success" && getByIdData?.data) {
      const store = getByIdData.data;
      reset({
        name: store.name || "",
        phoneNumber: store.phoneNumber || "",
        email: store.email || "",
        website: store.website || "",
        addressName: store.addressName || "",
        addressLocation: store.addressLocation || null,
        type: store.type || "shop",
        categoryIds: store.categoryIds || [],
        orderMinimumPrice: store.orderMinimumPrice || "",
        deliveryPrice: store.deliveryPrice || "",
        itemPrepTimeFrom: store.itemPrepTimeFrom || "",
        itemPrepTimeTo: store.itemPrepTimeTo || "",
        workTime: store.workTime || "",
        startTime:
          store.workTime?.length === 11 ? store.workTime?.slice(0, 5) : "",
        endTime: store.workTime?.length === 11 ? store.workTime?.slice(-5) : "",
        workDays: store.workDays || [],
        description: store.description || "",
        descriptionTranslate: store.descriptionTranslate || {
          uz: "",
          ru: "",
          en: "",
        },
        isActive: store.isActive !== undefined ? store.isActive : true,
        isVerified: store.isVerified || false,
        isPremium: store.isPremium || false,
        averageRating: store.averageRating || 0,
        acceptCash: store.acceptCash || false,
        acceptCard: store.acceptCard || false,
        acceptOnlinePayment: store.acceptOnlinePayment || false,
      });
      setAddressLocation(store.addressLocation);
      setImageIds(
        store.imageIds?.map((id: string) => ({ _id: id, url: "" })) || []
      );
    }
  }, [getByIdStatus, getByIdData]);

  useEffect(() => {
    if (status === "success") {
      // Form qiymatlarini tozalash
      reset({
        name: "",
        phoneNumber: "",
        email: "",
        website: "",
        addressName: "",
        addressLocation: null,
        type: "shop",
        categoryIds: [],
        orderMinimumPrice: "",
        deliveryPrice: "",
        itemPrepTimeFrom: "",
        itemPrepTimeTo: "",
        workTime: "",
        startTime: "",
        endTime: "",
        workDays: [],
        description: "",
        descriptionTranslate: {
          uz: "",
          ru: "",
          en: "",
        },
        isActive: true,
        isVerified: false,
        isPremium: false,
        averageRating: 0,
        acceptCash: false,
        acceptCard: false,
        acceptOnlinePayment: false,
      });

      // State'larni tozalash
      setAddressLocation(undefined);
      setImageIds([]);
      setLogoImage(null);
      setBannerImage(null);

      // Parent komponentga xabar berish
      resetForm();
    }
  }, [status]);

  const submit = (data: any) => {
    const requestData = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email || undefined,
      website: data.website || undefined,
      addressName: data.addressName || "",
      addressLocation: addressLocation || undefined,
      type: data.type || "shop",
      categoryIds: data.categoryIds || [],
      orderMinimumPrice: data.orderMinimumPrice ? +data.orderMinimumPrice : 0,
      deliveryPrice: data.deliveryPrice ? +data.deliveryPrice : 0,
      itemPrepTimeFrom: data.itemPrepTimeFrom ? +data.itemPrepTimeFrom : 5,
      itemPrepTimeTo: data.itemPrepTimeTo ? +data.itemPrepTimeTo : 10,
      workTime:
        data.startTime && data.endTime
          ? `${data.startTime}-${data.endTime}`
          : "",
      workDays: data.workDays || [],
      description: data.description || "",
      descriptionTranslate: data.descriptionTranslate || undefined,
      imageIds: imageIds.map((img) => img._id).filter(Boolean),
      isActive: data.isActive !== undefined ? data.isActive : true,
      isVerified: data.isVerified || false,
      isPremium: data.isPremium || false,
      averageRating: data.averageRating ? +data.averageRating : 0,
      acceptCash: data.acceptCash || false,
      acceptCard: data.acceptCard || false,
      acceptOnlinePayment: data.acceptOnlinePayment || false,
    };

    mutate(requestData);
  };

  const weekDays = [
    { value: 0, label: "Yakshanba" },
    { value: 1, label: "Dushanba" },
    { value: 2, label: "Seshanba" },
    { value: 3, label: "Chorshanba" },
    { value: 4, label: "Payshanba" },
    { value: 5, label: "Juma" },
    { value: 6, label: "Shanba" },
  ];

  return (
    <form id="store" onSubmit={handleSubmit(submit)}>
      <Grid container spacing={2}>
        {/* Asosiy maydonlar */}
        <Grid item xs={12} md={6}>
          <TextInput
            control={control}
            name="name"
            label="Do'kon/Restoran nomi"
            rules={{ required: true }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <PhoneInput
            control={control}
            name="phoneNumber"
            label={t("common.phoneNumber")}
            rules={{ required: true }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextInput
            control={control}
            name="email"
            type="email"
            label="Email"
            rules={{ required: false }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextInput
            control={control}
            name="website"
            type="url"
            label="Veb-sayt URL"
            rules={{ required: false }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <SelectForm
            control={control}
            name="type"
            label="Turi"
            options={[
              { _id: "shop", name: "Do'kon" },
              { _id: "restaurant", name: "Restoran" },
            ]}
            rules={{ required: true }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AutoCompleteForm
            control={control}
            name="categoryIds"
            optionsUrl="category/paging"
            label="Toifalar"
            returnOnlyId={true}
            rules={{ required: false }}
            multiple={true}
          />
        </Grid>

        {/* Manzil */}
        <Grid item xs={12}>
          <TextInput
            control={control}
            name="addressName"
            label={t("common.address")}
            rules={{ required: false }}
            onCustomChange={(value) => setAddress(value)}
          />
          {/* Address options - existing code */}
        </Grid>

        <Grid item xs={12}>
          <InputLabel>Xarita (Manzilni belgilash)</InputLabel>
          <YandexMap
            getCoordinate={setAddressLocation}
            center={watch("addressLocation")}
            height="300px"
          />
        </Grid>

        {/* Rasmlar */}
        <Grid item xs={12}>
          <InputLabel>Qo'shimcha rasmlar</InputLabel>
          <Grid container spacing={2}>
            {imageIds.map((img, index) => (
              <Grid item xs={6} md={3} key={index}>
                <ImageInput
                  control={control}
                  setValue={setValue}
                  name={`imageIds.${index}`}
                  getImage={(image: IIdImage) => {
                    const newImages = [...imageIds];
                    newImages[index] = image;
                    setImageIds(newImages);
                  }}
                />
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    const newImages = imageIds.filter((_, i) => i !== index);
                    setImageIds(newImages);
                  }}
                >
                  <Delete /> O'chirish
                </Button>
              </Grid>
            ))}
            <Grid item xs={6} md={3}>
              <Button
                variant="outlined"
                onClick={() => setImageIds([...imageIds, { _id: "", url: "" }])}
              >
                <Add /> Rasm qo'shish
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Narxlar */}
        <Grid item xs={12} md={4}>
          <TextInput
            control={control}
            name="orderMinimumPrice"
            type="number"
            label="Minimal buyurtma narxi (so'm)"
            rules={{ required: false }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextInput
            control={control}
            name="deliveryPrice"
            type="number"
            label="Yetkazib berish narxi (so'm)"
            rules={{ required: false }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextInput
            control={control}
            name="averageRating"
            type="number"
            label="O'rtacha reyting (0-5)"
            rules={{ required: false, min: 0, max: 5 }}
          />
        </Grid>

        {/* Tayyorlash vaqti */}
        <Grid item xs={12} md={6}>
          <TextInput
            control={control}
            name="itemPrepTimeFrom"
            type="number"
            label="Tayyorlash vaqti (minut) - dan"
            rules={{ required: false }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextInput
            control={control}
            name="itemPrepTimeTo"
            type="number"
            label="Tayyorlash vaqti (minut) - gacha"
            rules={{ required: false }}
          />
        </Grid>

        {/* Ish vaqti */}
        <Grid item xs={12} md={6}>
          <div className="mb-3 sm:flex md:gap-0 gap-y-2 justify-between items-end">
            <TimePicker
              control={control}
              name="startTime"
              errors={formState.errors}
              label="Ish vaqti (boshlanish)"
              rules={{ required: false }}
            />
            <TimePicker
              control={control}
              name="endTime"
              errors={formState.errors}
              label="Ish vaqti (tugash)"
              rules={{ required: false }}
            />
          </div>
        </Grid>

        {/* Hafta kunlari */}
        <Grid item xs={12}>
          <InputLabel>Hafta kunlari</InputLabel>
          {workDaysFields.map((field, index) => (
            <Grid
              container
              spacing={2}
              key={field.id}
              style={{ marginTop: "8px" }}
            >
              <Grid item xs={12} md={3}>
                <SelectForm
                  control={control}
                  name={`workDays.${index}.day`}
                  label="Kun"
                  options={weekDays.map((day) => ({
                    _id: day.value.toString(),
                    name: day.label,
                  }))}
                  rules={{ required: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TimePicker
                  control={control}
                  name={`workDays.${index}.startTime`}
                  label="Boshlanish"
                  errors={formState.errors}
                  rules={{ required: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TimePicker
                  control={control}
                  name={`workDays.${index}.endTime`}
                  label="Tugash"
                  errors={formState.errors}
                  rules={{ required: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Checkbox
                  control={control}
                  name={`workDays.${index}.isWorking`}
                  label="Ishlaydi"
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <Button color="error" onClick={() => removeWorkDay(index)}>
                  <Delete />
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            onClick={() =>
              appendWorkDay({
                day: 0,
                startTime: "09:00",
                endTime: "18:00",
                isWorking: true,
              })
            }
            style={{ marginTop: "8px" }}
          >
            <Add /> Kun qo'shish
          </Button>
        </Grid>

        {/* Tavsif */}
        <Grid item xs={12}>
          <InputLabel>{t("common.description")}</InputLabel>
          <TextEditor
            value={watch("description") || ""}
            onChange={(value) => setValue("description", value)}
          />
        </Grid>

        {/* Ko'p tilli tavsif */}
        <Grid item xs={12}>
          <InputLabel>Ko'p tilli tavsif</InputLabel>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextEditor
                value={watch("descriptionTranslate.uz") || ""}
                onChange={(value) => setValue("descriptionTranslate.uz", value)}
              />
              <InputLabel style={{ marginTop: "4px" }}>O'zbekcha</InputLabel>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextEditor
                value={watch("descriptionTranslate.ru") || ""}
                onChange={(value) => setValue("descriptionTranslate.ru", value)}
              />
              <InputLabel style={{ marginTop: "4px" }}>Ruscha</InputLabel>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextEditor
                value={watch("descriptionTranslate.en") || ""}
                onChange={(value) => setValue("descriptionTranslate.en", value)}
              />
              <InputLabel style={{ marginTop: "4px" }}>Inglizcha</InputLabel>
            </Grid>
          </Grid>
        </Grid>

        {/* To'lov usullari */}
        <Grid item xs={12}>
          <InputLabel>To'lov usullari</InputLabel>
          <Grid container spacing={2} style={{ marginTop: "8px" }}>
            <Grid item>
              <Checkbox control={control} name="acceptCard" label="Karta" />
            </Grid>
            <Grid item>
              <Checkbox control={control} name="acceptCash" label="Naqd" />
            </Grid>
            <Grid item>
              <Checkbox
                control={control}
                name="acceptOnlinePayment"
                label="Onlayn to'lov"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Statuslar */}
        <Grid item xs={12}>
          <InputLabel>Statuslar</InputLabel>
          <Grid container spacing={2} style={{ marginTop: "8px" }}>
            <Grid item>
              <Checkbox control={control} name="isActive" label="Faol" />
            </Grid>
            <Grid item>
              <Checkbox
                control={control}
                name="isVerified"
                label="Tastiqlangan"
              />
            </Grid>
            <Grid item>
              <Checkbox control={control} name="isPremium" label="Premium" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default StoreForm;
