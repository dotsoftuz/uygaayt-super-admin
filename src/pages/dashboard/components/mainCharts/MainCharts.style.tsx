import styled from "@emotion/styled";
import { Box } from "@mui/system";

export const MainChartsStyled = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 24px;
  background-color: #ffffff;
  -webkit-box-shadow: 0px 0px 9px -5px rgba(108, 175, 226, 0.96);
  -moz-box-shadow: 0px 0px 9px -5px rgba(108, 175, 226, 0.96);
  box-shadow: 0px 0px 9px -5px rgba(108, 175, 226, 0.96);

  .recharts-responsive-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 50px;
  }

  h2 {
    padding-bottom: 12px;
    border-bottom: 2px solid #f6f6f9;
    font-size: 18px;
    font-weight: 600;
    color: #454545;
    padding: 12px 32px;
  }
  .MuiButton-root {
    width: 100%;
    height: 45px;
    border-radius: 12px;
    text-transform: inherit;
    color: #999999;
    font-weight: 500;
    background-color: inherit;
    &:hover {
      background-color: #f6f6f9;
      color: #000000;
    }
  }
  .rechart_content {
    padding-top: 0;
    .recharts-cartesian-axis-tick-value {
      background-color: green;
    }
  }
  .default_text {
    background-color: #f6f6f9;
    border-radius: 20px;
    color: #000000;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    gap: 7px;
  }
  .chart_dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
`;

export const BoxMainTitle = styled(Box)({
  width: "100%",
  padding: "12px 32px",
  fontSize: "18px",
  fontWeight: "500",
  color: "#454545",
  borderBottom: "1px solid #f6f6f9",
});
