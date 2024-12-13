import { Controller, useForm } from "react-hook-form";
import {
  FullscreenControl,
  GeolocationControl,
  Map,
  Placemark,
  TypeSelector,
  YMaps,
  ZoomControl,
} from "react-yandex-maps";
import {
  DatePickerTime,
  MainButton,
  Modal,
  PhoneInput,
  SelectForm,
  TextInput,
} from "components";
import { AddOrderFormStyled, AddressModalStyled } from "./AddOrderForm.styled";
import TextEditor from "components/form/TextEditor/TextEditor";
import { useTranslation } from "react-i18next";
import { Grid, TextareaAutosize } from "@mui/material";
import { useEffect, useState } from "react";
import { LeftArrowIcon } from "assets/svgs";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useDebounce from "hooks/useDebounce";
import { PAYMENT_TYPES } from "types/enums";
import { IOrder, IProduct } from "types/common.types";
import { useNavigate, useParams } from "react-router-dom";
import { numberFormat } from "utils/numberFormat";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import useCommonContext from "context/useCommon";
import { get } from "lodash";
import YandexMapForOrder from "components/common/YandexMapForOrder/YandexMapForOrder";
import SelectPost from "components/form/SelectPost/SelectFormPost";

const AddOrderForm = ({
  basketItems,
  formStore,
  order
}: {
  basketItems: IProduct[];
  formStore?: any;
  order?: any
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [open, setOpen] = useState(false);
  const [coordinate, setCoordinate] = useState<any>();
  const [address, setAddress] = useState("");
  const { t } = useTranslation();
  const { control, setValue, handleSubmit, watch, setError, reset, getValues } = useForm();
  const { debouncedValue } = useDebounce(address, 1000);
  const navigate = useNavigate();
  const { id } = useParams();
  const allProductPrice = basketItems.reduce(
    (prev, item) => prev + item.salePrice * item.amount,
    0
  );
  const deliveryPrice = 0;
  const [selectedCourier, setSelectedCourier] = useState("");

  const {
    state: { data: settingsData },
  } = useCommonContext();


  const { mutate: addressByName, data } = useApiMutation(
    `address/by-name`,
    "post",
    {
      onSuccess() {
        setShowOptions(true);
      },
      onError(error) {
        console.error("Error fetching address:", error);
      },
    }
  );

  useEffect(() => {
    if (typeof address === "string" && address.trim()) {
      addressByName({ name: address });
    }
  }, [address]);



  const { mutate, status } = useApiMutation("order/create", "post", {
    onSuccess() {
      navigate("/order");
    },
  });
  const { mutate: addressByPointName } = useApiMutation(
    `address/by-point`,
    "post",
    {
      onSuccess({ data }) {
        if (formStore) {
          formStore?.setValue("addressName", data?.name);
          formStore?.setValue("addressLocation", coordinate);
          formStore?.setError("addressName", {});
        } else {
          setValue("addressName", data?.name);
          setValue("addressLocation", coordinate);
          setError("addressName", {});
        }
      },
      onError(error) {
        console.error("Error fetching address:", error);
      },
    }
  );

  useEffect(() => {
    if (coordinate?.latitude && coordinate?.longitude) {
      addressByPointName({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    } else {
      console.error("Coordinates are missing");
    }
  }, [addressByPointName, coordinate])

  // Trigger the mutation
  // const handleFetchAddress = () => {

  // };



  // const { data: storeData, status: storeStatus } = useApi(
  //   "store/get",
  //   {},
  //   {
  //     suspense: false,
  //   }
  // );


  const submit = (data: any) => {
    const addressLocation = watch("addressLocation");
    if (!addressLocation || !addressLocation.latitude || !addressLocation.longitude) {
      toast.error("Manzil noto'g'ri kiritilgan yoki xaritada topilmadi!");
      return;
    }
    if (!basketItems.length) {
      return toast.warning(t("order.chooseProduct"));
    }

    const notValidItem = basketItems.find((e) => !(e.amount > 0));
    if (notValidItem) {
      return toast.warning(t("order.validAmount"));
    }

    const minimumOrderPrice = get(settingsData, "orderMinimumPrice", 0);

    if (allProductPrice < minimumOrderPrice) {
      return toast.warning(`${t("order.minimum_order_amount")} ${numberFormat(minimumOrderPrice)} ${get(settingsData, "currency", "uzs")}`);
    }

    const requestData = {
      ...data,
      deliveryDate: dayjs(data.deliveryDate).format(),
      items: basketItems.map((e) => ({
        productId: e._id,
        amount: e.amount,
      })),
      addressLocation: {
        latitude: coordinate?.latitude,
        longitude: coordinate?.longitude,
      }
    };

    mutate(requestData);
  };


  const { data: orderData } = useApi<any>(
    `order/get-by-id/${id}`,
    {},
    {
      enabled: !!id,
    }
  );

  const courierId = orderData?.data?.courierId


  const { mutate: setCourier, data: setCourierData, status: setCourierStatus, isLoading: isSettingCourier } = useApiMutation<any>(
    "order/set-courier",
    "post",
    {
      onSuccess(data) {
        setSelectedCourier(data.data.courierId);
      },
      onError(error) {
        console.error("API Error:", error);
      },
    }
  );

  const { mutate: deliveryMutate, data: deliveryData, status: deliveryStatus, isLoading: deliveryLoading } = useApiMutation<any>(
    "delivery",
    "post",
    {
      onSuccess(data) {
        // setSelectedCourier(data.data.courierId);
      },
      onError(error) {
        console.error("API Error:", error);
      },
    }
  );

  const DeliveryOnChange = () => {
    const phoneNumber = formStore?.getValues("phoneNumber") || getValues("phoneNumber");
    deliveryMutate({
      paymentType: "cash",
      addressLocation: {
        latitude: coordinate?.latitude,
        longitude: coordinate?.longitude,
      },
      items: basketItems.map((e) => ({
        productId: e._id,
        amount: e.amount,
      })),
      phoneNumber: phoneNumber
    });
  }


  useEffect(() => {
    if (basketItems.length > 0) {
      DeliveryOnChange();
    }
  }, [basketItems, formStore, coordinate]);

  return (
    <AddOrderFormStyled>
      {!id && <h3 className="mb-3">{t("order.formalization")}</h3>}
      <form onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <div onClick={() => setOpen(true)}>
              <TextInput
                control={formStore ? formStore.control : control}
                name="addressName"
                label={t("order.deliveryAddress")}
                placeholder="Yetkazib berish manzili"
                searchIcon
                onCustomChange={(value) => {
                  setAddress(value);
                }}
                disabled={order?.state?.state === "completed" ? true : false}
              />
              <div className="address-options">
                {showOptions &&
                  // @ts-ignore
                  data?.data?.map((item: any) => (
                    <div
                      className="option"
                      onClick={() => {
                        setValue("addressName", item.name);
                        setValue("addressLocation", {
                          latitude: item.latitude,
                          longitude: item.longitude,
                          name: item.name,
                        });
                        setCoordinate({
                          latitude: item.latitude,
                          longitude: item.longitude,
                          name: item.name,
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
          <Grid item md={6}>
            <TextInput
              control={formStore ? formStore?.control : control}
              name="houseNumber"
              placeholder="Uy raqami"
              rules={{ required: false }}
              label={"Uy raqami"}
              disabled={order?.state?.state === "completed" ? true : false}
            />
          </Grid>
          <Grid item md={6}>
            <TextInput
              control={formStore ? formStore?.control : control}
              name="entrance"
              placeholder="Kirish"
              rules={{ required: false }}
              label={"Kirish"}
              disabled={order?.state?.state === "completed" ? true : false}
            />
          </Grid>
          <Grid item md={6}>
            <TextInput
              control={formStore ? formStore?.control : control}
              name="floor"
              placeholder="Qavat"
              rules={{ required: false }}
              label={"Qavat"}
              disabled={order?.state?.state === "completed" ? true : false}
            />
          </Grid>
          <Grid item md={6}>
            <TextInput
              control={formStore ? formStore?.control : control}
              name="apartmentNumber"
              placeholder="Kvartira raqami"
              rules={{ required: false }}
              label={"Kvartira raqami"}
              disabled={order?.state?.state === "completed" ? true : false}
            />
          </Grid>
          <Grid item sm={12}>
            <TextInput
              control={formStore ? formStore?.control : control}
              name="receiverFirstName"
              label={t("order.receiver")}
              disabled={order?.state?.state === "completed" ? true : false}
            />
          </Grid>
          <Grid item sm={12}>
            <PhoneInput
              control={formStore ? formStore?.control : control}
              name="phoneNumber"
              label={t("common.phoneNumber")}
              disabled={order?.state?.state === "completed" ? true : false}
              onChange={DeliveryOnChange}
            />
          </Grid>
          <Grid item sm={12}>
            <DatePickerTime
              label={t("common.date")}
              control={formStore ? formStore?.control : control}
              name="deliveryDate"
              minDate={dayjs(new Date())}
              defaultValue={dayjs(new Date())}
              disabled={order?.state?.state === "completed" ? true : false}
            />
          </Grid>
          <Grid item sm={12}>
            <SelectForm
              control={formStore ? formStore?.control : control}
              name="paymentType"
              options={PAYMENT_TYPES}
              label={t("common.paymentType")}
              disabled={order?.state?.state === "completed" ? true : false}
              onChange={DeliveryOnChange}
            />
          </Grid>
          {id &&
            <Grid item sm={12}>
              <SelectPost
                control={formStore ? formStore?.control : control}
                name="setCourier"
                label={t("common.courier")}
                optionsUrl="courier/paging"
                value={selectedCourier}
                defaultValue={courierId}
                onChange={(selectedValue) => {
                  setSelectedCourier(selectedValue);
                  setCourier({ courierId: selectedValue, _id: id });
                }}
                rules={{ required: false }}
                disabled={order?.state?.state === "completed" ? true : false}
              />
            </Grid>
          }

          <Grid item sm={12}>
            <label className="custom-label">{t("common.description")}</label>

            <TextareaAutosize
              minRows={3} // boshlang'ich satrlar soni
              value={formStore?.watch("comment")}
              onChange={(event) => {
                const value = event.target.value;
                formStore
                  ? formStore?.setValue("comment", value)
                  : setValue("comment", value);
              }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem',
              }}
            />

          </Grid>
        </Grid>
        {!id && (
          <div className="info">
            <div className="item">
              <span className="key">{t("order.allProducts")}:</span>
              <span className="value">
                {numberFormat(deliveryData?.data?.itemPrice || 0)}{" "}
                {get(settingsData, "currency", "uzs")}
              </span>
            </div>
            <div className="item">
              <span className="key">{t("settings.discounts")}:</span>
              <span className="value">
                {numberFormat(deliveryData?.data?.discount || 0)}{" "}
                {get(settingsData, "currency", "uzs")}
              </span>
            </div>
            <div className="item">
              <span className="key">{t("order.deliveryPrice")}:</span>
              <span className="value">
                {numberFormat(deliveryData?.data?.deliveryPrice || 0)}{" "}
                {get(settingsData, "currency", "uzs")}
              </span>
            </div>
            <div className="item">
              <span className="key">{t("order.totalPrice")}:</span>
              <span className="value">
                {numberFormat(deliveryData?.data?.totalPrice || 0)}{" "}
                {get(settingsData, "currency", "uzs")}
              </span>
            </div>
          </div>
        )}
        {!id && (
          <MainButton
            variant="contained"
            title={"Rasmiylashtirish"}
            className="submit-btn"
            type="submit"
            disabled={status === "loading"}
          />
        )}
      </form>
      <Modal setOpen={setOpen} open={open}>
        <AddressModalStyled>
          <Grid container height={"100%"}>
            <Grid item md={6}>
              <div className="modal-form">
                <div className="title">
                  <span onClick={() => setOpen(false)}>
                    <LeftArrowIcon />
                  </span>
                  <h2>Yangi manzil qo'shish</h2>
                </div>
                <Grid container spacing={2}>
                  <Grid item md={12} position="relative">
                    <TextInput
                      control={formStore ? formStore.control : control}
                      name="addressName"
                      placeholder="Yetkazib berish manzili"
                      searchIcon
                      onCustomChange={(value) => {
                        setAddress(value);
                      }}
                    />
                    <div className="address-options">
                      {showOptions &&
                        // @ts-ignore
                        data?.data?.map((item: any) => (
                          <div
                            className="option"
                            onClick={() => {
                              setValue("addressName", item.name);
                              setValue("addressLocation", {
                                latitude: item.latitude,
                                longitude: item.longitude,
                                name: item.name,
                              });
                              setCoordinate({
                                latitude: item.latitude,
                                longitude: item.longitude,
                                name: item.name,
                              });
                              setShowOptions(false);
                            }}
                          >
                            {item.name}
                          </div>
                        ))}
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      control={formStore ? formStore?.control : control}
                      name="houseNumber"
                      placeholder="Uy raqami"
                      rules={{ required: false }}
                      label={"Uy raqami"}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      control={formStore ? formStore?.control : control}
                      name="entrance"
                      placeholder="Kirish"
                      rules={{ required: false }}
                      label={"Kirish"}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      control={formStore ? formStore?.control : control}
                      name="floor"
                      placeholder="Qavat"
                      rules={{ required: false }}
                      label={"Qavat"}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      control={formStore ? formStore?.control : control}
                      name="apartmentNumber"
                      placeholder="Kvartira raqami"
                      label={"Kvartira raqami"}
                      rules={{ required: false }}
                    />
                  </Grid>
                </Grid>
                <MainButton
                  title="Saqlash"
                  variant="contained"
                  color="success"
                  className="save-btn"
                  onClick={() => {
                    const addressLocation = watch("addressLocation");
                    if (!addressLocation || !addressLocation.latitude || !addressLocation.longitude) {
                      toast.error("Manzil noto'g'ri kiritilgan yoki xaritada topilmadi!");
                      return;
                    }
                    setOpen(false);
                  }}
                />
              </div>
            </Grid>
            <Grid item md={6}>
              <div className="map">
                <YandexMapForOrder
                  getCoordinate={setCoordinate}
                  center={watch("addressLocation")}
                />
                {/* <YMaps >
                  <Map
                    width="100%"
                    height="500px"
                    defaultState={{
                      center: coordinate?.latitude && coordinate?.longitude
                        ? [coordinate.latitude, coordinate.longitude]
                        : storeData?.data?.addressLocation?.latitude && storeData?.data?.addressLocation?.longitude
                        ? [storeData.data.addressLocation.latitude, storeData.data.addressLocation.longitude]
                        : [55.751244, 37.618423], // Default to Moscow if all else fails
                      zoom: 13,
                      behaviors: ["default", "scrollZoom"],
                    }}
                    onClick={(event: any) =>
                      setCoordinate({
                        latitude: event.get("coords")[0],
                        longitude: event.get("coords")[1],
                      })
                    }
                    modules={["geoObject.addon.editor"]}
                  >
                    <Placemark
                      geometry={[coordinate?.latitude, coordinate?.longitude]}
                    />
                    <FullscreenControl />
                    <GeolocationControl options={{ float: "left" }} />
                    <TypeSelector options={{ float: "right" }} />
                    <ZoomControl options={{ float: "right" }} />
                  </Map>
                </YMaps> */}
              </div>
            </Grid>
          </Grid>
        </AddressModalStyled>
      </Modal>
    </AddOrderFormStyled>
  );
};

export default AddOrderForm;
