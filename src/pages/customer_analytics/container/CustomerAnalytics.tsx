import { ExportButton, RangeDatePicker, Table } from "components";
import { useCustomerColumns } from "./customer_analytics.columns";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";

const Client = () => {
  const navigate = useNavigate();
  const columns = useCustomerColumns();

  const exportUrl = `/exams-table/export/`;


  const renderHeader = (
    <Grid width={350} spacing={2} display={"flex"} justifyContent={"space-between"}>
      <Grid  style={{display: "flex", justifyContent: "end"}}>
        <RangeDatePicker />
      </Grid>
      <Grid  style={{display: "flex", justifyContent: "end", alignItems: "center"}}>
        <ExportButton url={exportUrl} />
      </Grid>
    </Grid>
  );


  return (
    <>
      <Table
        columns={columns}
        dataUrl="customer/paging"
        headerChildren={renderHeader}
        searchable
        exQueryParams={{
          stateId: undefined,
        }}
        onRowClick={(row) => navigate(`/customer/${row._id}`)}
      />
    </>
  );
};

export default Client;
