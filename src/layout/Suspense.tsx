import { Loading } from "components";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const SuspenseSite = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  );
};

export default SuspenseSite;
