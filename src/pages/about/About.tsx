import { Grid, IconButton, Box, Divider, InputLabel, Button, Badge, Card, CardContent, Avatar, Typography, Chip } from "@mui/material";
import { AboutStyled } from "./About.styled";
import { ImageInput, MainButton, PhoneInput, TextInput, SelectForm, Checkbox, ColorPicker, AutoCompleteForm } from "components";
import { useForm, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import TextEditor from "components/form/TextEditor/TextEditor";
import TimePicker from "components/form/TimePicker/TimePicker";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useEffect, useState } from "react";
import YandexMap from "components/common/YandexMap/YandexMap";
import { ILocation } from "types/common.types";
import useDebounce from "hooks/useDebounce";
import { get } from "lodash";
import { CopyIcon } from "assets/svgs";
import useCopyToClipboard from "hooks/useClipboard";
import { Add, Delete, Edit, Inventory, CheckCircle, Cancel } from "@mui/icons-material";
import PackageItemForm from "./components/PackageItemForm";

console.log("About");

const About = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [addressLocation, setAddressLocation] = useState<ILocation>();
  const [address, setAddress] = useState("");
  const { debouncedValue } = useDebounce(address, 1000);
  const [copiedText, copy] = useCopyToClipboard();
  const [packageItems, setPackageItems] = useState<any[]>([]);
  const [showPackageItemForm, setShowPackageItemForm] = useState(false);
  const [editingPackageItem, setEditingPackageItem] = useState<any | null>(null);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, any>>({});
  const { control, setValue, handleSubmit, formState, reset, watch } =
    useForm();
  const { t } = useTranslation();

  const { data, status } = useApi(
    "store/get",
    {},
    {
      suspense: false,
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

  useEffect(() => {
    if (typeof address === "string" && address.trim()) {
      addressByName({ name: address });
    }
  }, [address]);

  const { mutate } = useApiMutation("store/update", "put");

  const { mutate: addressByPointName } = useApiMutation(`address/by-point`, "post", {

    onSuccess({ data }: { data: any }) {
      setValue("addressName", data?.name);
    },
  });

  const {
    fields: workDaysFields,
    append: appendWorkDay,
    remove: removeWorkDay,
  } = useFieldArray({
    control,
    name: "workDays",
  });

  useEffect(() => {
    if (addressLocation?.latitude && addressLocation?.longitude) {
      addressByPointName({
        latitude: addressLocation.latitude,
        longitude: addressLocation.longitude,
      });
    } else {
      console.error("Coordinates are missing");
    }
  }, [addressByPointName, addressLocation])


  useEffect(() => {
    if (status === "success") {
      const about = data?.data;
      reset({
        ...about,
        _id: about._id,
        email: about.email || "",
        website: about.website || "",
        type: about.type || "shop",
        brandColor: about.brandColor || "#ef6c1d",
        categoryIds: about.categoryIds || [],
        orderMinimumPrice: about.orderMinimumPrice || "",
        startTime:
          about.workTime?.length === 11 ? about.workTime?.slice(0, 5) : "",
        endTime: about.workTime?.length === 11 ? about.workTime?.slice(-5) : "",
        workDays: about.workDays || [],
        addressLocation: about.addressLocation,
        deliveryPrice: about.deliveryPrice || "",
        itemPrepTimeFrom: about.itemPrepTimeFrom || "",
        itemPrepTimeTo: about.itemPrepTimeTo || "",
        descriptionTranslate: about.descriptionTranslate || {
          uz: "",
          ru: "",
          en: "",
        },
        isActive: about.isActive !== undefined ? about.isActive : true,
        isVerified: about.isVerified !== undefined ? about.isVerified : false,
        isPremium: about.isPremium !== undefined ? about.isPremium : false,
        acceptCash: about.acceptCash !== undefined ? about.acceptCash : false,
        acceptCard: about.acceptCard !== undefined ? about.acceptCard : false,
        acceptOnlinePayment: about.acceptOnlinePayment !== undefined ? about.acceptOnlinePayment : false,
      });
      setAddressLocation(about.addressLocation);
      if (about.packageItems) {
        setPackageItems(Array.isArray(about.packageItems) ? about.packageItems : []);
      }
    }
  }, [status, data, reset]);

  const { mutate: fetchCategories, data: categoriesData } = useApiMutation(
    "category/paging",
    "post",
    {}
  );

  useEffect(() => {
    if (packageItems.length > 0) {
      fetchCategories({ page: 1, limit: 200 });
    }
  }, [packageItems.length, fetchCategories]);

  useEffect(() => {
    if (categoriesData?.data?.data) {
      const map: Record<string, any> = {};
      categoriesData.data.data.forEach((cat: any) => {
        map[String(cat._id)] = cat;
      });
      setCategoriesMap(map);
    } else if (categoriesData?.data && Array.isArray(categoriesData.data)) {
      const map: Record<string, any> = {};
      categoriesData.data.forEach((cat: any) => {
        map[String(cat._id)] = cat;
      });
      setCategoriesMap(map);
    }
  }, [categoriesData]);

  const handlePackageItemSave = async (packageItemData: any) => {
    const currentData = watch();
    let finalPackageItemData = { ...packageItemData };
    if (!editingPackageItem && !packageItemData._id) {
      const generateMongoObjectId = () => {
        const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
        const randomPart = 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
          return (Math.random() * 16 | 0).toString(16);
        }).toLowerCase();
        const objectId = (timestamp + randomPart).substring(0, 24);
        return { $oid: objectId };
      };
      finalPackageItemData._id = generateMongoObjectId();
    }
    const normalizeId = (id: any) => {
      if (!id) return null;
      if (typeof id === 'object' && id.$oid) return id.$oid;
      return String(id);
    };
    const transformPackageItemsForBackend = (items: any[]) => {
      return items.map(item => {
        const transformedItem = { ...item };
        if (transformedItem._id && typeof transformedItem._id === 'object' && transformedItem._id.$oid) {
          transformedItem._id = transformedItem._id.$oid;
        }
        return transformedItem;
      });
    };

    const updateData = {
      ...currentData,
      _id: currentData._id,
      packageItems: transformPackageItemsForBackend(
        editingPackageItem
          ? packageItems.map((item) => {
              const itemId = normalizeId(item._id);
              const editingId = normalizeId(editingPackageItem._id);
              return itemId === editingId ? finalPackageItemData : item;
            })
          : [...packageItems, finalPackageItemData]
      ),
    };
    mutate(updateData);
    setPackageItems(updateData.packageItems);
    setShowPackageItemForm(false);
    setEditingPackageItem(null);
  };

  const submit = (data: any) => {
    const requestData = {
      _id: data._id,
      name: data.name,
      email: data.email || undefined,
      website: data.website || undefined,
      type: data.type || "shop",
      brandColor: data.brandColor || "#ef6c1d",
      categoryIds: data.categoryIds || [],
      orderMinimumPrice: data.orderMinimumPrice ? +data.orderMinimumPrice : 0,
      description: data.description || "",
      descriptionTranslate: data.descriptionTranslate || undefined,
      workTime: data.startTime
        ? `${data.startTime}-${data.endTime}`
        : undefined,
      workDays: data.workDays || [],
      phoneNumber: data.phoneNumber,
      addressName: data.addressName,
      addressLocation: addressLocation || undefined,
      deliveryPrice: data.deliveryPrice ? +data.deliveryPrice : 0,
      itemPrepTimeFrom: data.itemPrepTimeFrom ? +data.itemPrepTimeFrom : 5,
      itemPrepTimeTo: data.itemPrepTimeTo ? +data.itemPrepTimeTo : 10,
      isActive: data.isActive !== undefined ? data.isActive : true,
      isVerified: data.isVerified !== undefined ? data.isVerified : false,
      isPremium: data.isPremium !== undefined ? data.isPremium : false,
      acceptCash: data.acceptCash !== undefined ? data.acceptCash : false,
      acceptCard: data.acceptCard !== undefined ? data.acceptCard : false,
      acceptOnlinePayment: data.acceptOnlinePayment !== undefined ? data.acceptOnlinePayment : false,
      packageItems: packageItems.map(item => {
        const transformedItem = { ...item };
        if (transformedItem._id && typeof transformedItem._id === 'object' && transformedItem._id.$oid) {
          transformedItem._id = transformedItem._id.$oid;
        }
        return transformedItem;
      }),
    };
    mutate(requestData);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categoriesMap[String(categoryId)];
    if (!category) return '';
    const currentLang = localStorage.getItem('i18nextLng') || 'uz';
    return category.name?.[currentLang] || category.name?.uz || category.name || '';
  };

  const formatImageUrl = (imageUrl: any) => {
    if (!imageUrl) return null;
    const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3002/v1';
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    let url = typeof imageUrl === 'string' ? imageUrl : imageUrl.url || '';
    if (url.startsWith('uploads/')) {
      url = url.replace('uploads/', '');
    }
    if (!url.startsWith('http')) {
      return `${cleanBaseUrl}/uploads/${url}`;
    }
    return url;
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
    <AboutStyled>
      <form onSubmit={handleSubmit(submit)}>
        <Grid className="w-full">
          <div className="save-btn">
            <MainButton
              title={t("general.save")}
              variant="contained"
              type="submit"
            />
          </div>
        </Grid>
        <Grid className="block lg:flex">
          <Grid className="lg:w-[50%] pr-3 py-3">
            <div className="mb-3">
              <TextInput
                control={control}
                name="name"
                label={t("common.companyName")}
                rules={{ required: true }}
              />
            </div>
            <div className="mb-3">
              <PhoneInput
                control={control}
                name="phoneNumber"
                label={t("common.phoneNumber")}
                rules={{ required: false }}
              />
            </div>
            <div className="mb-3">
              <TextInput
                control={control}
                name="email"
                type="email"
                label="Email"
                placeholder="Masalan: info@store.uz"
                rules={{ required: false }}
              />
            </div>
            <div className="mb-3">
              <TextInput
                control={control}
                name="website"
                type="url"
                label="Veb-sayt URL"
                placeholder="Masalan: https://www.store.uz"
                rules={{ required: false }}
              />
            </div>
            <div className="mb-3">
              <SelectForm
                control={control}
                name="type"
                label="Turi"
                options={[
                  { _id: "shop", name: "Do'kon" },
                  { _id: "restaurant", name: "Restoran" },
                ]}
                rules={{ required: false }}
              />
            </div>
            <div className="mb-3">
              <ColorPicker
                control={control}
                name="brandColor"
                label="Brend rangi"
                placeholder="#ef6c1d"
                rules={{ required: false }}
              />
            </div>
            <div className="mb-3">
              <AutoCompleteForm
                control={control}
                name="categoryIds"
                optionsUrl="category/paging"
                label="Toifalar"
                returnOnlyId={true}
                rules={{ required: false }}
                multiple={true}
              />
            </div>
            <div className="mb-3">
              <TextInput
                control={control}
                name="addressName"
                label={t("common.address")}
                rules={{ required: false }}
                onCustomChange={(value) => setAddress(value)}
              />
              <div className="address-options">
                {showOptions &&
                  // @ts-ignore
                  addressData?.data?.map((item: any) => (
                    <div
                      key={item.name}
                      className="option"
                      onClick={() => {
                        setValue("addressName", item.name);
                        setValue("addressLocation", {
                          latitude: item.latitude,
                          longitude: item.longitude,
                        });
                        setShowOptions(false);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
              </div>
            </div>
            <Divider sx={{ my: 3 }} />
            <div className="mb-3">
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Narxlar</InputLabel>
              <div className="mb-3">
                <TextInput
                  control={control}
                  name="orderMinimumPrice"
                  type="number"
                  label="Minimal buyurtma narxi (so'm)"
                  placeholder="Masalan: 50000"
                  rules={{ required: false }}
                />
              </div>
              <div className="mb-3">
                <TextInput
                  control={control}
                  name="deliveryPrice"
                  type="number"
                  label={t('order.deliveryPrice')}
                  rules={{ required: false }}
                />
              </div>
            </div>
            <Divider sx={{ my: 3 }} />
            <div className="mb-3">
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Tayyorlash vaqti</InputLabel>
              <div className="sm:flex md:gap-0 gap-y-2 justify-between items-end working-time">
                <TextInput
                  control={control}
                  name="itemPrepTimeFrom"
                  type="number"
                  label={t("settings.delivery_time")!}
                  rules={{ required: false }}
                />
                <TextInput
                  control={control}
                  name="itemPrepTimeTo"
                  type="number"
                  label="Tayyorlash vaqti (gacha)"
                  rules={{ required: false }}
                />
              </div>
            </div>
            <Divider sx={{ my: 3 }} />
            <div className="mb-3">
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Ish vaqti</InputLabel>
              <div className="sm:flex md:gap-0 gap-y-2 justify-between items-end working-time">
                <TimePicker
                  control={control}
                  name="startTime"
                  errors={formState.errors}
                  label={t("common.workTime")!}
                  rules={{ required: false }}
                />
                <TimePicker
                  control={control}
                  name="endTime"
                  errors={formState.errors}
                  rules={{ required: false }}
                />
              </div>
            </div>
            <Divider sx={{ my: 3 }} />
            <div className="mb-3">
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Hafta kunlari</InputLabel>
              {workDaysFields.map((field: any, index: number) => (
                <Grid
                  container
                  spacing={2}
                  key={field.id}
                  sx={{ mt: 1, mb: 2 }}
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
                      rules={{ required: false }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TimePicker
                      control={control}
                      name={`workDays.${index}.startTime`}
                      label="Boshlanish"
                      errors={formState.errors}
                      rules={{ required: false }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TimePicker
                      control={control}
                      name={`workDays.${index}.endTime`}
                      label="Tugash"
                      errors={formState.errors}
                      rules={{ required: false }}
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
            </div>
            <Divider sx={{ my: 3 }} />
            <div className="mb-3">
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>To'lov usullari</InputLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Checkbox control={control} name="acceptCard" label="Karta" />
                <Checkbox control={control} name="acceptCash" label="Naqd" />
                <Checkbox
                  control={control}
                  name="acceptOnlinePayment"
                  label="Onlayn to'lov"
                />
              </Box>
            </div>
            <Divider sx={{ my: 3 }} />
            <div className="mb-3">
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Statuslar</InputLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Checkbox control={control} name="isActive" label="Faol" />
                <Checkbox
                  control={control}
                  name="isVerified"
                  label="Tasdiqlangan"
                />
                <Checkbox control={control} name="isPremium" label="Premium" />
              </Box>
            </div>
            <Divider sx={{ my: 3 }} />
            <div className="mb-3">
              <label className="custom-label">{t("common.description")}</label>
              <TextEditor
                value={watch("description")}
                onChange={(value) => setValue("description", value)}
              />
            </div>
            <Divider sx={{ my: 3 }} />
            <div className="mb-3">
              <InputLabel sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>Ko'p tilli tavsif</InputLabel>
              <div className="mb-3">
                <InputLabel sx={{ mb: 1 }}>O'zbekcha</InputLabel>
                <TextEditor
                  value={watch("descriptionTranslate.uz") || ""}
                  onChange={(value) => setValue("descriptionTranslate.uz", value)}
                />
              </div>
              <div className="mb-3">
                <InputLabel sx={{ mb: 1 }}>Ruscha</InputLabel>
                <TextEditor
                  value={watch("descriptionTranslate.ru") || ""}
                  onChange={(value) => setValue("descriptionTranslate.ru", value)}
                />
              </div>
              <div className="mb-3">
                <InputLabel sx={{ mb: 1 }}>Inglizcha</InputLabel>
                <TextEditor
                  value={watch("descriptionTranslate.en") || ""}
                  onChange={(value) => setValue("descriptionTranslate.en", value)}
                />
              </div>
            </div>
            <Divider sx={{ my: 3 }} />
            <div className="mb-3">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory />
                  <InputLabel sx={{ fontWeight: 600, fontSize: '16px' }}>Qo'shimcha itemlar</InputLabel>
                </Box>
                {packageItems.length === 0 && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => {
                      setEditingPackageItem(null);
                      setShowPackageItemForm(true);
                    }}
                  >
                    Qo'shish
                  </Button>
                )}
              </Box>
              {packageItems.map((item, index) => {
                const currentLang = localStorage.getItem('i18nextLng') || 'uz';
                const itemName = item.name?.[currentLang] || item.name?.uz || item.name || 'Nomsiz';
                
                let imageUrl = null;
                if (item.image?.url) {
                  imageUrl = formatImageUrl(item.image.url);
                } else if (item.imageId) {
                  const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3002/v1';
                  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
                  imageUrl = `${cleanBaseUrl}/image/get/${item.imageId}`;
                }
                
                return (
                  <Card key={item._id || index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {imageUrl ? (
                          <Avatar
                            src={imageUrl}
                            alt={itemName}
                            sx={{ width: 64, height: 64 }}
                            variant="rounded"
                          />
                        ) : (
                          <Avatar sx={{ width: 64, height: 64 }} variant="rounded">
                            <Inventory />
                          </Avatar>
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {itemName}
                            </Typography>
                            {item.isActive === true ? (
                              <Badge
                                badgeContent={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CheckCircle sx={{ fontSize: 12 }} />
                                    <Typography variant="caption">Faol</Typography>
                                  </Box>
                                }
                                color="success"
                              />
                            ) : (
                              <Badge
                                badgeContent={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Cancel sx={{ fontSize: 12 }} />
                                    <Typography variant="caption">Nofaol</Typography>
                                  </Box>
                                }
                                color="default"
                              />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {item.price?.toLocaleString('uz-UZ') || 0} so'm
                          </Typography>
                          {item.categoryIds && item.categoryIds.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {item.categoryIds.map((categoryId: string) => {
                                const categoryName = getCategoryName(categoryId);
                                if (!categoryName) return null;
                                return (
                                  <Chip
                                    key={String(categoryId)}
                                    label={categoryName}
                                    size="small"
                                    variant="outlined"
                                  />
                                );
                              })}
                            </Box>
                          ) : (
                            <Chip
                              label="Barcha kategoriyalar uchun"
                              size="small"
                              variant="outlined"
                              color="default"
                            />
                          )}
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => {
                            setEditingPackageItem(item);
                            setShowPackageItemForm(true);
                          }}
                        >
                          Tahrirlash
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </Grid>
          <Grid className="lg:w-[50%]">
            <div className="mt-5">
              <br />
              <YandexMap
                getCoordinate={setAddressLocation}
                center={watch("addressLocation")}
                height="70vh"
              />
            </div>
          </Grid>
        </Grid>
      </form>
      <PackageItemForm
        open={showPackageItemForm}
        onClose={() => {
          setShowPackageItemForm(false);
          setEditingPackageItem(null);
        }}
        packageItem={editingPackageItem}
        onSave={handlePackageItemSave}
      />
    </AboutStyled>
  );
};

export default About;
