import { FormDrawer, Table } from "components";
import { useState } from "react";
import { useCourierColumns } from "./courier.columns";
import { useAppDispatch } from "../../../store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import EmployeeFrom from "../components/CourierForm";
import { useTranslation } from "react-i18next";
import { useRoleManager } from "services/useRoleManager";
import WarningModal from "components/common/WarningModal/WarningModal";

const Employee = () => {
  const [editingCourierId, setEditingCourierId] = useState<any>();
  const [courierId, setCourierId] = useState<any>();
  const columns = useCourierColumns();
  const hasAccess = useRoleManager();
  const { t } = useTranslation();
  const dis = useAppDispatch();
  const formStore = useForm<any>();

  const resetForm = () => {
    setEditingCourierId(undefined);
    formStore.reset({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      roleId: "",
    });
  };

  return (
    <>
      <Table
        dataUrl="employee/pagin"
        columns={columns}
        searchable
        onAddButton={hasAccess('employeeCreate') ? () => dis(setOpenDrawer(true)) : undefined}
        onEditColumn={hasAccess('employeeUpdate') ? (row) => {
          setEditingCourierId(row._id);
          dis(setOpenDrawer(true));
        } : undefined}
        onDeleteColumn={hasAccess('employeeDelete') ? (row) => setCourierId(row._id) : undefined}
      />
      <WarningModal open={courierId} setOpen={setCourierId} url="courier" />
      <FormDrawer
        FORM_ID="courier"
        isEditing={!!editingCourierId}
        customTitle={t("general.addCourier")}
        onClose={resetForm}
      >
        <EmployeeFrom
          formStore={formStore}
          resetForm={resetForm}
          editingCourierId={editingCourierId}
        />
      </FormDrawer>
    </>
  );
};

export default Employee;
