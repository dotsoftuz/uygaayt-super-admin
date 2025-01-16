import { AutoCompleteFilter, Checkbox, ExportButton, FormDrawer, RangeDatePicker, Table } from "components";
import { useProductColumns } from "./product_analytics.columns";
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
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";

const Client = () => {
  const allParams = useAllQueryParams();
  const columns = useProductColumns();
  const hasAccess = useRoleManager();
  const dis = useAppDispatch();
  const { t } = useTranslation();
  const formStore = useForm();
  const [editingProductId, setEditingProductId] = useState<any>();
  const [productId, setProductId] = useState("");
  const [productImages, setProductImages] = useState<IIdImage[]>([]);
  const [mainImageId, setMainImageId] = useState<any>();

  const exportUrl = `/report/product/export`;

  const renderHeader = (
    <Grid className="w-full lg:w-[60%] md:flex md:grid-cols-3 gap-3 justify-end items-center py-2" >
      <Grid className="md:w-[30%] py-1" >
        <AutoCompleteFilter
          optionsUrl="category/paging"
          filterName="categoryId"
          placeholder={t("common.category")}
        />
      </Grid>
      <Grid className="md:w-[40%] py-1 flex justify-end" >
        <RangeDatePicker />
      </Grid>
      <Grid className="md:w-[30%] py-1" >
        <ExportButton url={exportUrl} />
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
        dataUrl="report/product"
        headerChildren={renderHeader}
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
