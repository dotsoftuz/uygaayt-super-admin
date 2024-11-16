import React from "react";
import { useNavigate } from "react-router-dom";
import MainButton from "../button/MainButton";
import { SaveCancelStyled } from "./SaveCancelButton.style";
// @ts-ignore
import { ButtonProps, TButtonColors } from "@mui/material";

interface IBtnProps extends ButtonProps {
  cancelTitle?: string;
  SubmitTitle?: string;
  SubmitColor?: TButtonColors;
  isCancelFromRoute?: boolean;
  cancelNavigate?: number | string;
  onCancel?: () => void;
}
const SaveCancelBtn = ({
  cancelTitle = "Ortga qaytish",
  SubmitTitle = "Saqlash",
  SubmitColor = "primary",
  isCancelFromRoute = true,
  cancelNavigate = -1,
  onCancel,
  ...props
}: IBtnProps) => {
  const navigate = useNavigate();

  const cancelClickHandler = () => {
    if (isCancelFromRoute) {
      // @ts-ignore
      navigate(cancelNavigate);
    } else {
      onCancel?.();
    }
  };
  return (
    <SaveCancelStyled>
      <div className="btns-container">
        <MainButton
          onClick={cancelClickHandler}
          title={cancelTitle}
          variant="outlined"
        />
        <MainButton
          type="submit"
          title={SubmitTitle}
          variant="contained"
          {...props}
        />
      </div>
    </SaveCancelStyled>
  );
};

export default SaveCancelBtn;
