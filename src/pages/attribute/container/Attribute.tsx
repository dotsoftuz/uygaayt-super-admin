import { FormDrawer, Table } from "components";
import { useState } from "react";
import { useAttributeColumns } from "./attribute.columns";
import { useAppDispatch } from "../../../store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import AttributeForm from "../components/AttributeForm";
import { useTranslation } from "react-i18next";
import { useRoleManager } from "services/useRoleManager";
import WarningModal from "components/common/WarningModal/WarningModal";

const Attribute = () => {
  const [editingAttributeId, setEditingAttributeId] = useState<any>();
  const [attributeId, setAttributeId] = useState<any>();
  const columns = useAttributeColumns();
  const hasAccess = useRoleManager();
  const { t } = useTranslation();
  const dis = useAppDispatch();
  const formStore = useForm<any>();

  const resetForm = () => {
    setEditingAttributeId(undefined);
    formStore.reset({
      name: { uz: "", ru: "", en: "" },
    });
  };

  return (
    <>
      <Table
        dataUrl="attribute/paging"
        columns={columns}
        searchable
        onAddButton={() => {
          dis(setOpenDrawer(true));
        }}
        onEditColumn={(row) => {
          setEditingAttributeId(row._id);
          dis(setOpenDrawer(true));
        }}
        onDeleteColumn={(row) => setAttributeId(row._id)}
        exQueryParams={{}}
      />
      <WarningModal open={attributeId} setOpen={setAttributeId} url="attribute/delete" />
      <FormDrawer
        FORM_ID="attribute"
        isEditing={!!editingAttributeId}
        customTitle={t("attribute.add")}
        onClose={resetForm}
      >
        <AttributeForm
          formStore={formStore}
          resetForm={resetForm}
          editingAttributeId={editingAttributeId}
        />
      </FormDrawer>
    </>
  );
};

export default Attribute;
