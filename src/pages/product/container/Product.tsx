import { AutoCompleteFilter, AutoCompleteForm, Checkbox, ExportButton, FormDrawer, Table } from "components";
import { useProductColumns } from "./product.columns";
import { useRoleManager } from "services/useRoleManager";
import { useAppDispatch } from "store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useTranslation } from "react-i18next";
import { Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ProductForm from "../components/ProductForm";
import { IIdImage } from "hooks/usePostImage";
import WarningModal from "components/common/WarningModal/WarningModal";

const Product = () => {
  const columns = useProductColumns();
  const hasAccess = useRoleManager();
  const dis = useAppDispatch();
  const { t } = useTranslation();
  const formStore = useForm();
  const [editingProductId, setEditingProductId] = useState<any>();
  const [productId, setProductId] = useState("");
  const [productImages, setProductImages] = useState<IIdImage[]>([]);
  const [mainImageId, setMainImageId] = useState<any>();
  const [subCategory, setSubCategory] = useState<any>();

  const queryParams = useMemo(() => ({
    isActive: formStore.watch("isActiveQuery") || undefined,
    stockState: formStore.watch("stockState") || undefined,
  }), [formStore.watch("isActiveQuery"), formStore.watch("stockState")]);


  const renderHeader = (
    <Grid className="lg:w-[60%] w-full gap-y-2 sm:gap-y-0 grid sm:grid-cols-4 items-center gap-x-2">
      <Grid item>
        <Checkbox
          control={formStore.control}
          label={t("enum.active")}
          name="isActiveQuery"
        />
      </Grid>
      <Grid item>
        <Select
          style={{
            width: "100%",
            paddingBlock: "4px",
            borderRadius: "10px",
          }}
          size="small"
          labelId="stockState-label"
          id="stockState"
          value={formStore.watch("stockState") || ""}
          onChange={(e) => formStore.setValue("stockState", e.target.value)}
          displayEmpty
        >
          {formStore.watch("stockState") && (
            <MenuItem value="">Tozalash</MenuItem>
          )}
          {!formStore.watch("stockState") && (
            <MenuItem value="" hidden disabled>
              Omborni holati
            </MenuItem>
          )}
          <MenuItem value="yellowLine">Sariq chiziq</MenuItem>
          <MenuItem value="redLine">Qizil chiziq</MenuItem>

        </Select>

      </Grid>
      <Grid item>
        <AutoCompleteFilter
          optionsUrl="category/paging"
          filterName="categoryId"
          placeholder={t("common.category")}
          onChange={(item: any) => {
            setSubCategory(item);
          }}
        />
      </Grid>
      <Grid item>
        {
          subCategory && <AutoCompleteFilter
            optionsUrl="category/paging"
            filterName="categoryId"
            placeholder={t("common.category")}
            onChange={() => setSubCategory((prev: any) => prev)}
            exQueryParams={{
              parentId: subCategory._id
            }}
          />
        }
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
      stockState: formStore.watch("stockState"),
      measureId: "",
      categoryId: "",
      description: "",
      attributes: null,
      compounds: null
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
        exQueryParams={queryParams}
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

export default Product;
