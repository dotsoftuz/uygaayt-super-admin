import styled from "@emotion/styled";

export const StyledSwitch = styled("div")({
  position: "relative",
  width: "90px",
  height: "51.6px",
  borderRadius: "0 8px 8px 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 8px",
  cursor: "pointer",
  transition: "all 0.4s",
  border: "1px solid rgba(49,57,73,0.1)",
  "&::before": {
    content: '""',
    position: "absolute",
    width: "43px",
    height: "50.6px",
    // opacity: "0.7", // @here is opacity
    background: "#3E5189",
    top: -0.2,
    left: "0",
    right: "auto",
    transition: "all 0.4s",
  },
  "&.show::before": {
    left: "45.5px",
    borderTopRightRadius: "8px",
    borderBottomRightRadius: "8px",
  },
});

export const StyledPercent = styled("div")({});
