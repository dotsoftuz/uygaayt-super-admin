import { ExportButton, Table } from "components";
import { useConstructorColumns } from "./constructor_analytics.columns";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { Grid } from "@mui/material";

const ConstructorAnalytics = () => {
  const columns = useConstructorColumns();
  const allParams = useAllQueryParams();

  const exportUrl = `/report/constructor/export/${allParams.dateFrom ? `dateFrom=${allParams.dateFrom}&` : ""
    }${allParams?.dateTo ? `dateTo=${allParams.dateTo}&` : ""}`;

  const renderHeader = (
    <Grid className="w-full flex justify-end items-center pb-2">
      <Grid>
        <ExportButton url={exportUrl} />
      </Grid>
    </Grid>
  );

  return (
    <>
      <Table
        dataUrl="report/constructor"
        columns={columns}
        headerChildren={renderHeader}
        exQueryParams={{}}
      />
    </>
  );
};

export default ConstructorAnalytics;

