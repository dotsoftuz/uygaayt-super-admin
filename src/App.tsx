import useClearQueryParams from "hooks/useClearQueryParams";
import AuthUser from "layout/AuthUser/AuthUser";
import Layout from "layout/Layout";
import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import privateRoutes from "routes/PrivateRoutes";
import { GlobalStyle } from "styles/global.style";
import "./styles/common.css";
import "./styles/config.css";
import "./styles/index.css";

import SuspenseSite from "layout/Suspense";
import Login from "pages/login";
import { useRoleManager } from "services/useRoleManager";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useAppSelector } from "store/storeHooks";
import "dayjs/locale/ru";
import Store from "pages/store/Store";

const App: React.FC = () => {
  useClearQueryParams();
  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem("token");
  const { isAuth } = useAppSelector((store) => store.LoginState);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isAuth && !hasToken) {
      navigate("/login");
    }
  }, [isAuth]);

  useEffect(() => {
    if (pathname === "/login" && hasToken) {
      navigate("/");
    }
  }, [pathname]);

  const hasAccess = useRoleManager();

  return (
    <>
      <div className="toast">
        <ToastContainer position="top-center" autoClose={1500} />
      </div>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/store" element={<Store />} />

        <Route path="/" element={<AuthUser />}>
          <Route path="/" element={<SuspenseSite />}>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<SuspenseSite />}>
                {privateRoutes.map((route) => {
                  if (route.role && hasAccess(route.role))
                    return (
                      <Route
                        element={route.element}
                        path={route.path}
                        key={route.path}
                      />
                    );
                  else return null;
                })}
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
