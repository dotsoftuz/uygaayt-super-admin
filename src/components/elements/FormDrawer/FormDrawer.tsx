import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeftSharp";
import {
  Box,
  Chip,
  LinearProgress,
  SwipeableDrawer,
  // @ts-ignore
  TButtonColors,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import { MainButton } from "components";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/storeHooks";
import { SIDEBAR_CLOSE, SIDEBAR_OPEN } from "styles/global.style";
import { setOpenDrawer } from "./formdrawer.slice";
import { FormDrawerStyled } from "./formDrawer.styled";
import { useTranslation } from "react-i18next";

interface IFormDrawer {
  isTop?: boolean;
  isFullWidth?: boolean;
  children: React.ReactNode;
  formItemTitle?: string;
  FORM_ID?: string;
  onClose?: any;
  customTitle?: React.ReactNode;
  isEditing?: boolean;
  isLoading?: boolean;
  actionBtns?: boolean;
  createButtonTitle?: string;
  onClickSubmit?: () => void;
  onCloseClick?: () => void;
  cancelButtonTitle?: string;
}

const FormDrawer: React.FC<IFormDrawer> = ({
  isFullWidth,
  children,
  formItemTitle = "FORMDRAWER.ELEMENT",
  FORM_ID,
  onClose,
  isEditing,
  isTop = false,
  isLoading,
  customTitle,
  actionBtns = true,
  createButtonTitle = "FORMDRAWER.SAVE",
  cancelButtonTitle = "FORMDRAWER.BACK",
  onClickSubmit,
  onCloseClick,
}) => {
  const { t } = useTranslation();
  const { isOpen, disableSubmitButton } = useAppSelector(
    (store) => store.formDrawerState
  );
  const dis = useAppDispatch();

  useEffect(() => {
    return () => {
      dis(setOpenDrawer(false)); // @bug this-may-cause-to-bug
    };
  }, []);

  return (
    <FormDrawerStyled
      open={isOpen}
      onClose={() => {
        onClose?.();
        dis(setOpenDrawer(false));
      }}
      onOpen={() => dis(setOpenDrawer(true))}
      anchor="right"
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      disablePortal
      BackdropProps={{
        sx: {
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: isFullWidth ? undefined : "2% 0 0 2%",
          minWidth: 340,
          maxWidth: isOpen
            ? `calc(100vw - ${SIDEBAR_OPEN})`
            : `calc(100vw - ${SIDEBAR_CLOSE})`,
          width: isFullWidth
            ? isOpen
              ? `calc(100vw - ${SIDEBAR_OPEN})`
              : `calc(100vw - ${SIDEBAR_CLOSE})`
            : undefined,
        },
      }}
    >
      <div
        className={
          isFullWidth || !actionBtns
            ? "form_drawer_container active"
            : "form_drawer_container"
        }
      >
        <div className="form_drawer_header">
          <Grid container className="form_drawer_header_content">
            {isTop && isFullWidth && (
              <Grid item md={1}>
                <IconButton
                  onClick={() => {
                    onClose?.();
                    dis(setOpenDrawer(false));
                  }}
                  color="primary"
                >
                  <KeyboardArrowLeftIcon />
                </IconButton>
              </Grid>
            )}
            <Grid item md={7}>
              <h2 style={{ fontSize: "24px", fontWeight: 500 }}>
                {customTitle ||
                  (isEditing
                    ? `${t(formItemTitle)}`
                    : `${t("FORMDRAWER_TITLE.NEW")} ${t(formItemTitle)}`)}
              </h2>
            </Grid>

            {isFullWidth && (
              <Grid
                item
                md={3}
                display="flex"
                justifyContent="end"
                alignItems="center"
              >
                <MainButton
                  form={FORM_ID}
                  type="submit"
                  variant="contained"
                  title={t(createButtonTitle)}
                  style={{ width: "140px" }}
                />
              </Grid>
            )}

            {!isFullWidth && (
              <Grid item md={3} display="flex" justifyContent="flex-end">
                <IconButton
                  onClick={() => {
                    onClose?.();
                    dis(setOpenDrawer(false));
                  }}
                  color="primary"
                  style={{
                    maxWidth: "40px",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </div>

        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}

        <div
          className={
            !actionBtns ? "form_drawer_content active" : "form_drawer_content"
          }
        >
          <Grid item container md={12}>
            {children}
          </Grid>
        </div>
      </div>

      {!isTop && actionBtns && (
        <div className="form_drawer_bottom">
          <Grid
            item
            md={12}
            container
            spacing={2}
            className="form_drawer_bottom_content"
          >
            <Grid item md={6}>
              <MainButton
                onClick={() => {
                  onClose?.();
                  dis(setOpenDrawer(false));
                  onCloseClick?.();
                }}
                title={t(cancelButtonTitle)}
                style={{ width: "140px", backgroundColor: "#f5f5f5" }}
              />
            </Grid>
            <Grid item md={6} display="flex" justifyContent="end">
              <MainButton
                form={FORM_ID}
                type="submit"
                variant="contained"
                onClick={() => {
                  onClickSubmit?.();
                }}
                title={t(createButtonTitle)}
                style={{ width: "140px" }}
                disabled={disableSubmitButton}
                loader={disableSubmitButton}
              />
            </Grid>
          </Grid>
        </div>
      )}
    </FormDrawerStyled>
  );
};

export default FormDrawer;
