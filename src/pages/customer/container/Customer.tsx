import { Table } from "components";
import { useCustomerColumns } from "./customer.columns";

const Client = () => {
  const columns = useCustomerColumns();

  return (
    <>
      <Table columns={columns} dataUrl="customer/paging" searchable />
    </>
  );
};

export default Client;
