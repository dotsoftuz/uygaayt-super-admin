import { AutoCompleteFilter, ExportButton, RangeDatePicker, Table } from "components";
import { useCustomerColumns } from "./customer_analytics.columns";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useTranslation } from "react-i18next";

const Client = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const columns = useCustomerColumns();
  const allParams = useAllQueryParams();

  const exportUrl = `/report/customer/export/`;


  const renderHeader = (
    <Grid className="w-full lg:w-[60%] md:flex md:grid-cols-3 gap-3 justify-end items-center py-2">
      <Grid className="md:w-[30%] py-1" >
        <AutoCompleteFilter
          optionsUrl="customer/paging"
          filterName="customer_id"
          placeholder={t("common.customer")}
          getOptionLabel={(option) => option?.firstName}
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


  return (
    <>
      <Table
        columns={columns}
        dataUrl="report/customer"
        headerChildren={renderHeader}
        // searchable
        exQueryParams={{}}
        onRowClick={(row) => navigate(`/customer/${row._id}`)}
      />
    </>
  );
};

export default Client;
