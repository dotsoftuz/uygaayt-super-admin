import { SwipeableDrawer } from "@mui/material";
import styled from "styled-components";

export const FormDrawerStyled = styled(SwipeableDrawer)`
  .form_drawer_container {
    height: calc(100vh - 80px) !important;
    overflow-y: auto !important;

    &.active {
      height: 100vh !important;
    }
    &::-webkit-scrollbar {
      width: 12px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #d9d9d9;
      border-radius: 12px;
    }
    &::-webkit-scrollbar-track {
      background-color: #f5f5f5;
      border-radius: 12px;
    }

    .form_drawer_header {
      width: 100%;
      padding: 34px 24px 24px 24px;

      .form_drawer_header_content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .form_drawer_content {
      height: calc(100vh - 98px - 80px) !important;
      padding: 0 24px;
    }
  }

  .form_drawer_bottom {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff !important;
    .form_drawer_bottom_content {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
    }
  }
`;
