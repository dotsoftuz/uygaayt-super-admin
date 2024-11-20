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
  editingEmployeeId?: any;
  resetForm: () => void;
}
const EmployeeFrom: FC<IEmployeesForm> = ({
  formStore,
  editingEmployeeId,
  resetForm,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, watch } = formStore;
  const [checkData, setCheckData] = useState<any>();

  const { } = useApi(
    `employee/check?phoneNumber=${watch("phoneNumber")}`,
    {},
    {
      enabled: watch("phoneNumber")?.length > 12 && !editingEmployeeId,
      suspense: false,
      onSuccess({ data }) {
        setCheckData(data);
      },
    }
  );

  const { mutate, status } = useApiMutation(
    editingEmployeeId ? `employee/update/${editingEmployeeId}` : "employee/create",
    editingEmployeeId ? "put" : "post"
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(`employee/get-by-id/${editingEmployeeId}`, {}, {
    enabled: !!editingEmployeeId,
    suspense: false
  })

  useEffect(() => {
    if (status === "success") {
      resetForm();
    }
  }, [status]);

  const submit = (data: any) => {
    mutate({
      _id: editingEmployeeId,
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
      <form id="employee" onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <PhoneInput
              control={control}
              name="phoneNumber"
              label={t("common.phoneNumber")}
            />
            {checkData?._id && !editingEmployeeId && (
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
            <AutoCompleteForm
              name="roleId"
              control={control}
              optionsUrl="role/paging"
              dataProp="data.data"
              label={t("common.role")}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default EmployeeFrom;
