import { ExportButton, RangeDatePicker, Table } from "components";
import { useCustomerColumns } from "./customer.columns";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";

const Client = () => {
  const navigate = useNavigate();
  const columns = useCustomerColumns();


  const renderHeader = (
    <Grid width={230} spacing={2} display={"flex"} justifyContent={"space-between"}>
      <Grid style={{ display: "flex", justifyContent: "end" }}>
        <RangeDatePicker />
      </Grid>
    </Grid>
  );

  return (
    <>
      <Table
        columns={columns}
        dataUrl="customer/paging"
        searchable
        headerChildren={renderHeader}
        exQueryParams={{
          stateId: undefined,
        }}
        onRowClick={(row) => navigate(`/customer/${row._id}`)}
      />
    </>
  );
};

export default Client;
