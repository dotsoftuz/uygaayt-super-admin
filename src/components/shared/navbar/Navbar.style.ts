import { Box, Menu } from "@mui/material";
import styled from "styled-components";

export const NavbarContainer = styled.div`
  .navbar-content {
    position: fixed;
    top: 0;
    right: 0;
    height: 65px;
    border-bottom: 1px solid #eaeaef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 24px;
    padding-right: 24px;
    gap: 16px;
    z-index: 80;
    background: #ffffff;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    .profile {
      display: flex;
      align-items: center;
      justify-content: end;
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background-color: #f3f3f8;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }
  .navbar-right-container {
    display: flex;
    align-items: center;
    gap: 12px;
    .language_content {
      border-radius: 8px;
      background: rgba(42, 48, 66, 0.05);
    }
    .language_button {
      height: 45px;
      width: 120px;
      background-color: aqua;
      display: flex;
      align-items: center;
      gap: 14px;
      border-radius: 8px;
      /* border: 1px solid #2a3042; */
      color: #232323;
      font-size: 16px;
      font-weight: 500;
      background-color: #f5f5f5;
      .icon {
        transition: all 0.3s ease;
      }
      &.active {
        .icon {
          transform: rotate(180deg);
        }
      }

      div {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
    .notification {
      position: relative;
      .icon {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: #f5f5f5;
        width: 44px;
        height: 44px;
        cursor: pointer;
        .red {
          position: absolute;
          top: 10px;
          right: 11px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #d54239;
          border: 1px solid #f5f5f5;
        }
      }
      .list {
        position: absolute;
        left: 0px;
        width: 380px;
        border-radius: 12px;
        box-shadow: 0px 2px 12px -2px rgba(0, 0, 0, 0.15);
        background: #fff;
        overflow: hidden;
        h4 {
          padding: 15px;
        }
        .item {
          display: flex;
          align-items: center;
          padding: 8px 15px;
          transition: all 0.3s ease;
          cursor: pointer;
          &:hover {
            background: #f5f5f5;
          }
          .key {
            min-width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: #2a3042;
            margin-right: 10px;
          }
          .contract-number {
            display: block;
            color: #3874cb;
            font-size: 14px;
            font-weight: 600;
          }
          .status {
            font-size: 13px;
            color: #999;
            font-weight: 500;
          }
          .time {
            font-size: 13px;
            color: #999;
            font-weight: 500;
            margin-top: auto;
            margin-left: auto;
          }
        }
      }
      .load-more {
        border-radius: 0px 0px 12px 12px;
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0) 0%,
          #fff 100%
        );
        .load-more-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 10px auto;
          width: 60px;
          height: 24px;
          border-radius: 12px;
          background: #f5f5f5;
          cursor: pointer;
        }
      }
    }
  }
`;
export const NavbarSelectStyled = styled.div`
  padding: 0 5px !important;
  height: 45px !important;
  display: flex;
  align-items: center;

  .MuiFormControl-root {
    label {
      display: none !important;
    }
  }
  .MuiInputBase-root {
    height: 45px !important;
    background: rgba(42, 48, 66, 0.05) !important;
    /* border: 1px solid #2a3042; */
    border-radius: 8px !important;
    border: none !important;
    color: #000000;
  }
`;

export const NavbarUserProfStyled = styled.div`
  width: 170px;
  height: 45px;
  border-radius: 8px;
  /* border: 1px solid #121221; */
  position: relative;

  .user_btn {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    color: #232323;
    font-size: 16px;
    font-weight: 500;
    text-transform: inherit;
    width: 100% !important;
    border-radius: 8px;
    line-height: 18px;
    gap: 4px;
    height: 100%;
    background-color: #f5f5f5;

    &:hover {
      background-color: #f5f5f5;
    }

    span {
      /* display: inline-block; */
      overflow: hidden;
      font-size: 16px;
      font-weight: 500;
      color: #232323;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden !important;
      text-overflow: ellipsis;
    }
    .icon_box {
      transition: all 0.3s ease;
    }

    &.active {
      .icon_box {
        transform: rotate(180deg);
      }
    }
  }
`;

export const MenuItemStyled = styled(Menu)`
  margin-top: 7px;
  .MuiMenu-list {
    width: 170px !important;
    background: #ffffff;
    border-radius: 8px;
  }
  .MuiPaper-root {
    border-radius: 8px;
    -webkit-box-shadow: 0px 2px 12px -2px rgba(34, 60, 80, 0.33);
    -moz-box-shadow: 0px 2px 12px -2px rgba(34, 60, 80, 0.33);
    box-shadow: 0px 2px 12px -2px rgba(34, 60, 80, 0.33);
  }
  .MuiButtonBase-root {
    gap: 7px;
  }

  .icon {
    color: red;
  }
`;

export const MenuLangItemStyled = styled(Menu)`
  margin-top: 7px;

  .MuiMenu-list {
    width: 120px !important;
    background: #ffffff;
    border-radius: 8px;
  }
  .MuiPaper-root {
    border-radius: 8px;
    -webkit-box-shadow: 0px 2px 12px -2px rgba(34, 60, 80, 0.33);
    -moz-box-shadow: 0px 2px 12px -2px rgba(34, 60, 80, 0.33);
    box-shadow: 0px 2px 12px -2px rgba(34, 60, 80, 0.33);
  }
  .lang_box {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  svg {
    pointer-events: none !important;
  }
`;

export const LanguageBox = styled(Box)`
  position: relative;
  .MuiButtonBase-root {
    width: 110px;
  }
  .MuiPaper-root {
    position: absolute;
    width: 110px;
    top: 40px;
    left: 0;
    transition: 0.2s ease;
    border-radius: 12px;
    display: none;

    &.show {
      display: block;
    }

    .MuiList-root {
      .MuiMenuItem-root {
        &.active {
          background-color: #f3f3f8 !important;
        }
      }
    }
  }

  .arrow {
    svg {
      transform: rotate(180deg);
    }
  }
`;
