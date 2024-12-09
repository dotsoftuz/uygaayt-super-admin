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

  const exportUrl = `/report/customer/export/${allParams.dateFrom ? `dateFrom=${allParams.dateFrom}&` : ""
    }${allParams?.dateTo ? `dateTo=${allParams.dateTo}&` : ""}`;


  const renderHeader = (
    <Grid width={480} spacing={2} display={"flex"} justifyContent={"space-between"}>
      <Grid md={6} style={{display: "flex", justifyContent: "end"}}>
        <AutoCompleteFilter
          optionsUrl="customer/paging"
          filterName="customer_id"
          placeholder={t("common.category")}
          getOptionLabel={(option) => option?.firstName }
        />
      </Grid>
      <Grid style={{ display: "flex", justifyContent: "end" }}>
        <RangeDatePicker />
      </Grid>
      <Grid style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
        <ExportButton url={exportUrl} />
      </Grid>

    </Grid>
  );


  console.log(allParams)

  return (
    <>
      <Table
        columns={columns}
        dataUrl="report/customer"
        headerChildren={renderHeader}
        // searchable
        exQueryParams={{

        }}
        onRowClick={(row) => navigate(`/customer/${row._id}`)}
      />
    </>
  );
};

export default Client;
