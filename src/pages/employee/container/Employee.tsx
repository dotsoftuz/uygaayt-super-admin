import { FormDrawer, Table } from "components";
import { useState } from "react";
import { useEmployeeColumns } from "./employee.columns";
import { useAppDispatch } from "../../../store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import EmployeeFrom from "../components/EmployeeForm";
import { useTranslation } from "react-i18next";
import { useRoleManager } from "services/useRoleManager";
import WarningModal from "components/common/WarningModal/WarningModal";

const Employee = () => {
  const [editingEmployeeId, setEditingEmployeeId] = useState<any>();
  const [employeeId, setEmployeeId] = useState<any>();
  const columns = useEmployeeColumns();
  const hasAccess = useRoleManager();
  const { t } = useTranslation();
  const dis = useAppDispatch();
  const formStore = useForm<any>();

  const resetForm = () => {
    setEditingEmployeeId(undefined);
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
        dataUrl="employee/paging"
        columns={columns}
        searchable
        onAddButton={hasAccess('employeeCreate') ? () => dis(setOpenDrawer(true)) : undefined}
        onEditColumn={hasAccess('employeeUpdate') ? (row) => {
          setEditingEmployeeId(row._id);
          dis(setOpenDrawer(true));
        } : undefined}
        onDeleteColumn={hasAccess('employeeDelete') ? (row) => setEmployeeId(row._id) : undefined}
      />
      <WarningModal open={employeeId} setOpen={setEmployeeId} url="employee/delete" />
      <FormDrawer
        FORM_ID="employee"
        isEditing={!!editingEmployeeId}
        customTitle={t("general.addEmployee")}
        onClose={resetForm}
      >
        <EmployeeFrom
          formStore={formStore}
          resetForm={resetForm}
          editingEmployeeId={editingEmployeeId}
        />
      </FormDrawer>
    </>
  );
};

export default Employee;
