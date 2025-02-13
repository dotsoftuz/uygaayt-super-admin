import { Card, Typography, styled } from "@mui/material";

export const StyledCard = styled(Card)({
  height: "120px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 30px 18px 30px",
  borderRadius: "24px",
  flexDirection: "column",
  // WebkitBoxShadow: "0px 0px 9px -5px rgba(108, 175, 226, 0.96)",
  // MozBoxShadow: "0px 0px 9px -5px rgba(108, 175, 226, 0.96)",
  boxShadow: "0px 0px 9px -5px rgba(108, 175, 226, 0.96)",
  transition: "all .3s",
});

export const TypographyTitle = styled(Typography)({
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: "600",
  padding: "0 24px",
  textAlign: "center",
});
