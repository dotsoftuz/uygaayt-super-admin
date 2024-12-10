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

  const exportUrl = `/report/product/export/${allParams.dateFrom ? `dateFrom=${allParams.dateFrom}&` : ""
  }${allParams?.dateTo ? `dateTo=${allParams.dateTo}&` : ""}`;

  const renderHeader = (
    <Grid width={480} spacing={2} display={"flex"} justifyContent={"space-between"}>
      <Grid  style={{display: "flex", justifyContent: "end"}}>
        <RangeDatePicker />
      </Grid>
      <Grid  style={{display: "flex", justifyContent: "end"}}>
      <AutoCompleteFilter
          optionsUrl="category/paging"
          filterName="categoryId"
          placeholder={t("common.category")}
        />
      </Grid>
      <Grid  style={{display: "flex", justifyContent: "end", alignItems: "center"}}>
        <ExportButton url={exportUrl} />
      </Grid>
    </Grid>
    // <Grid container width={800} spacing={2}>
    //   <Grid item sm={4} style={{paddingTop: "20px"}}>
    //     <ExportButton url={exportUrl} />
    //   </Grid>
    //   <Grid item sm={4}>
    //     <AutoCompleteFilter
    //       optionsUrl="category/paging"
    //       filterName="categoryId"
    //       placeholder={t("common.category")}
    //     />
    //   </Grid>
    //   <Grid item sm={4} >
    //     <RangeDatePicker />
    //   </Grid>
    // </Grid>
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
