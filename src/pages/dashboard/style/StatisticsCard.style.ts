import { Card, Typography, styled } from "@mui/material";

export const StyledCard = styled(Card)({
  height: "80px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 16px",
  borderRadius: "12px",
  gap: "12px",
  // WebkitBoxShadow: "0px 0px 9px -5px rgba(108, 175, 226, 0.96)",
  // MozBoxShadow: "0px 0px 9px -5px rgba(108, 175, 226, 0.96)",
  boxShadow: "0px 0px 9px -5px rgba(108, 175, 226, 0.96)",
  transition: "all .3s",
});

export const TypographyTitle = styled(Typography)({
  fontSize: "16px",
  fontWeight: "600",
  textAlign: "center",
  color: "#45556c",
});
