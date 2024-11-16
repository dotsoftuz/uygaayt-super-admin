import { MenuItem, Select } from "@mui/material";
import styled from "styled-components";

export const SelectStyled = styled(Select)`
  width: 150px !important;
  height: 45px;
  font-size: 16px !important;
  border-radius: 10px !important;
  transition: all 0.3s ease;
  gap: 10px;
  padding: 0px 6px !important;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  .MuiPaper-rounded {
    background-color: aqua !important;
  }
  .clear-btn {
    margin-right: 10px;
    opacity: 0.5;
  }
  .select_options_menu {
    background-color: aqua !important;
  }
`;

export const SelectMenuStyled = styled(MenuItem)``;
