import { Grid, IconButton } from "@mui/material";
import { AboutStyled } from "./About.styled";
import { ImageInput, MainButton, PhoneInput, TextInput } from "components";
import { useForm } from "react-hook-form";
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
        startTime:
          about.workTime?.length === 11 ? about.workTime?.slice(0, 5) : "",
        endTime: about.workTime?.length === 11 ? about.workTime?.slice(-5) : "",
        addressLocation: about.addressLocation,
        deliveryPrice: about.deliveryPrice,
        itemPrepTimeFrom: about.itemPrepTimeFrom,
        itemPrepTimeTo: about.itemPrepTimeTo
      });
    }
  }, [status, data]);

  const submit = (data: any) => {
    const requestData = {
      name: data.name,
      description: data.description,
      workTime: data.startTime
        ? `${data.startTime}-${data.endTime}`
        : undefined,
      phoneNumber: data.phoneNumber,
      addressName: data.addressName,
      addressLocation,
      deliveryPrice: +data.deliveryPrice,
      itemPrepTimeFrom: data.itemPrepTimeFrom,
      itemPrepTimeTo: data.itemPrepTimeTo
    };
    mutate(requestData);
  };

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
              />
            </div>
            <div className="mb-3 sm:flex md:gap-0 gap-y-2 justify-between items-end working-time">
              <TimePicker
                control={control}
                name="startTime"
                errors={formState.errors}
                label={t("common.workTime")!}
                rules={{ required: true }}
              />
              <TimePicker
                control={control}
                name="endTime"
                errors={formState.errors}
                rules={{ required: true }}
              />
            </div>

            <div className="mb-3 sm:flex md:gap-0 gap-y-2 justify-between items-end working-time">
              <TextInput
                control={control}
                name="itemPrepTimeFrom"
                type="number"
                label={t("settings.delivery_time")!}
              // rules={{ required: false }}
              />
              <TextInput
                control={control}
                name="itemPrepTimeTo"
                type="number"
              // rules={{ required: false }}
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
            <div className="mb-3">
              <PhoneInput
                control={control}
                name="phoneNumber"
                label={t("common.phoneNumber")}
                rules={{ required: false }}
              />
            </div>
            <div className="mb-3">
              <label className="custom-label">{t("common.description")}</label>
              <TextEditor
                value={watch("description")}
                onChange={(value) => setValue("description", value)}
              />
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
