import { Navigate, Route, Routes } from "react-router-dom";
import OrderTable from "./container/orderTable/OrderTable";
import OrderBoard from "./container/orderBoard/OrderBoard";
import AddOrder from "./container/addOrder/container/AddOrder";
import OrderDetails from "./container/orderDetails/container/OrderDetails";

const index = () => {
  return (
    <Routes>
      <Route path="table" element={<OrderTable />} />
      <Route path="board" element={<OrderBoard />} />
      <Route path="add" element={<AddOrder />} />
      <Route path=":id" element={<OrderDetails />} />
      <Route path="*" element={<Navigate to="/order/table" replace />} />
    </Routes>
  );
};

export default index;
