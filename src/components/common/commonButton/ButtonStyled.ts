import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import styled from "styled-components";

export const ButtonStyled = styled(Button)`
  height: 46px !important;
  border-radius: 18px !important;
  outline: none !important;
  font-size: 14px !important;
  text-transform: inherit !important;
  padding: 0 18px !important;
  color: #000 !important;
  background-color: #f3f3f8 !important;
  line-height: 16px !important;
  width: 100%;
  &:hover {
    color: #000 !important;
  }

  .MuiButton-startIcon {
    path {
      stroke: #000 !important;
    }
  }

  &.designed {
    background: linear-gradient(90deg, #ff5c4d 0%, #eb469f 40%, #8341ef 100%);
    color: #ffffff !important;

    .MuiButton-startIcon {
      transition: all 0.2s ease;
      path {
        stroke: #fff !important;
      }
    }
  }

  &:disabled {
    color: #999 !important;
  }
`;

export const IconButtonStyled = styled(IconButton)`
  width: 36px !important;
  height: 36px !important;
  background-color: #f5f5f5 !important;
`;
