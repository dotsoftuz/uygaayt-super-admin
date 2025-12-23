import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Grid, InputLabel, Button, Box, Tabs, Tab, Divider } from "@mui/material";
import {
  AutoCompleteForm,
  ImageInput,
  PhoneInput,
  TextInput,
  SelectForm,
  ColorPicker,
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
import { Add, Delete, Store, LocationOn, AttachMoney, Settings, Description } from "@mui/icons-material";

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
  const { debouncedValue } = useDebounce(address, 1000);

  // Logo va Banner image'larni form field'lar bilan sinxronlashtirish
  useEffect(() => {
    if (logoImage) {
      setValue("logoImage", logoImage);
    } else {
      setValue("logoImage", undefined);
    }
  }, [logoImage, setValue]);

  useEffect(() => {
    if (bannerImage) {
      setValue("bannerImage", bannerImage);
    } else {
      setValue("bannerImage", undefined);
    }
  }, [bannerImage, setValue]);

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
      // Sync addressLocation with form state
      setValue("addressLocation", addressLocation);
    }
  }, [addressLocation, setValue]);

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
        password: "", // Password har doim bo'sh (xavfsizlik uchun)
        email: store.email || "",
        website: store.website || "",
        addressName: store.addressName || "",
        addressLocation: store.addressLocation || null,
        type: store.type || "shop",
        brandColor: store.brandColor || "#ef6c1d",
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
      // Logo va Banner image'larni set qilish
      if (store.logoId) {
        const logoImg = { _id: store.logoId, url: `${process.env.REACT_APP_BASE_URL}/image/${store.logoId}` };
        setLogoImage(logoImg);
        setValue("logoImage", logoImg);
      } else {
        setLogoImage(null);
        setValue("logoImage", undefined);
      }
      if (store.bannerId) {
        const bannerImg = { _id: store.bannerId, url: `${process.env.REACT_APP_BASE_URL}/image/${store.bannerId}` };
        setBannerImage(bannerImg);
        setValue("bannerImage", bannerImg);
      } else {
        setBannerImage(null);
        setValue("bannerImage", undefined);
      }
    }
  }, [getByIdStatus, getByIdData, setLogoImage, setBannerImage, setValue]);

  useEffect(() => {
    if (status === "success") {
      // Form qiymatlarini tozalash
      reset({
        name: "",
        phoneNumber: "",
        password: "", // Password qo'shish
        email: "",
        website: "",
        addressName: "",
        addressLocation: null,
        type: "shop",
        brandColor: "#ef6c1d",
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
      setLogoImage(null);
      setBannerImage(null);

      // Form field'larni ham tozalash
      setValue("logoImage", undefined);
      setValue("bannerImage", undefined);

      // Parent komponentga xabar berish
      resetForm();
    }
  }, [status, setValue]);

  const submit = (data: any) => {
    // Validation checks - faqat create uchun addressLocation required
    if (!editingStoreId && !addressLocation) {
      toast.error("Manzilni xaritada belgilash majburiy");
      setActiveTab(1);
      return;
    }

    if (!data.startTime || !data.endTime) {
      toast.error("Ish vaqti majburiy");
      setActiveTab(2); // Switch to prices/time tab
      return;
    }

    if (!data.type) {
      toast.error("Turi majburiy");
      setActiveTab(0); // Switch to main tab
      return;
    }

    const requestData = {
      ...(editingStoreId && { _id: editingStoreId }), // Update uchun _id qo'shish
      name: data.name,
      phoneNumber: data.phoneNumber,
      password: data.password || undefined, // Password qo'shish - bo'sh bo'lsa undefined
      email: data.email || undefined,
      website: data.website || undefined,
      addressName: data.addressName || "",
      addressLocation: addressLocation || undefined,
      type: data.type || "shop",
      brandColor: data.brandColor || "#ef6c1d",
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
      logoId: logoImage?._id || undefined,
      bannerId: bannerImage?._id || undefined,
      isActive: data.isActive !== undefined ? data.isActive : true,
      isVerified: data.isVerified || false,
      isPremium: data.isPremium || false,
      averageRating: data.averageRating ? +data.averageRating : 0,
      acceptCash: data.acceptCash || false,
      acceptCard: data.acceptCard || false,
      acceptOnlinePayment: data.acceptOnlinePayment || false,
    };

    // Password bo'sh bo'lsa, uni requestData'dan olib tashlash (update uchun)
    if (!requestData.password && editingStoreId) {
      delete requestData.password;
    }

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

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <form id="store" onSubmit={handleSubmit(submit)}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mb: 3,
          width: '100%',
          minWidth: 0,
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            width: '100%',
            minWidth: 0,
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
            },
            '& .MuiTabs-scroller': {
              width: '100%',
            }
          }}
        >
          <Tab icon={<Store />} iconPosition="start" label="Asosiy ma'lumotlar" />
          <Tab icon={<LocationOn />} iconPosition="start" label="Manzil" />
          <Tab icon={<AttachMoney />} iconPosition="start" label="Narxlar va vaqt" />
          <Tab icon={<Description />} iconPosition="start" label="Tavsif" />
          <Tab icon={<Settings />} iconPosition="start" label="Sozlamalar" />
        </Tabs>
      </Box>

      {/* Tab Panel 0: Asosiy ma'lumotlar */}
      {activeTab === 0 && (
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Asosiy maydonlar */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextInput
                control={control}
                name="name"
                label="Do'kon/Restoran nomi"
                placeholder="Masalan: Uygaayt Do'kon"
                rules={{
                  required: {
                    value: true,
                    message: "Do'kon/Restoran nomi majburiy"
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <PhoneInput
                control={control}
                name="phoneNumber"
                label={t("common.phoneNumber")}
                rules={{
                  required: {
                    value: true,
                    message: "Telefon raqami majburiy"
                  }
                }}
              />
            </Grid>

            {/* Password input qo'shish - faqat yangi qo'shishda majburiy */}
            {!editingStoreId && (
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextInput
                  control={control}
                  name="password"
                  type="password"
                  label="Parol"
                  rules={{
                    required: !editingStoreId, // Yangi qo'shishda majburiy
                    minLength: {
                      value: 4,
                      message: "Parol kamida 4 ta belgi bo'lishi kerak",
                    },
                  }}
                  placeholder="Parol kiriting (min 4 belgi)"
                />
              </Grid>
            )}

            {/* Tahrirlashda password yangilash uchun (ixtiyoriy) */}
            {editingStoreId && (
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextInput
                  control={control}
                  name="password"
                  type="password"
                  label="Yangi parol (ixtiyoriy)"
                  rules={{
                    required: false,
                    minLength: {
                      value: 4,
                      message: "Parol kamida 4 ta belgi bo'lishi kerak",
                    },
                  }}
                  placeholder="Parolni yangilash uchun kiriting"
                />
              </Grid>
            )}

            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextInput
                control={control}
                name="email"
                type="email"
                label="Email"
                placeholder="Masalan: info@store.uz"
                rules={{ required: false }}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextInput
                control={control}
                name="website"
                type="url"
                label="Veb-sayt URL"
                placeholder="Masalan: https://www.store.uz"
                rules={{ required: false }}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <SelectForm
                control={control}
                name="type"
                label="Turi"
                options={[
                  { _id: "shop", name: "Do'kon" },
                  { _id: "restaurant", name: "Restoran" },
                ]}
                rules={{
                  required: {
                    value: true,
                    message: "Turi majburiy"
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <ColorPicker
                control={control}
                name="brandColor"
                label="Brend rangi"
                placeholder="#ef6c1d"
                rules={{
                  required: {
                    value: true,
                    message: "Brend rangi majburiy"
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
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

            {/* Rasmlar */}
            <Grid item xs={12}>
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Rasmlar</InputLabel>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InputLabel sx={{ mb: 1, fontWeight: 500 }}>Logo rasm</InputLabel>
                  <ImageInput
                    control={control}
                    setValue={setValue}
                    name="logoImage"
                    rules={{ required: false }}
                    getImage={(image: IIdImage) => {
                      setLogoImage(image);
                    }}
                  />
                  {logoImage && (
                    <Button
                      size="small"
                      color="error"
                      fullWidth
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setLogoImage(null);
                        setValue("logoImage", undefined);
                      }}
                    >
                      <Delete /> O'chirish
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputLabel sx={{ mb: 1, fontWeight: 500 }}>Banner rasm</InputLabel>
                  <ImageInput
                    control={control}
                    setValue={setValue}
                    name="bannerImage"
                    rules={{ required: false }}
                    getImage={(image: IIdImage) => {
                      setBannerImage(image);
                    }}
                  />
                  {bannerImage && (
                    <Button
                      size="small"
                      color="error"
                      fullWidth
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setBannerImage(null);
                        setValue("bannerImage", undefined);
                      }}
                    >
                      <Delete /> O'chirish
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab Panel 1: Manzil */}
      {activeTab === 1 && (
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <Grid container spacing={2} alignItems="centert">
            <Grid item xs={12}>
              <TextInput
                control={control}
                name="addressName"
                label={t("common.address")}
                placeholder="Masalan: Toshkent shahar, Chilonzor tumani, Bunyodkor ko'chasi"
                rules={{ required: false }}
                onCustomChange={(value) => setAddress(value)}
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel sx={{ mb: 1, fontWeight: 600 }}>
                Xarita (Manzilni belgilash)
                <span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span>
              </InputLabel>
              <YandexMap
                getCoordinate={setAddressLocation}
                center={watch("addressLocation")}
                height="400px"
              />
              {!addressLocation && (
                <h6 style={{ color: '#d32f2f', marginTop: '8px', fontSize: '0.75rem', margin: '8px 0 0 0' }}>
                  Manzilni xaritada belgilash majburiy
                </h6>
              )}
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab Panel 2: Narxlar va vaqt */}
      {activeTab === 2 && (
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <Grid container spacing={2} alignItems="centert">
            <Grid item xs={12}>
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Narxlar</InputLabel>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextInput
                control={control}
                name="orderMinimumPrice"
                type="number"
                label="Minimal buyurtma narxi (so'm)"
                placeholder="Masalan: 50000"
                rules={{ required: false }}
              />
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextInput
                control={control}
                name="deliveryPrice"
                type="number"
                label="Yetkazib berish narxi (so'm)"
                placeholder="Masalan: 15000"
                rules={{ required: false }}
              />
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextInput
                control={control}
                name="averageRating"
                type="number"
                label="O'rtacha reyting (0-5)"
                placeholder="Masalan: 4.5"
                rules={{ required: false, min: 0, max: 5 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
            </Grid>

            <Grid item xs={12}>
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Tayyorlash vaqti</InputLabel>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextInput
                control={control}
                name="itemPrepTimeFrom"
                type="number"
                label="Tayyorlash vaqti (minut) - dan"
                placeholder="Masalan: 15"
                rules={{ required: false }}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextInput
                control={control}
                name="itemPrepTimeTo"
                type="number"
                label="Tayyorlash vaqti (minut) - gacha"
                placeholder="Masalan: 30"
                rules={{ required: false }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
            </Grid>

            <Grid item xs={12}>
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Ish vaqti</InputLabel>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <TimePicker
                control={control}
                name="startTime"
                errors={formState.errors}
                label="Ish vaqti (boshlanish)"
                rules={{
                  required: {
                    value: true,
                    message: "Ish vaqti boshlanishi majburiy"
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <TimePicker
                control={control}
                name="endTime"
                errors={formState.errors}
                label="Ish vaqti (tugash)"
                rules={{
                  required: {
                    value: true,
                    message: "Ish vaqti tugashi majburiy"
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
            </Grid>

            <Grid item xs={12}>
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Hafta kunlari</InputLabel>
              {workDaysFields.map((field, index) => (
                <Grid
                  container
                  spacing={2}
                  key={field.id}
                  sx={{ mt: 1 }}
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
                    <Box sx={{ pt: 2 }}>
                      <Checkbox
                        control={control}
                        name={`workDays.${index}.isWorking`}
                        label="Ishlaydi"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <Box sx={{ pt: 1 }}>
                      <Button
                        color="error"
                        onClick={() => removeWorkDay(index)}
                        size="small"
                      >
                        <Delete />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() =>
                  appendWorkDay({
                    day: 0,
                    startTime: "09:00",
                    endTime: "18:00",
                    isWorking: true,
                  })
                }
                sx={{ mt: 2 }}
              >
                Kun qo'shish
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab Panel 3: Tavsif */}
      {activeTab === 3 && (
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <Grid container spacing={2} alignItems="centert">
            <Grid item xs={12}>
              <InputLabel sx={{ mb: 1, fontWeight: 600 }}>Asosiy tavsif</InputLabel>
              <TextEditor
                value={watch("description") || ""}
                onChange={(value) => setValue("description", value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
            </Grid>

            <Grid item xs={12}>
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Ko'p tilli tavsif</InputLabel>
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ mb: 1 }}>O'zbekcha</InputLabel>
              <TextEditor
                value={watch("descriptionTranslate.uz") || ""}
                onChange={(value) => setValue("descriptionTranslate.uz", value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ mb: 1 }}>Ruscha</InputLabel>
              <TextEditor
                value={watch("descriptionTranslate.ru") || ""}
                onChange={(value) => setValue("descriptionTranslate.ru", value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ mb: 1 }}>Inglizcha</InputLabel>
              <TextEditor
                value={watch("descriptionTranslate.en") || ""}
                onChange={(value) => setValue("descriptionTranslate.en", value)}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab Panel 4: Sozlamalar */}
      {activeTab === 4 && (
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <Grid container spacing={2} alignItems="centert">
            <Grid item xs={12}>
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>To'lov usullari</InputLabel>
              <Grid container spacing={2}>
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

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
            </Grid>

            <Grid item xs={12}>
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Statuslar</InputLabel>
              <Grid container spacing={2}>
                <Grid item>
                  <Checkbox control={control} name="isActive" label="Faol" />
                </Grid>
                <Grid item>
                  <Checkbox
                    control={control}
                    name="isVerified"
                    label="Tasdiqlangan"
                  />
                </Grid>
                <Grid item>
                  <Checkbox control={control} name="isPremium" label="Premium" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
    </form>
  );
};

export default StoreForm;
