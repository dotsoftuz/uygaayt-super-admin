import {
  AutoCompleteFilter,
  ExportButton,
  RangeDatePicker,
  Table,
} from "components";
import { useProductColumns } from "./product_analytics.columns";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import WarningModal from "components/common/WarningModal/WarningModal";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";

interface FormValues {
  isActiveQuery?: boolean;
  // categoryId ni bu yerda qo'shish shart emas, chunki u URL dan olinadi
}

const ProductAnalytics: React.FC = () => {
  const columns = useProductColumns();
  const { t } = useTranslation();
  const formStore: UseFormReturn<FormValues> = useForm<FormValues>();
  const [productId, setProductId] = useState<string>("");
  const allParams = useAllQueryParams();
  const exportUrl: string = "/report/product/export";

  const renderHeader = (
    <Grid className="w-full lg:w-[60%] md:flex md:grid-cols-3 gap-3 justify-end items-center py-2">
      <Grid className="md:w-[30%] py-1">
        <AutoCompleteFilter
          optionsUrl="category/paging"
          filterName="categoryId"
          placeholder={t("common.category")}
        />
      </Grid>
      <Grid className="md:w-[40%] py-1 flex justify-end">
        <RangeDatePicker />
      </Grid>
      <Grid className="md:w-[30%] py-1">
        <ExportButton url={exportUrl} />
      </Grid>
    </Grid>
  );

  return (
    <>
      <Table
        columns={columns}
        dataUrl="report/product"
        headerChildren={renderHeader}
        exQueryParams={{
          // isActiveQuery hech qachon set qilinmayapti, shuning uchun bu doim undefined
          // Agar isActive filter kerak bo'lsa, uni formga qo'shish kerak
          isActive: formStore.watch("isActiveQuery") || undefined,
          categoryId: allParams.categoryId || undefined, // ✅ Bu to'g'ri ishlaydi
        }}
      />
      <WarningModal
        open={Boolean(productId)}
        setOpen={setProductId}
        url="product/delete"
      />
    </>
  );
};

export default ProductAnalytics;
