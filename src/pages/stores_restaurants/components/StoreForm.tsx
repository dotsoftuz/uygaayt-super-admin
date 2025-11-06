import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Grid, InputLabel } from "@mui/material";
import {
  AutoCompleteForm,
  ImageInput,
  PhoneInput,
  TextInput,
} from "components";
import { UseFormReturn } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";
import TextEditor from "components/form/TextEditor/TextEditor";
import TimePicker from "components/form/TimePicker/TimePicker";
import YandexMap from "components/common/YandexMap/YandexMap";
import { ILocation } from "types/common.types";
import useDebounce from "hooks/useDebounce";
import { Checkbox } from "components";
import { IIdImage } from "hooks/usePostImage";

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
  const { control, handleSubmit, reset, watch, setValue, formState } = formStore;
  const { logoImage, setLogoImage, bannerImage, setBannerImage } = storeProps;

  const [showOptions, setShowOptions] = useState(false);
  const [addressLocation, setAddressLocation] = useState<ILocation>();
  const [address, setAddress] = useState("");
  const { debouncedValue } = useDebounce(address, 1000);

  const { mutate, status } = useApiMutation(
    editingStoreId ? "store/update" : "store/create",
    editingStoreId ? "put" : "post",
    {
      onSuccess: () => {
        resetForm();
      },
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
      enabled: !!editingStoreId,
      suspense: false,
    }
  );

  useEffect(() => {
    if (getByIdStatus === "success" && getByIdData?.data) {
      const store = getByIdData.data;
      reset({
        name: store.name || "",
        phoneNumber: store.phoneNumber || "",
        addressName: store.addressName || "",
        addressLocation: store.addressLocation || null,
        categoryId: store.categoryId || "",
        minimumOrderAmount: store.minimumOrderAmount || "",
        commissionPercent: store.commissionPercent || "",
        paymentMethods: store.paymentMethods || {
          card: false,
          cash: false,
          bonus: false,
        },
        startTime: store.workTime?.length === 11 ? store.workTime?.slice(0, 5) : "",
        endTime: store.workTime?.length === 11 ? store.workTime?.slice(-5) : "",
        description: store.description || "",
        logoId: store.logo || store.logoId || null,
        bannerId: store.banner || store.bannerId || null,
      });
      setAddressLocation(store.addressLocation);
      if (store.logo) {
        setLogoImage(store.logo);
      } else if (store.logoId) {
        setLogoImage({ url: "", _id: store.logoId });
      }
      if (store.banner) {
        setBannerImage(store.banner);
      } else if (store.bannerId) {
        setBannerImage({ url: "", _id: store.bannerId });
      }
    }
  }, [getByIdStatus, getByIdData]);

  useEffect(() => {
    if (status === "success") {
      resetForm();
    }
  }, [status]);

  const submit = (data: any) => {
    const requestData: any = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      addressName: data.addressName,
      addressLocation: addressLocation,
      categoryId: data.categoryId?._id || data.categoryId,
      minimumOrderAmount: data.minimumOrderAmount ? +data.minimumOrderAmount : null,
      commissionPercent: data.commissionPercent ? +data.commissionPercent : null,
      paymentMethods: {
        card: data.paymentMethods?.card || false,
        cash: data.paymentMethods?.cash || false,
        bonus: data.paymentMethods?.bonus || false,
      },
      workTime: data.startTime && data.endTime
        ? `${data.startTime}-${data.endTime}`
        : null,
      description: data.description || "",
      logoId: logoImage?._id || null,
      bannerId: bannerImage?._id || null,
      _id: editingStoreId,
    };

    mutate(requestData);
  };

  return (
    <form id="store" onSubmit={handleSubmit(submit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className="mb-3">
            <TextInput
              control={control}
              name="name"
              label="Do'kon nomi"
              rules={{ required: true }}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <div className="mb-3">
            <PhoneInput
              control={control}
              name="phoneNumber"
              label={t("common.phoneNumber")}
              rules={{ required: true }}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <div className="mb-3">
            <AutoCompleteForm
              control={control}
              name="categoryId"
              optionsUrl="category/paging"
              dataProp="data.data"
              label="Kategoriya"
              rules={{ required: true }}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <div className="mb-3">
            <TextInput
              control={control}
              name="minimumOrderAmount"
              type="number"
              label="Minimal buyurtma summasi (so'm)"
              rules={{ required: false }}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <div className="mb-3">
            <TextInput
              control={control}
              name="commissionPercent"
              type="number"
              label="Komissiya foizi (%)"
              rules={{ required: false }}
            />
          </div>
        </Grid>

        <Grid item xs={12}>
          <div className="mb-3">
            <TextInput
              control={control}
              name="addressName"
              label={t("common.address")}
              rules={{ required: false }}
              onCustomChange={(value) => setAddress(value)}
            />
            <div className="address-options" style={{ position: "relative" }}>
              {showOptions &&
                // @ts-ignore
                addressData?.data?.map((item: any) => (
                  <div
                    key={item._id}
                    className="option"
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      border: "1px solid #ddd",
                      marginTop: "4px",
                      borderRadius: "4px",
                    }}
                    onClick={() => {
                      setValue("addressName", item.name);
                      setValue("addressLocation", {
                        latitude: item.latitude,
                        longitude: item.longitude,
                      });
                      setAddressLocation({
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
        </Grid>

        <Grid item xs={12}>
          <div className="mb-3">
            <InputLabel>Xarita (Manzilni belgilash)</InputLabel>
            <YandexMap
              getCoordinate={setAddressLocation}
              center={watch("addressLocation")}
              height="300px"
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <div className="mb-3">
            <InputLabel>Logo rasmi</InputLabel>
            <ImageInput
              control={control}
              setValue={setValue}
              name="logoId"
              rules={{ required: false }}
              getImage={(image: IIdImage) => setLogoImage(image)}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <div className="mb-3">
            <InputLabel>Banner rasmi</InputLabel>
            <ImageInput
              control={control}
              setValue={setValue}
              name="bannerId"
              rules={{ required: false }}
              getImage={(image: IIdImage) => setBannerImage(image)}
            />
          </div>
        </Grid>

        <Grid item xs={12}>
          <div className="mb-3">
            <InputLabel>To'lov usullari</InputLabel>
            <Grid container spacing={2} style={{ marginTop: "8px" }}>
              <Grid item>
                <Checkbox
                  control={control}
                  name="paymentMethods.card"
                  label="Karta"
                />
              </Grid>
              <Grid item>
                <Checkbox
                  control={control}
                  name="paymentMethods.cash"
                  label="Naqd"
                />
              </Grid>
              <Grid item>
                <Checkbox
                  control={control}
                  name="paymentMethods.bonus"
                  label="Bonus"
                />
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <div className="mb-3 sm:flex md:gap-0 gap-y-2 justify-between items-end working-time">
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

        <Grid item xs={12}>
          <div className="mb-3">
            <InputLabel>{t("common.description")}</InputLabel>
            <TextEditor
              value={watch("description") || ""}
              onChange={(value) => setValue("description", value)}
            />
          </div>
        </Grid>
      </Grid>
    </form>
  );
};

export default StoreForm;

