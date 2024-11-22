import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  AutoCompleteForm,
  ImageInput,
  MainButton,
  PhoneInput,
  TextInput,
} from "components";
import { UseFormReturn } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";
import { IIdImage } from "hooks/usePostImage";
import { DeleteIcon } from "assets/svgs";
import { useAppDispatch } from "store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";

interface ICourierForm {
  formStore: UseFormReturn<any>;
  editingCourierId?: any;
  resetForm: () => void;
  productProps: {
    courierImages: IIdImage[];
    setCourierImages: Dispatch<SetStateAction<IIdImage[]>>;
    mainImageId: any;
    setMainImageId: any;
  };
}
const CourierFrom: FC<ICourierForm> = ({
  formStore,
  editingCourierId,
  resetForm,
  productProps,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, watch, setValue } = formStore;
  const [checkData, setCheckData] = useState<any>();
  const { courierImages, setCourierImages, mainImageId, setMainImageId } =
    productProps;
  const dis = useAppDispatch();

  const { } = useApi(
    `employee/check?phoneNumber=${watch("phoneNumber")}`,
    {},
    {
      enabled: watch("phoneNumber")?.length > 12 && !editingCourierId,
      suspense: false,
      onSuccess({ data }) {
        setCheckData(data);
      },
    }
  );

  const { mutate, status } = useApiMutation(
    editingCourierId ? `courier/update` : "courier/create",
    editingCourierId ? "post" : "post"
  );

  // const { mutate: GetByIdDataMutate, data: getByIdData, status: getByIdStatus } = useApiMutation(
  //   `courier/get-by-id/${editingCourierId}`,
  //   "post",
  //   {
  //     onSuccess: () => {
  //       dis(setOpenDrawer(true));
  //     },
  //     onError: () => {
  //       dis(setOpenDrawer(false));
  //     },
  //   }
  // );

  // useEffect(() => {
  //   if (editingCourierId) {
  //     GetByIdDataMutate({ _id: editingCourierId });
  //   } else {
  //     dis(setOpenDrawer(false));
  //   }
  // }, [editingCourierId, GetByIdDataMutate]);




  const { data: getByIdData, status: getByIdStatus } = useApi(`courier/get-by-id/${editingCourierId}`, {}, {
    enabled: !!editingCourierId,
    suspense: false
  })

  useEffect(() => {
    if (status === "success") {
      resetForm();
    }
  }, [status]);

  const submit = (data: any) => {
    mutate({
      ...data,
      imageId: courierImages.map((image) => image._id),
      mainImageId: courierImages.length
        ? mainImageId || courierImages?.[0]?._id
        : null,
      _id: editingCourierId,
    });
  };

  useEffect(() => {
    if (getByIdStatus === 'success') {
      reset({
        ...getByIdData.data,
      });
      setCourierImages(getByIdData.data?.images || []);
      const foundMain = getByIdData.data?.images?.find(
        (img: any) => img?._id === getByIdData.data.mainImage?._id
      );
      if (foundMain && !!getByIdData.data?.images?.length) {
        setMainImageId(getByIdData.data.mainImage?._id);
      } else setMainImageId(getByIdData.data?.images?.[0]?._id);
    }
  }, [getByIdData, getByIdStatus]);

  useEffect(() => {
    const foundMain = courierImages.find((main) => main._id === mainImageId);
    if (foundMain) {
      setMainImageId(foundMain._id);
    } else if (courierImages.length) {
      setMainImageId(courierImages[0]._id);
    }
  }, [courierImages]);

  return (
    <div className="custom-drawer">
      <form id="courier" onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <PhoneInput
              control={control}
              name="phoneNumber"
              label={t("common.phoneNumber")}
            />
            {checkData?._id && !editingCourierId && (
              <div className="d-flex justify-content-between">
                <span className="text-error mt-2">
                  {t("common.alreadyExistEmployee")}
                </span>
                <MainButton
                  title={t("general.add")}
                  onClick={() => {
                    reset({
                      ...checkData,
                      _id: undefined,
                    });
                    setCheckData(null);
                  }}
                />
              </div>
            )}
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="firstName"
              label={t("common.firstName")}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="lastName"
              label={t("common.lastName")}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="password"
              label={t("common.password")}
              type="password"
              rules={{ required: false }}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="carBrand"
              label={t("COURIER.carBrand")}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="carModel"
              label={t("COURIER.carModel")}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="carNumber"
              label={t("COURIER.carNumber")}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="carColor"
              label={t("COURIER.carColor")}
            />
          </Grid>
          <Grid item md={12}>
            <div className="product-images">
              <ImageInput
                control={control}
                setValue={setValue}
                name="image"
                rules={{ required: false }}
                multiple
                getImage={(img) => setCourierImages((prev) => [...prev, img])}
                accept=".png, .jpg, .jpeg"
              />
              {courierImages?.map((image: any) => (
                <div className="product-image" key={image._id}>
                  <img
                    src={process.env.REACT_APP_BASE_URL + image.url}
                    alt="product"
                  />
                  <div className="on-hover">
                    <span
                      className="delete"
                      onClick={() =>
                        setCourierImages((prev) =>
                          prev.filter((prevImg) => prevImg._id !== image._id)
                        )
                      }
                    >
                      <DeleteIcon />
                    </span>
                    <span
                      className={`main-image ${image._id === mainImageId && "active"
                        }`}
                      onClick={() => setCourierImages(image._id)}
                    ></span>
                  </div>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CourierFrom;
