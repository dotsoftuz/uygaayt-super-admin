import { FC, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  AutoCompleteForm,
  MainButton,
  PhoneInput,
  TextInput,
} from "components";
import { UseFormReturn } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";

interface IEmployeesForm {
  formStore: UseFormReturn<any>;
  editingCourierId?: any;
  resetForm: () => void;
}
const CourierFrom: FC<IEmployeesForm> = ({
  formStore,
  editingCourierId,
  resetForm,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, watch } = formStore;
  const [checkData, setCheckData] = useState<any>();

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
    editingCourierId ? `employee/${editingCourierId}` : "employee",
    editingCourierId ? "put" : "post"
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(`employee/${editingCourierId}`, {}, {
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
      _id: editingCourierId,
      ...data,
    });
  };

  useEffect(() => {
    if (getByIdStatus === 'success') {
      reset({
        ...getByIdData.data,
        roleId: getByIdData.data.role?._id,
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
          {/* <Grid item md={12}>
            <AutoCompleteForm
              name="roleId"
              control={control}
              optionsUrl="role/pagin"
              dataProp="data.data"
              label={t("common.role")}
            />
          </Grid> */}
        </Grid>
      </form>
    </div>
  );
};

export default CourierFrom;
