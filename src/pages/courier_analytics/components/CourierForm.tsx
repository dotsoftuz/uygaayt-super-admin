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

  // const { } = useApi(
  //   `employee/check?phoneNumber=${watch("phoneNumber")}`,
  //   {},
  //   {
  //     enabled: watch("phoneNumber")?.length > 12 && !editingCourierId,
  //     suspense: false,
  //     onSuccess({ data }) {
  //       setCheckData(data);
  //     },
  //   }
  // );

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
      imageId: data.imageId?._id,
      _id: editingCourierId,
      carBrand: data.carBrand || "",
      carModel: data.carModel || "",
      carNumber: data.carNumber || "",
      carColor: data.carColor || ""
    });
  };

  useEffect(() => {
    if (getByIdStatus === 'success') {
      reset({
        ...getByIdData.data,
        imageId: getByIdData.data.image,
      });
    }
  }, [getByIdData, getByIdStatus]);

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
              rules={{ required: false }}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="carModel"
              label={t("COURIER.carModel")}
              rules={{ required: false }}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="carNumber"
              label={t("COURIER.carNumber")}
              rules={{ required: false }}
            />
          </Grid>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="carColor"
              label={t("COURIER.carColor")}
              rules={{ required: false }}
            />
          </Grid>
          <Grid item md={12}>
            <div className="product-images">
              <ImageInput control={control} setValue={setValue} name="imageId" />
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CourierFrom;
