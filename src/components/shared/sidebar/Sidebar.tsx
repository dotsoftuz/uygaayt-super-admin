import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IconButton, ListItemIcon, ListItemText } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import Tooltip from "@mui/material/Tooltip";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "store/storeHooks";
import { SIDEBAR_CLOSE, SIDEBAR_OPEN } from "styles/global.style";
import { hasChildPaths } from "utils";
import Ellips from "./assets/Ellips";
import LogoFirst from "./assets/logofirst.svg";
import UnicalLogo from "./assets/unicalLogo.svg";
import { sidebarRoutes } from "./routes/sidebarRoutes";
import { HoveredItems, SidebarContainer } from "./Sidebar.style";
import { ISidebarRoute } from "./sidebar.types";
import { useRoleManager } from "services/useRoleManager";
import { useTranslation } from "react-i18next";
import { CopyIcon, SidebarArrowIcon } from "assets/svgs";
import { useApi } from "hooks/useApi/useApiHooks";
import { numberFormat } from "utils/numberFormat";
import useCommonContext from "context/useCommon";
import { get } from "lodash";
import useCopyToClipboard from "hooks/useClipboard";

const Sidebar = () => {
  const { value } = useAppSelector((state) => state.sideBarData);
  const url = window.location.href;
  const isUnical = url.includes("unical-dev-bestune.kahero.uz");
  const navigate = useNavigate();
  const [copiedText, copy] = useCopyToClipboard();
  //  ? Animation hide
  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      width: "auto",
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };
  const hasAccess = useRoleManager();
  const {
    state: { data: settingsData },
  } = useCommonContext();

  const storeId = localStorage.getItem("storeId");
  const stores = JSON.parse(localStorage.getItem("stores") || "[]");
  const currentStore = stores.find((store: any) => store?._id === storeId);

  const { data } = useApi(
    "store/get",
    {},
    {
      suspense: false,
    }
  );

  return (
    <SidebarContainer value={value}>
      <div
        style={{ width: value ? SIDEBAR_OPEN : SIDEBAR_CLOSE }}
        className="sidebar-content"
      >
        <div className={value ? "sidebar-top" : "sidebar-top active"}>
          <div
            className={value ? "sidebar-top-item" : "sidebar-top-item active"}
          >
            {value ? (
              <Tooltip title="">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="store_name d-flex flex-column text-center gap-2">
                    <span>{get(currentStore, "name", "")}</span>
                  </h2>
                </motion.div>
              </Tooltip>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isUnical ? (
                  <img
                    src={UnicalLogo}
                    alt="logo"
                    onClick={() => navigate("home")}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <img
                    src={LogoFirst}
                    alt="logo"
                    className="logoFirst"
                    onClick={() => navigate("home")}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </motion.div>
            )}
            {/* <img
              src={ArrowIcon}
              alt="arrow"
              onClick={() =>
                dispatch(value ? closeSideBarFunc() : openSideBarFunc())
              }
              className={value ? "sidebar_arrow " : "sidebar_arrow active"}
            /> */}
          </div>
          {value && (
            <motion.div
              className="sidebar-top-item"
              variants={showAnimation}
              initial="hidden"
              animate="show"
              exit="hidden"
            ></motion.div>
          )}
        </div>

        <div className="sidebar-main">
          <div className="asosiy">
            {sidebarRoutes.map((item, key) => {
              if (hasAccess(item.role)) {
                return <MenuItemCustom key={key} item={item} />;
              }
            })}
          </div>
        </div>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;

const MenuItemCustom = ({ item }: { item: ISidebarRoute }) =>
  hasChildPaths(item) ? (
    <MultiLevel item={item} />
  ) : (
    <SingleLevel item={item} />
  );

const SingleLevel = ({ item }: { item: ISidebarRoute }) => {
  const { t } = useTranslation();
  const { value } = useAppSelector((state) => state.sideBarData);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hasAccess = useRoleManager();

  return (
    <div
      className={`sidebar-item ${
        pathname.includes(item.path || "") ? "sideBar-active" : ""
      }`}
      onClick={() => item?.path && navigate(item?.path)}
    >
      {value ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* <ListItemIcon>{item.icon}</ListItemIcon> */}
        </motion.div>
      ) : (
        <Tooltip
          title={!value && t("sidebar." + item?.translate)}
          placement="right"
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: "#2A3042",
                cursor: "pointer",
                fontSize: "16px",
                padding: "10px 15px",
                "& .MuiTooltip-arrow": {
                  color: "#2A3042",
                },
              },
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ListItemIcon className="iconActive">{item.icon}</ListItemIcon>
          </motion.div>
        </Tooltip>
      )}
      {value ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <ListItemText primary={t("sidebar." + item.translate)} />
          {pathname.includes(item.path || "") && (
            <ListItemIcon>
              <SidebarArrowIcon />
            </ListItemIcon>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ListItemText
            primary={t("sidebar." + item.translate)}
            className="hoveredText"
          />
        </motion.div>
      )}
    </div>
  );
};

const MultiLevelHover = ({ item }: { item: ISidebarRoute }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <HoveredItems>
      <div className="hovered_title">
        <span>{item?.icon}</span> {t("sidebar." + item?.translate)}
      </div>

      {item.items?.map((cur) => (
        <ul>
          <li
            className={`sidebar-item-hovered ${
              pathname.includes(cur?.path || "") ? "sideBarHovered-active" : ""
            }`}
            onClick={() => cur?.path && navigate(cur?.path)}
            style={{
              cursor: "pointer",
              fontSize: "12px",
              color: "#ffffff",
              padding: "11px 16px",
            }}
          >
            <Ellips /> {t("sidebar." + cur.translate)}
          </li>
        </ul>
      ))}
    </HoveredItems>
  );
};

const MultiLevel = ({ item }: { item: ISidebarRoute }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { value } = useAppSelector((state) => state.sideBarData);
  const hasAccess = useRoleManager();

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <div className="sidebar-item-parent" onClick={handleClick}>
        <div className="boxsOfChild">
          {value ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* <ListItemIcon>{item.icon}</ListItemIcon> */}
            </motion.div>
          ) : (
            <Tooltip
              title={<MultiLevelHover item={item} />}
              placement="right"
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#2A3042",
                    fontSize: "16px",
                    "& .MuiTooltip-arrow": {
                      color: "#2A3042",
                    },
                  },
                },
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ListItemIcon className="iconActive">{item.icon}</ListItemIcon>
              </motion.div>
            </Tooltip>
          )}
          {value ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ListItemText
                primary={t("sidebar." + item.translate)}
                className="boxOfTexts"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ListItemText
                primary={t("sidebar." + item.translate)}
                className="boxOfTexts"
              />
            </motion.div>
          )}
        </div>
        {open ? (
          <ExpandLessIcon className="upAndDownIcon" style={{color: "white"}} />
        ) : (
          <ExpandMoreIcon className="upAndDownIcon" style={{color: "white"}} />
        )}
      </div>

      {value && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item?.items?.map((child, key) => {
              if (hasAccess(child.role)) {
                return <MenuItemCustom key={key} item={child} />;
              } else return null;
            })}
          </List>
        </Collapse>
      )}
    </>
  );
};
