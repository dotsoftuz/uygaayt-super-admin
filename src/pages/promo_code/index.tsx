import { Route, Routes, Navigate } from "react-router-dom";
import PromoCode from "./container/PromoCode";
import PromoCodeDetail from "./details/PromoCodeDetail";

const index = () => {
  return (
    <Routes>
      <Route path=":id" element={<PromoCodeDetail />} />
      <Route path="*" element={<PromoCode />} />
    </Routes>
  );
};

export default index;
