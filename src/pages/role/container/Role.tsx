import { FormDrawer, Table } from "components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "store/storeHooks";
import RoleForm from "../components/RoleForm";
import { ALL_ROLES } from "../components/RoleForm.constants";
import { useRoleColumns } from "./roles.columns";
import { useTranslation } from "react-i18next";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import WarningModal from "components/common/WarningModal/WarningModal";
import { useRoleManager } from "services/useRoleManager";

const Roles = () => {
  const formStore = useForm();
  const columns = useRoleColumns();
  const [editingRoleId, setEditingRoleId] = useState<any>();
  const dis = useAppDispatch();
  const { t } = useTranslation();
  const [roleId, setRoleId] = useState<any>();
  const hasAccess = useRoleManager()

  const resetForm = () => {
    setEditingRoleId(null);

    formStore.reset({
      name: "",
      _select_all: false,
    });
    ALL_ROLES.forEach((role) => {
      formStore.setValue(role.role, false);
      role?.childRoles?.forEach((child: any) =>
        formStore.setValue(child.role, false)
      );
    });
  };

  return (
    <div>
      <Table
        columns={columns}
        dataUrl="role/paging"
        onAddButton={hasAccess('roleCreate') ? () => dis(setOpenDrawer(true)) : undefined}
        onEditColumn={hasAccess('roleUpdate') ? (row) => {
          setEditingRoleId(row._id);
          dis(setOpenDrawer(true));
        } : undefined}
        onDeleteColumn={hasAccess('roleDelete') ? (row) => setRoleId(row._id) : undefined}
        searchable
      />
      <WarningModal open={roleId} setOpen={setRoleId} url="role/delete" />
      <FormDrawer
        onClose={resetForm}
        customTitle={t("general.addRole")}
        FORM_ID="role"
        isEditing={!!editingRoleId}
      >
        <RoleForm
          formStore={formStore}
          editingRoleId={editingRoleId}
          resetForm={resetForm}
        />
      </FormDrawer>
    </div>
  );
};

export default Roles;
