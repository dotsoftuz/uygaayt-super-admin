import { Box } from "@mui/material";
import { Navbar, Sidebar } from "components";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

import { RootState } from "store/store";
import { useAppSelector } from "store/storeHooks";
import {
  PrivateContainer,
  SIDEBAR_CLOSE,
  SIDEBAR_OPEN,
} from "styles/global.style";

const hasNavbar = (pathname: string) =>
  !["purchase/create", "contract/templates", "purchase/", "contract/view"].some(
    (path) => pathname.includes(path)
  );
const scrollPages = (pathname: string) =>
  [
    "order",
    "contract",
    "queue",
    "purchase",
    "income",
    "warehouse/products",
    "stock-car",
  ].some((path) => pathname.includes(path));

const Layout = () => {
  const location = useLocation();

  const { value } = useAppSelector((state: RootState) => state.sideBarData);

  const isAuth = useAppSelector((store) => store.LoginState.isAuth);

  return isAuth ? (
    <>
      {hasNavbar(location.pathname) ? <Navbar hasNavbar={true} /> : null}
      <Sidebar />

      <motion.div
        animate={{
          paddingLeft: value ? SIDEBAR_OPEN : SIDEBAR_CLOSE,
        }}
        style={{ minHeight: "100vh" }}
        className="home-container"
      >
        <PrivateContainer
          style={{
            paddingTop: hasNavbar(location.pathname) ? "65px" : "0",
            height: "100vh",
            overflow: "auto",
            boxSizing: "border-box",
          }}
        >
          <Box
            height={
              hasNavbar(location.pathname) ? "calc(100vh - 65px)" : "100vh"
            }
            paddingX="20px"
            paddingY="10px"
            sx={{
              overflowY: scrollPages(location.pathname) ? "scroll" : "auto",
              background: "#F3F3F8",
            }}
          >
            <Outlet />
          </Box>
        </PrivateContainer>
      </motion.div>
    </>
  ) : null;
};

export default Layout;
