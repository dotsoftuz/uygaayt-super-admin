import { useApiMutation } from "hooks/useApi/useApiHooks";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/storeHooks";
import { SIDEBAR_CLOSE, SIDEBAR_OPEN } from "styles/global.style";
import { LanguageBox, NavbarContainer } from "./Navbar.style";

import { useRoleManager } from "services/useRoleManager";
import { ArrowDown, ProfileIcon } from "assets/svgs";
import { Badge, Grid, IconButton, MenuItem, MenuList, Paper, Popover } from "@mui/material";
import { get } from "lodash";
import WarningModal from "components/common/WarningModal/WarningModal";
import MainButton from "components/common/button/MainButton";
import Modal from "../modal/modal";
import TextInput from "components/form/TextInput/TextInput";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { socket } from "socket";
import { setSocketConnect } from "store/reducers/LoginSlice";
// @ts-ignore
import audio from "../../../assets/order-voice.mp3";
// @ts-ignore
import completedVoice from "../../../assets/completed-voice.mp3";
import { socketReRender } from "store/reducers/SocketSlice";
import CommonButton from "components/common/commonButton/Button";
import { useTranslation } from "react-i18next";
import useOutsideClick from "services/useOutsideClick/useOutsideClick";
import BackButton from "components/common/backButton/BackButton";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Notification from "./components/Notification";

interface IPassword {
  currentPassword: string;
  password: string;
}
const Navbar = ({ hasNavbar }: { hasNavbar: boolean }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const [newNotification, setNewNotification] = useState<any>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hasAccess = useRoleManager();
  const [limit, setLimit] = useState(10);
  const [exit, setExit] = useState(false);
  const [pop, setPop] = useState<boolean>(false);
  const [isChange, setisChange] = useState<boolean>(false);
  // const [open, setOpen] = useState(false);
  const popoverId = open ? "simple-popover" : undefined;
  // @ts-ignore
  const stores = JSON.parse(localStorage.getItem("stores"));

  const { i18n } = useTranslation();
  const defaultLang = localStorage.getItem("i18nextLng");
  const [language, setLanguage] = useState<string>(
    defaultLang ? defaultLang : "uz"
  );

  const { control, handleSubmit } = useForm<IPassword>();
  const dis = useAppDispatch();
  const refLang = useRef(null);

  const handleChangeLang = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    setPop(false);
    i18n.changeLanguage(lang);
  };

  useOutsideClick(refLang, () => {
    setPop(false);
  });

  const makeNoice = () => {
    try {
      new Audio(audio).play();
    } catch (error) {
      // console.log(error);
    }
  };

  const makeNoiceCompleted = () => {
    try {
      new Audio(completedVoice).play();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    function OrderUpdate(data: any) {
      dis(socketReRender(true));
      if (!!data.data.state?.isSoundable) makeNoiceCompleted();
    }
    function OrderCreate(data: any) {
      dis(socketReRender(true));
      if (!!data.data.state?.isSoundable) makeNoice();
    }


    socket.on("orderCreated", OrderCreate);
    socket.on("orderUpdated", OrderUpdate);
    // socket.on("notification", Notification);
    return () => {
      socket.off("orderUpdated", OrderUpdate);
      socket.off("orderCreated", OrderCreate);
      // socket.off("notification", Notification);
    };
  }, []);

  const { mutate } = useApiMutation<{
    // _id: string;
    currentBranchId: string;
  }>("employee/branch", "post", {
    onSuccess(data, variables, context) {
      if (pathname?.split("/")?.some((path) => path?.length === 24)) {
        navigate("/order/table");
      }
      navigate(0);
    },
  });
  const { value } = useAppSelector((state) => state.sideBarData);
  const { loginData } = useAppSelector((state) => state.LoginState);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const openUser = Boolean(anchorElUser);
  const handleClickUser = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const logoutUser = () => {
    localStorage.clear();
    navigate("/login", {
      replace: false,
    });
  };
  const { mutate: changePassword } = useApiMutation("profile/password/update", "put", {
    onSuccess(data) {
      setisChange(false);
      toast.success("Parol o'zgartirildi!");
    },
  });

  const onSubmit = (data: IPassword) => {
    changePassword(data);
  };


  return (
    <NavbarContainer>
      <div
        style={{ left: value ? SIDEBAR_OPEN : SIDEBAR_CLOSE }}
        className="navbar-content"
      >
        <BackButton />

        <div className="d-flex align-items-center justify-content-end gap-3">

          <Notification />
          <LanguageBox ref={refLang}>
            <CommonButton
              title={
                language === "uz"
                  ? "O'zbek"
                  : language === "ru"
                    ? "Русский"
                    : "English"
              }
              endIcon={<ArrowDown />}
              onClick={() => setPop(!open)}
              className={pop ? "arrow" : ""}
            />
            <Paper className={pop ? "show" : ""}>
              <MenuList>
                <MenuItem
                  className={language === "uz" ? "active" : ""}
                  onClick={() => handleChangeLang("uz")}
                >
                  O'zbek
                </MenuItem>
                <MenuItem
                  className={language === "ru" ? "active" : ""}
                  onClick={() => handleChangeLang("ru")}
                >
                  Русский
                </MenuItem>
                {/* <MenuItem
                  className={language === "en" ? "active" : ""}
                  onClick={() => handleChangeLang("en")}
                >
                  English
                </MenuItem> */}
              </MenuList>
            </Paper>
          </LanguageBox>
          <div className="profile md:flex items-center">
            <h4 className="hidden md:block me-3">
              {get(loginData, "firstName", "")} {get(loginData, "lastName", "")}
            </h4>
            <span
              // className="icon"
              aria-describedby={popoverId}
              onClick={(e: any) => {
                e.stopPropagation();
                setAnchorEl(e.currentTarget);
              }}
            >
              <ProfileIcon />
            </span>
            <Popover
              id={popoverId}
              open={open}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              className="popover-container"
            >
              <div className="popover">
                {/* <h4>{get(loginData, 'firstName', '')} {get(loginData, 'lastName', '')}</h4> */}
                <span>{get(loginData, "phoneNumber", "")}</span>
                {stores?.length > 1 && (
                  <button
                    className="change-market"
                    onClick={() => navigate("/store")}
                  >
                    Marketni o'zgartirish
                  </button>
                )}
                <button
                  className="change-market"
                  onClick={() => {
                    setAnchorEl(null);
                    setisChange(true);
                  }}
                >
                  Parolni o'zgartirish
                </button>
                <button className="logout" onClick={() => setExit(true)}>
                  Chiqish
                </button>
              </div>
            </Popover>
            <WarningModal
              open={exit}
              setOpen={setExit}
              title="Rostdan ham chiqmoqchimisiz?"
              confirmFn={logoutUser}
            />

            <Modal
              open={isChange}
              setOpen={setisChange}
              onClose={() => setisChange(false)}
            >
              <form id="change-password" onSubmit={handleSubmit(onSubmit)}>
                <Grid
                  container
                  display="flex"
                  sx={{
                    backgroundColor: "white",
                    padding: "2rem",
                    borderRadius: 12,
                    width: 500,
                    minHeight: 200,
                    // textAlign: "center",
                  }}
                  spacing={2}
                >
                  <h2>Parolni o'zgartirish</h2>
                  <Grid item md={12} mt={2}>
                    <TextInput
                      control={control}
                      name="currentPassword"
                      placeholder="Eski parol"
                      label={"Eski parol"}
                      type="password"
                    />
                  </Grid>
                  <Grid item md={12}>
                    <TextInput
                      control={control}
                      name="password"
                      placeholder="Yangi parol"
                      label={"Yangi parol"}
                      type="password"
                    />
                  </Grid>
                  <Grid item md={12} mt={2}>
                    <div className="d-flex align-items-center justify-content-center gap-4">
                      <MainButton
                        onClick={() => setisChange(false)}
                        color="secondary"
                        title="Orqaga"
                      // variant="contained"
                      />
                      <MainButton
                        type="submit"
                        variant="contained"
                        title="Saqlash"
                        form="change-password"
                      />
                    </div>
                  </Grid>
                </Grid>
              </form>
            </Modal>
          </div>
        </div>
      </div>
    </NavbarContainer>
  );
};

export default Navbar;
