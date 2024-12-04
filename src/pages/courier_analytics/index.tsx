import {Route, Routes } from "react-router-dom";
import Courier from "./container/CourierAnalytics";
import CourierInfo from "./info/CourierInfo";

const index = () => {
  return (
    <Routes>
      <Route path=":id" element={<CourierInfo />} />
      <Route path="*" element={<Courier/>} />
    </Routes>
  );
};

export default index;
