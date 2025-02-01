import { ExportButton, Table } from "components";
import { useCourierColumns } from "./courier_analytics.columns";
import { useNavigate } from "react-router-dom";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { Grid } from "@mui/material";

const CourierAnalytics = () => {
  const columns = useCourierColumns();
  const navigate = useNavigate();
  const allParams = useAllQueryParams();

  const exportUrl = `/report/courier/export/${allParams.dateFrom ? `dateFrom=${allParams.dateFrom}&` : ""
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
        dataUrl="report/courier"
        columns={columns}
        headerChildren={renderHeader}
        onRowClick={(row) => navigate(`/courier/${row._id}`)}
        exQueryParams={{}}
      />
    </>
  );
};

export default CourierAnalytics;
