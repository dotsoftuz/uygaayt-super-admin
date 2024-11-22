import { Table } from "components";
import { useCustomerColumns } from "./customer.columns";

const Client = () => {
  const columns = useCustomerColumns();

  return (
    <>
      <Table columns={columns} dataUrl="customer/paging" searchable exQueryParams={{
          stateId: undefined,
        }} />
    </>
  );
};

export default Client;
