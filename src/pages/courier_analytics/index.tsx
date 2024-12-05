import {Route, Routes } from "react-router-dom";
import Courier from "./container/CourierAnalytics";

const index = () => {
  return (
    <Routes>
      <Route path="*" element={<Courier/>} />
    </Routes>
  );
};

export default index;
