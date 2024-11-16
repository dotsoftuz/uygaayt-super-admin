import { ModalUnstyledOwnProps } from "@mui/material/Modal";
import React from "react";
import { TSetState } from "types/form.types";
import { ModalStyled } from "./modal.style";

const Modal: React.FC<
  ModalUnstyledOwnProps & { setOpen?: TSetState<boolean> }
> = ({ children, setOpen, ...props }) => {
  return (
    <ModalStyled
      BackdropProps={{
        sx: {
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
      {...props}
      className="modal-container"
    >
      {children}
    </ModalStyled>
  );
};

export default Modal;
