import {Route, Routes } from "react-router-dom";
import CustomerAnalytics from "./container/CustomerAnalytics";

const index = () => {
  return (
    <Routes>
      <Route path="*" element={<CustomerAnalytics/>} />
    </Routes>
  );
};

export default index;
