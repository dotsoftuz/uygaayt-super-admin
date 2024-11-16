import { Select } from "@mui/material";
import styled from "styled-components";

export const SelectStyled = styled(Select)`
  height: 45px;
  .MuiSelect-select {
    background-color: #fff;
    padding: 0px 12px;
    height: 45px !important;
    border-radius: 10px !important;
    border: 1px solid #d9d9d9;
    line-height: 48px;
  }
  & ~ .text-error {
    position: absolute;
    bottom: -20px;
  }
`;

export const SelectLableStyled = styled.div`
  padding: 6px 0;
  label {
    color: #232323;
    font-weight: 500;
    font-size: 14px;
  }
`;
