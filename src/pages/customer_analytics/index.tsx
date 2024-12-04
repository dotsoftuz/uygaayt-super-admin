import {Route, Routes } from "react-router-dom";
import Customer from "./container/CustomerAnalytics";
import CustomerInfo from "./info/CustomerInfo";

const index = () => {
  return (
    <Routes>
      <Route path=":id" element={<CustomerInfo />} />
      <Route path="*" element={<Customer/>} />
    </Routes>
  );
};

export default index;
