import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IconButton, ListItemIcon, ListItemText } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import { Popover } from "antd";
import { SidebarHideShow } from "assets/svgs";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useRoleManager } from "services/useRoleManager";
import { closeSideBarFunc, openSideBarFunc } from "store/reducers/SidebarSlice";
import { useAppDispatch, useAppSelector } from "store/storeHooks";
import { SIDEBAR_CLOSE, SIDEBAR_OPEN } from "styles/global.style";
import { hasChildPaths } from "utils";
import { HoveredItems, SidebarContainer } from "./Sidebar.style";
import Ellips from "./assets/Ellips";
import { sidebarRoutes } from "./routes/sidebarRoutes";
import { ISidebarRoute } from "./sidebar.types";
import { useTheme } from "styled-components";

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { value } = useAppSelector((state) => state.sideBarData);
  const dispatch = useAppDispatch();

  const { t } = useTranslation();
  // const { firstName, lastName, type } = useAppSelector(
  //   (state) => state.LoginState.loginData
  // );

  const hasAccess = useRoleManager();

  return (
    <SidebarContainer value={value}>
      <div
        style={{ width: value ? SIDEBAR_OPEN : SIDEBAR_CLOSE }}
        className="sidebar-content"
      >
        <div className={value ? "sidebar-top" : "sidebar-top active"}>
          {/* <div
            className={value ? "sidebar-top-item" : "sidebar-top-item active"}
          >
            {value ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="school_head" onClick={() => setOpen(true)}>
                  <p className="d-flex flex-column">
                      UYGAAYT
                  </p>
                </div>
              </motion.div>
            ) : (
              <div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="school_head-active">
                  </div>
                </motion.div>
              </div>
            )}

          </div> */}
          <IconButton
            className={value ? "sidebar_arrow " : "sidebar_arrow active"}
            onClick={() =>
              dispatch(value ? closeSideBarFunc() : openSideBarFunc())
            }
          >
            <SidebarHideShow />
          </IconButton>
        </div>

        <div className="sidebar-main">
          <div className="asosiy">
            {sidebarRoutes.map((item, key) => {
                  if (hasAccess(item.role)) {
                    return <MenuItemCustom key={key} item={item} />;
                  }
                })
             }
          </div>
        </div>

        <div className="sidebar_footer"></div>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;

const MenuItemCustom = ({
  item,
  data,
}: {
  item: ISidebarRoute;
  data?: string;
}) =>
  hasChildPaths(item) ? (
    <MultiLevel item={item} />
  ) : (
    <SingleLevel data={data} item={item} />
  );

const SingleLevel = ({
  item,
  data,
}: {
  item: ISidebarRoute;
  data?: string;
}) => {
  const { t } = useTranslation();
  const { value } = useAppSelector((state) => state.sideBarData);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hasAccess = useRoleManager();
  const theme = useTheme();

  return (
    <div
      className={`sidebar-item relative ${
        pathname.includes(item.path || "") ? "sideBar-active" : ""
      }`}
      onClick={() => {
        item?.path && item?.path !== pathname && navigate(item?.path);
      }}
    >
      {value ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <ListItemIcon className="sidebar_icon">{item.icon}</ListItemIcon>
        </motion.div>
      ) : (
        <Popover
          placement="right"
          content={
            !value && (
              <HoveredItems>
                <ul>
                  <li>{t("sidebar." + item?.translate)}</li>
                </ul>
              </HoveredItems>
            )
          }
          overlayInnerStyle={{
            // @ts-ignore
            backgroundColor: `${theme?.sidebar?.main}`,
            // @ts-ignore
            boxShadow: `${theme?.boxShadow?.main}`,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ListItemIcon className="iconActive icon">{item.icon}</ListItemIcon>
          </motion.div>
        </Popover>
      )}
      {value ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <ListItemText primary={t("sidebar." + item.translate)} />
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
      {!!data && (
        <div className="rounded-full bg-red-500 text-white h-5 min-w-5 flex items-center justify-center text-[12px] absolute right-5 aspect-square p-1">
          {data}
        </div>
      )}
    </div>
  );
};

const MultiLevelHover = ({ item }: { item: ISidebarRoute }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const hasAccess = useRoleManager();

  return (
    <HoveredItems>
      <div className="hovered_title">
        <span>{item?.icon}</span> {t("sidebar." + item?.translate)}
      </div>

      {item.items?.map((cur) => {
        if (hasAccess(cur.role)) {
          return (
            <ul>
              <li
                className={`sidebar-item-hovered ${
                  pathname.includes(cur?.path || "")
                    ? "sideBarHovered-active"
                    : ""
                }`}
                onClick={() => cur?.path && navigate(cur?.path)}
              >
                <Ellips /> {t("sidebar." + cur.translate)}
              </li>
            </ul>
          );
        }
      })}
    </HoveredItems>
  );
};

const MultiLevel = ({ item }: { item: ISidebarRoute }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  const { value } = useAppSelector((state) => state.sideBarData);
  const hasAccess = useRoleManager();

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const activeParent = item?.items?.find((val) =>
    location.pathname.includes(val.path!)
  );
  const theme = useTheme();

  return (
    <>
      <div
        className={`sidebar-item-parent ${!!activeParent && "active"}`}
        onClick={handleClick}
      >
        <div className="boxsOfChild">
          {value ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ListItemIcon className="icon">{item.icon}</ListItemIcon>
            </motion.div>
          ) : (
            <Popover
              placement="right"
              overlayInnerStyle={{
                // @ts-ignore
                backgroundColor: `${theme?.sidebar?.main}`,
                // @ts-ignore
                boxShadow: `${theme?.boxShadow?.main}`,
              }}
              content={<MultiLevelHover item={item} />}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ListItemIcon className="iconActive">{item.icon}</ListItemIcon>
              </motion.div>
            </Popover>
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
          <ExpandLessIcon className="upAndDownIcon" />
        ) : (
          <ExpandMoreIcon className="upAndDownIcon" />
        )}
      </div>

      {value && (
        <Collapse in={open} timeout={"auto"} unmountOnExit>
          <List component="div" disablePadding sx={{ padding: "8px 0" }}>
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
