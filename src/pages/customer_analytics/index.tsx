import {Route, Routes } from "react-router-dom";
import CustomerAnalytics from "./container/CustomerAnalytics";
import CustomerAnalyticsInfo from "./info/CustomerInfo";

const index = () => {
  return (
    <Routes>
      <Route path=":id" element={<CustomerAnalyticsInfo />} />
      <Route path="*" element={<CustomerAnalytics/>} />
    </Routes>
  );
};

export default index;
