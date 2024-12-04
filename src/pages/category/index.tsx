import {Route, Routes } from "react-router-dom";
import Category from "./container/Category";
import CategoryChild from "./info/CategoryChild";

const index = () => {
  return (
    <Routes>
      <Route path=":id" element={<CategoryChild />} />
      <Route path="*" element={<Category/>} />
    </Routes>
  );
};

export default index;
