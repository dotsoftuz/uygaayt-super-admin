import { IconButton } from "@mui/material";
import styled from "styled-components";

export const StyledHasOrder = styled("div")({
  position: "fixed",
  width: "70px",
  height: "70px",
  bottom: "84px",
  right: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: "77",
  borderRadius: "40px",
  //   cursor: "pointer",
});

export const StyledIconButton = styled(IconButton)({
  width: "70px",
  height: "70px",
  backgroundColor: "#0F6FDF !important",
  boxShadow: "0px 0px 12px rgba(15, 111, 223, 0.3)",
  zIndex: "77",
});
