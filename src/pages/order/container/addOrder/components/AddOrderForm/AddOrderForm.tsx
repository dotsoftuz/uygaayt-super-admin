import { useForm } from "react-hook-form";
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
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { LeftArrowIcon } from "assets/svgs";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useDebounce from "hooks/useDebounce";
import { PAYMENT_TYPES } from "types/enums";
import { IProduct } from "types/common.types";
import { useNavigate, useParams } from "react-router-dom";
import { numberFormat } from "utils/numberFormat";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import useCommonContext from "context/useCommon";
import { get } from "lodash";
import YandexMap from "components/common/YandexMap/YandexMap";

const AddOrderForm = ({
  basketItems,
  formStore,
}: {
  basketItems: IProduct[];
  formStore?: any;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [open, setOpen] = useState(false);
  const [coordinate, setCoordinate] = useState<any>();
  const [address, setAddress] = useState("");
  const { t } = useTranslation();
  const { control, setValue, handleSubmit, watch, setError } = useForm();
  const { debouncedValue } = useDebounce(address, 1000);
  const navigate = useNavigate();
  const { id } = useParams();
  const allProductPrice = basketItems.reduce(
    (prev, item) => prev + item.salePrice * item.amount,
    0
  );
  const deliveryPrice = 0;

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


  console.log(addressByPointName)

  const { data: storeData, status: storeStatus } = useApi(
    "store/get",
    {},
    {
      suspense: false,
    }
  );


  const submit = (data: any) => {
    if (!basketItems.length) {
      return toast.warning(t("order.chooseProduct"));
    }
    const notValidItem = basketItems.find((e) => !(e.amount > 0));
    if (notValidItem) {
      return toast.warning(t("order.validAmount"));
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

  return (
    <AddOrderFormStyled>
      {!id && <h3 className="mb-3">{t("order.formalization")}</h3>}
      <form onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <div onClick={() => setOpen(true)}>
              {/* <TextInput
                control={formStore ? formStore?.control : control}
                name="addressName"
                label={t("order.deliveryAddress")}
                searchIcon
              /> */}
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
              rules={{ required: false }}
              label={"Kvartira raqami"}
            />
          </Grid>
          <Grid item sm={12}>
            <TextInput
              control={formStore ? formStore?.control : control}
              name="receiverFirstName"
              label={t("order.receiver")}
              rules={{ required: false }}
            />
          </Grid>
          <Grid item sm={12}>
            <PhoneInput
              control={formStore ? formStore?.control : control}
              name="phoneNumber"
              label={t("common.phoneNumber")}
            />
          </Grid>
          <Grid item sm={12}>
            <DatePickerTime
              control={formStore ? formStore?.control : control}
              name="deliveryDate"
              minDate={dayjs(new Date())}
              label={t("common.date")}
            />
          </Grid>
          <Grid item sm={12}>
            <SelectForm
              control={formStore ? formStore?.control : control}
              name="paymentType"
              options={PAYMENT_TYPES}
              label={t("common.paymentType")}
            />
          </Grid>
          <Grid item sm={12}>
            <label className="custom-label">{t("common.description")}</label>
            <TextEditor
              value={formStore?.watch("comment")}
              onChange={(value) => {
                formStore
                  ? formStore?.setValue("comment", value)
                  : setValue("comment", value);
              }}
            />
          </Grid>
        </Grid>
        {!id && (
          <div className="info">
            <div className="item">
              <span className="key">{t("order.allProducts")}:</span>
              <span className="value">
                {numberFormat(allProductPrice)}{" "}
                {get(settingsData, "currency", "uzs")}
              </span>
            </div>
            <div className="item">
              <span className="key">{t("order.deliveryPrice")}:</span>
              <span className="value">
                {numberFormat(deliveryPrice)}{" "}
                {get(settingsData, "currency", "uzs")}
              </span>
            </div>
            <div className="item">
              <span className="key">{t("order.totalPrice")}:</span>
              <span className="value">
                {numberFormat(allProductPrice + deliveryPrice)}{" "}
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
                  onClick={() => setOpen(false)}
                />
              </div>
            </Grid>
            <Grid item md={6}>
              <div className="map">
              <YandexMap
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
