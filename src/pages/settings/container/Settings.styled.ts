import { MenuItem, Select } from "@mui/material";
import styled from "styled-components";

export const SettingsStyled = styled.div`
  .tabs {
    height: 330px;
    background: #fff;
    .tab {
      position: relative;
      color: #454545;
      font-size: 14px;
      padding: 14px 16px;
      border-bottom: 1px solid #f5f5f5;
      cursor: pointer;
      &.active {
        font-weight: 500;
      }
      .left-border {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 6px;
        background-color: #3e5189;
      }
    }
  }
  .settings {
    border-radius: 12px;
    background: #fff;
    padding: 0 20px 0 20px;
    height: calc(100vh - 100px);
    box-sizing: border-box;
    overflow: auto;
    padding-bottom: 20px;
    .item {
      border: 1px solid #e8e8e8;
      padding: 15px;
      border-radius: 15px;
      .key {
        display: block;
        color: #333;
        margin-bottom: 5px;
        font-size: 15px;
      }
    }
  }
`;

export const SettingTitle = styled.span`
  font-size: 24px;
  color: #000;
`;

export const HeaderOfSettings = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 99;
  height: 80px;
  background-color: #fff;
`;

export const StyledPhoneCountrySelect = styled(Select)({
  width: "250px",
  borderRadius: "12px",
  border: "1px solid #e9e9e9",
  outline: "none",
  minWidth: "300px",

  "& .MuiSelect-select": {
    display: "flex",
    borderRadius: "10px",
    border: "none",
  },
});


export const StyledMenuItem = styled(MenuItem)({
  minWidth: "250px",
  display: "flex",
  alignItems: "center",
});


export const MinimumOrderStyled = styled.div`
  border-radius: 12px;
  background: #fff;
  padding: 20px;
  height: calc(100vh - 100px);
  overflow: auto;
  .note {
    display: flex;
    align-items: center;
    color: #00c537;
    font-size: 15px;
    border-radius: 12px;
    background: #e5f9eb;
    padding: 12px;
    svg {
      margin-right: 12px;
    }
  }
  .warning {
    display: flex;
    align-items: center;
    color: #ffb345;
    font-size: 15px;
    border-radius: 12px;
    background: rgba(255, 179, 69, 0.1);
    padding: 12px;
    margin-top: 10px;
    margin-bottom: 24px;
    svg {
      margin-right: 12px;
    }
  }
`;
