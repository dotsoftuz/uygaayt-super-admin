import { Loading } from "components";
import { useApi } from "hooks/useApi/useApiHooks";
import { Suspense, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useRoleManager } from "services/useRoleManager";
import { socket } from "socket";

import {
  ILoginData,
  setLoginData,
  setRoleData,
} from "store/reducers/LoginSlice";
import { useAppDispatch, useAppSelector } from "store/storeHooks";

const AuthUser = () => {
  const dis = useAppDispatch();
  const hasToken = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const { isLoading, isFetching } = useApi<ILoginData | any>(
    "profile/get",
    {},
    {
      enabled: hasToken,
      cacheTime: 0,
      staleTime: Infinity,
      onSuccess(data) {
        dis(setLoginData(data.data));
        localStorage.setItem("employeeId", data.data._id);
        // localStorage.setItem("stores", JSON.stringify(data.data.stores));
        // localStorage.setItem("storeId", data.data.stores?.[0]?._id);

        if (!localStorage.getItem("i18nextLng")) {
          localStorage.setItem("i18nextLng", "uz");
        }
        navigate("/home");
      },
    }
  );
  const { isLoading: roleIsLoading, isFetching: roleIsFetching } =
    useApi<ILoginData>(
      `/role/get-by-id/${localStorage.getItem("roleId")}`,
      {},
      {
        enabled: hasToken,
        cacheTime: 0,
        staleTime: Infinity,
        onSuccess(data) {
          dis(setRoleData(data.data));
        },
      }
    );

  if (isLoading || isFetching || roleIsLoading || roleIsFetching) {
    return <Loading />;
  }

  return <Outlet />;
};

export default AuthUser;
