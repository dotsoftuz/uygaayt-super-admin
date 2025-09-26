import { ExportButton, RangeDatePicker, Table } from "components";
import { useCustomerColumns } from "./customer.columns";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";

const Client = () => {
  const navigate = useNavigate();
  const columns = useCustomerColumns();

  const exportUrl: string = "/customer/export";

  const renderHeader = (
    <Grid className="lg:w-[80%] w-full flex justify-end gap-2 items-center pb-2">
      <Grid >
        <RangeDatePicker />
      </Grid>
      <Grid item>
        <ExportButton url={exportUrl} />
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
