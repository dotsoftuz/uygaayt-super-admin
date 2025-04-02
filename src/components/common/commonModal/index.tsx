import { ModalProps } from "antd";
import { CloseIcon } from "assets/svgs";
import React from "react";
import { useTranslation } from "react-i18next";
import { CloseBtn } from "styles/global.style";
import CommonButton from "../commonButton/Button";
import { CommonModalStyle } from "./modal.style";

export interface ICommonModalProps extends ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<any>>;
  onSave?: () => void;
  title?: string;
  status?: string;
  children?: React.ReactNode;
  canClose?: boolean;
  canCloseView?: boolean;
  saveBtnTitle?: string;
  saveBtnType?: "button" | "submit";
  backBtnTitle?: string;
  FORM_ID?: string;
}
const CommonModal = ({
  open,
  setOpen,
  onSave,
  title,
  status,
  children,
  canCloseView = false,
  canClose = true,
  saveBtnTitle,
  saveBtnType,
  backBtnTitle,
  FORM_ID,
  ...props
}: ICommonModalProps) => {
  const { t } = useTranslation();

  return (
    <CommonModalStyle
      title={title}
      centered
      open={open}
      onCancel={() => canClose && status !== "loading" && setOpen(null)}
      closable={canCloseView}
      closeIcon={
        <CloseBtn onClick={() => setOpen(null)}>
          <CloseIcon />
        </CloseBtn>
      }
      {...props}
      footer={
        onSave
          ? [
              <CommonButton
                title={(backBtnTitle || t("general.no"))!}
                className="grey"
                key="back"
                onClick={() => setOpen(null)}
                style={{ marginRight: "15px", maxWidth: "280px" }}
                disabled={status === "loading"}
              />,
              <CommonButton
                key="submit"
                title={(saveBtnTitle || t("general.yes"))!}
                style={{ maxWidth: "280px" }}
                className="main"
                form={FORM_ID}
                type={saveBtnType || "button"}
                onClick={onSave}
                disabled={status === "loading"}
                status={status}
              />,
            ]
          : []
      }
    >
      {children}
    </CommonModalStyle>
  );
};

export default CommonModal;
