import { Grid, IconButton, Box, Divider, InputLabel, Button } from "@mui/material";
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
import { Add, Delete } from "@mui/icons-material";

const About = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [addressLocation, setAddressLocation] = useState<ILocation>();
  const [address, setAddress] = useState("");
  const { debouncedValue } = useDebounce(address, 1000);
  const [copiedText, copy] = useCopyToClipboard();
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

    onSuccess({ data }) {
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
        _id: about._id, // _id ni form'ga saqlash
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
    }
  }, [status, data]);

  const submit = (data: any) => {
    const requestData = {
      _id: data._id, // _id ni qo'shish - update uchun majburiy
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
              {workDaysFields.map((field, index) => (
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
    </AboutStyled>
  );
};

export default About;
