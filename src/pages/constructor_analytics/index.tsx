import {Route, Routes } from "react-router-dom";
import ConstructorAnalytics from "./container/ConstructorAnalytics";

const index = () => {
  return (
    <Routes>
      <Route path="*" element={<ConstructorAnalytics/>} />
    </Routes>
  );
};

export default index;

