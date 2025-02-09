import { DragTable, FormDrawer, Table } from "components";
import { useCategoryCol } from "./category.columns";
import { useAppDispatch } from "store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CategoryForm from "../components/CategoryForm";
import { useForm } from "react-hook-form";
import WarningModal from "components/common/WarningModal/WarningModal";
import { useRoleManager } from "services/useRoleManager";

const Category = () => {
  const [render, setRender] = useState<boolean>(false);
  // const columns = useCategoryColumns();
  const [editingCategoryId, setEditingCategoryId] = useState<any>();
  const [categoryId, setCategoryId] = useState<any>();
  const columnsDrag = useCategoryCol({ setEditingCategoryId, setCategoryId });
  const dis = useAppDispatch();
  const { t } = useTranslation();
  const formStore = useForm<any>();
  const hasAccess = useRoleManager();

  const resetForm = () => {
    setEditingCategoryId(undefined);
    formStore.reset({
      name: { uz: "", ru: "", en: "" },
      imageId: "",
    });
  };

  return (
    <>
      {/* <Table
        columns={columns}
        dataUrl="category/product"
        searchable
        onAddButton={() => dis(setOpenDrawer(true))}
        onEditColumn={(row) => {
          setEditingCategoryId(row._id);
          dis(setOpenDrawer(true));
        }}
        onDeleteColumn={(row) => setCategoryId(row._id)}
      /> */}

      <DragTable
        columns={columnsDrag}
        dataUrl="/category/paging"
        dragUrl="/category/positions"
        dragKey="categoryIds"
        render={render}
        setRender={setRender}
        onAddButton={hasAccess("categoryCreate") ? () => dis(setOpenDrawer(true)) : undefined}
      />
      <WarningModal
        open={categoryId}
        setOpen={setCategoryId}
        setRender={setRender}
        url="category/delete"
      />
      <FormDrawer
        FORM_ID="category"
        isEditing={!!editingCategoryId}
        customTitle={t("general.addCategory")}
        onClose={resetForm}
      >
        <CategoryForm
          formStore={formStore}
          setRender={setRender}
          resetForm={resetForm}
          editingCategoryId={editingCategoryId}
        />
      </FormDrawer>
    </>
  );
};

export default Category;
