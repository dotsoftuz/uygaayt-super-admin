import { AutoCompleteFilter, Checkbox, ExportButton, FormDrawer, Table } from "components";
import { useProductColumns } from "./product.columns";
import { useRoleManager } from "services/useRoleManager";
import { useAppDispatch } from "store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ProductForm from "../components/ProductForm";
import { IIdImage } from "hooks/usePostImage";
import WarningModal from "components/common/WarningModal/WarningModal";

const Client = () => {
  const columns = useProductColumns();
  const hasAccess = useRoleManager();
  const dis = useAppDispatch();
  const { t } = useTranslation();
  const formStore = useForm();
  const [editingProductId, setEditingProductId] = useState<any>();
  const [productId, setProductId] = useState("");
  const [productImages, setProductImages] = useState<IIdImage[]>([]);
  const [mainImageId, setMainImageId] = useState<any>();

  const exportUrl = `/exams-table/export/`;

  const renderHeader = (
    <Grid container width={600} spacing={2}>
      <Grid item sm={3} style={{paddingTop: "20px"}}>
        <ExportButton url={exportUrl} />
      </Grid>
      <Grid item sm={4}>
        <AutoCompleteFilter
          optionsUrl="category/paging"
          filterName="categoryId"
          placeholder={t("common.category")}
        />
      </Grid>
      <Grid item sm={4}>
        <Checkbox
          control={formStore.control}
          label={t("enum.active")}
          name="isActiveQuery"
        />
      </Grid>
    </Grid>
  );

  const resetForm = () => {
    setEditingProductId(null);
    setProductImages([]);
    setMainImageId(null);
    formStore.reset({
      name: "",
      price: "",
      salePrice: "",
      inStock: "",
      discountValue: undefined,
      discountType: undefined,
      discountStartAt: undefined,
      discountEndAt: undefined,
      imageUrl: "",
      isActive: false,
      discountEnabled: false,
      isActiveQuery: formStore.watch("isActiveQuery"),
      measureId: "",
      categoryId: "",
    });
  };

  return (
    <>
      <Table
        columns={columns}
        dataUrl="product/paging"
        searchable
        headerChildren={renderHeader}
        onAddButton={hasAccess("productCreate") ? () => dis(setOpenDrawer(true)) : undefined}
        onEditColumn={
          hasAccess("productUpdate")
            ? (row) => {
              setEditingProductId(row._id);
              dis(setOpenDrawer(true));
            }
            : undefined
        }
        onDeleteColumn={
          hasAccess("productDelete")
            ? (row) => setProductId(row._id)
            : undefined
        }
        exQueryParams={{
          isActive: formStore.watch("isActiveQuery") || undefined,
        }}
      />
      <WarningModal open={productId} setOpen={setProductId} url="product/delete" />
      <FormDrawer
        FORM_ID="product"
        isEditing={!!editingProductId}
        customTitle={t("general.addProduct")}
        onClose={resetForm}
      >
        <ProductForm
          formStore={formStore}
          resetForm={resetForm}
          editingProductId={editingProductId}
          productProps={{
            productImages,
            setProductImages,
            mainImageId,
            setMainImageId,
          }}
        />
      </FormDrawer>
    </>
  );
};

export default Client;
