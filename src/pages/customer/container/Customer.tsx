import { Table } from "components";
import { useCustomerColumns } from "./customer.columns";

const Client = () => {
  const columns = useCustomerColumns();

  return (
    <>
      <Table columns={columns} dataUrl="customer/pagin" searchable />
    </>
  );
};

export default Client;
