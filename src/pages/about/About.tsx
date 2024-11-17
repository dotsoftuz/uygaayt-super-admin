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
    `address/by-name?name=${address}`,
    "get",
    {
      onSuccess() {
        setShowOptions(true);
      },
    }
  );

  const { mutate } = useApiMutation("store", "put");

  const {} = useApi(`address/by-point`, addressLocation, {
    enabled: !!addressLocation,
    suspense: false,
    onSuccess({ data }) {
      setValue("addressName", data?.name);
    },
  });

  useEffect(() => {
    if (debouncedValue) {
      addressByName("");
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (status === "success") {
      const about = data?.data;
      reset({
        ...about,
        imageId: about.image,
        startTime:
          about.workTime?.length === 11 ? about.workTime?.slice(0, 5) : "",
        endTime: about.workTime?.length === 11 ? about.workTime?.slice(-5) : "",
        addressLocation: about.addressLocation,
      });
    }
  }, [status, data]);

  const submit = (data: any) => {
    const requestData = {
      name: data.name,
      imageId: data.imageId._id,
      description: data.description,
      workTime: data.startTime
        ? `${data.startTime}-${data.endTime}`
        : undefined,
      phoneNumber: data.phoneNumber,
      addressName: data.addressName,
      addressLocation,
    };
    mutate(requestData);
  };

  return (
    <AboutStyled>
      <form onSubmit={handleSubmit(submit)}>
        <Grid container spacing={3}>
          <Grid item md={6}>
            <div className="d-flex gap-4">
              <ImageInput
                control={control}
                setValue={setValue}
                name="imageId"
                rules={{ required: false }}
                className="mb-3"
                accept=".png, .jpg, .jpeg"
              />
              <div className="d-flex gap-2 flex-column">
                <span>Dokon to'lov ID</span>
                <span className="d-flex gap-5 align-items-center">
                  {get(data, "data.number", "")}{" "}
                  <IconButton
                    className="copyBtn"
                    onClick={() => {
                      copy(get(data, "data.number", ""));
                    }}
                  >
                    <CopyIcon />
                  </IconButton>
                </span>
              </div>
            </div>
            <div className="mb-3">
              <TextInput
                control={control}
                name="name"
                label={t("common.companyName")}
              />
            </div>
            <div className="mb-3 working-time">
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
          <Grid item md={6}>
            <div className="save-btn">
              <MainButton
                title={t("general.save")}
                variant="contained"
                type="submit"
              />
            </div>
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
