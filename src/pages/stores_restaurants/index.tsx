import { Route, Routes } from "react-router-dom";
import StoresRestaurants from "./StoresRestaurants";
import StoreInfo from "./info/StoreInfo";

const index = () => {
  return (
    <Routes>
      <Route path=":id" element={<StoreInfo />} />
      <Route path="*" element={<StoresRestaurants />} />
    </Routes>
  );
};

export default index;

