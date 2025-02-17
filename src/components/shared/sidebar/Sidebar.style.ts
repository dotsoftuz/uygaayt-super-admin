import { IconButton } from "@mui/material";
import styled from "styled-components";
interface IValueProps {
  value: boolean;
}
export const SidebarContainer = styled.div<IValueProps>`
  z-index: 99;
  .sidebar-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    padding-left: ${(props) => (props.value ? "27px" : "21px")};
    transition: all 0.3s ease;
    height: ${(props) => (props.value ? "auto" : "50px")};
    color: #FFF3E0;
    font-size: 14px;
    font-weight: 400;

    .iconActive {
      padding-left: 15px;
    }

    .unical-logo {
      width: 1200px !important;
    }

    svg {
      transition: all 0.3s ease;
      path {
        stroke: #EB5A02;
      }
    }
    &:hover {
      cursor: pointer !important;
      background-color: #FFF3E0;
      color: #FFF3E0 !important;
    }
  }
  .sidebar-item-parent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px;
    color: #FFF3E0;
    padding-left: ${(props) => (props.value ? "27px" : "21px")};
    font-size: 14px;
    font-weight: 400;
    /* margin-bottom: 0.5rem; */
    transition: all 0.3s ease;
    height: ${(props) => (props.value ? "auto" : "50px")};

    &.active {
      background-color: #FFF3E0;
    }

    .boxsOfChild {
      display: flex;
      align-items: center;

      .sidebar_hovered_box {
        width: 400px;
        padding: 10px;
      }

      .iconActive {
        padding-left: 15px;
      }
      .boxOfTexts {
        margin-left: 10px;

        &.active {
          display: none;
        }
      }
    }
    svg {
      transition: all 0.3s ease;
      path {
        stroke: #EB5A02;
      }
    }
    .upAndDownIcon {
      margin-right: 10px;
      path {
        stroke: none;
        fill: #EB5A02;
      }
    }

    &:hover {
      cursor: pointer !important;
      background-color: #FFF3E0;
      color: #EB5A02;
    }
  }

  .sideBar-active {
    cursor: pointer !important;
    background-color: #FFF3E0;

    span {
      color: #EB5A02 !important;
    }

    svg {
      path {
        stroke: #EB5A02;
      }
    }
  }
  position: relative;
  overflow: hidden;
  .MuiListItemIcon-root {
    min-width: ${(props) => (props.value ? "30px" : "70px")};
  }
  .MuiListItem-button {
    padding-left: 10px !important;

    a {
      color: #666687;
    }
    span {
      font-size: 14px;
      font-weight: 400;
      /* color: #666687; */
    }

    white-space: nowrap;
  }
  .sidebar-content {
    background-color: #fff;
    width: 100%;
    left: 0;
    top: 0;
    height: 100vh;
    position: fixed;
    bottom: 0;
    border-right: 1px solid #E9E9E9;
  }

  .sidebar-top {
    height: 72px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px;
    box-sizing: border-box;
    position: relative;

    &.active {
      height: 72px;
    }
  }
  .sidebar_arrow {
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid #E9E9E9;
    bottom: -15px;
    right: -15px;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 99999;
    background-color: white;

    svg {
      path {
        fill: #000;
      }
    }

    &.active {
      transform: rotateY(180deg);
    }
    &:hover {
      background-color: white;
    }
  }
  .sidebar-top-item {
    width: ${(props) => (props.value ? "auto" : "100%")};
    background-color: #FFF3E0;
    border-radius: 10px;
    padding: 6px;
    display: flex;
    height: 100%;
    width: 100%;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: 0.3s ease;

    &:hover {
      background-color: #FFF3E0;
    }

    .school_head {
      gap: 10px;
      padding: 0 10px;
      text-align: center;
      p {
        font-size: 22px;
        color: #EB5A02;
        text-align: center;
      }
    }

    .school_head-active {
      align-items: center;
      justify-content: center;
      margin-left: 20px;

      svg {
        transform: scale(1.2);
        path {
          fill: #FFF3E0;
        }
      }
    }
  }

  .sidebar-main {
    overflow-x: hidden;
    overflow-y: auto !important;
    height: calc(100vh - 72px - 20px);
    display: grid;
    grid-template-columns: 1fr;

    /* width */
    ::-webkit-scrollbar {
      width: 4px;
      transition: 0.2s;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background-color: #fff;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background-color: #fff;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background-color: #fff;
    }
  }

  .asosiy {
    margin-bottom: 10px;
    h3 {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: #FFF3E0;
    }
  }

  .sidebar-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 48px;
    border-top: 1px solid #fff;
    background-color: black;
    display: flex;
    justify-content: right;
    align-items: right;
    padding: 1rem;
  }
  .MuiTypography-root {
    color: #000;
    font-size: 16px;
    font-weight: 500;
  }

  .sidebar_footer {
    display: flex;
    flex-direction: column;
    border-top: 1px solid #fff;

    .sidebar_foot_item {
      position: relative;
      width: 100%;
      height: 52px;
      color: #EB5A02;

      &:hover {
        background-color: #EB5A02;
      }
      .icon_foot {
        height: 52px !important;
        font-size: 16px;
        padding: 0 27px;
        color: #EB5A02;
        display: flex;
        align-items: center;
        gap: 18px;
        cursor: pointer;
      }
    }
  }
`;

export const HoveredItems = styled.div`
  width: 175px;

  ul {
    /* margin-bottom: 5px; */
    &:nth-child(1) {
      margin-top: 5px;
    }
  }
  .hovered_title {
    font-weight: 600;
    font-size: 13px;
    color: #EB5A02;

    svg {
      path {
        stroke: #EB5A02 !important;
      }
    }
  }
  li {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: flex-center;
    gap: 10px;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    font-weight: 500;
    color: #EB5A02 !important;
    padding: 10px;
    margin-bottom: 2px;
    /* background: #fff; */

    cursor: pointer;

    svg {
      circle {
        fill: #EB5A02 !important;
      }
      &:hover {
        fill: #EB5A02 !important;
    }
    }

    &.sideBarHovered-active {
      background: #FFF3E0;
      border-radius: 5px;
      color: #EB5A02 !important;
    }
    &:hover {
      border-radius: 5px;
      background: #FFF3E0;
      color: #EB5A02 !important;

    }
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    gap: 10px;
    height: 34px;
    border-bottom: 1px solid #fff;

    span {
      margin-top: 2px;
      img {
        width: 16px;
      }
    }
  }
`;

export const SettingDrawerStyle = styled.div`
  width: 360px;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: black;

  .top {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;

      h2 {
        font-size: 33px;
        font-weight: 700;
        color: #fff;
      }
    }

    .section {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      .head {
        display: flex;
        align-items: center;
        gap: 12px;

        svg {
          width: 40px;
          height: 40px;

          path {
            fill: #FFF3E0;
          }
        }

        p {
          font-size: 16px;
          color: #fff;
          cursor: pointer;

          span {
            color: #fff;
            font-size: 14px;
          }

          &:hover {
            color: #0086ff;
          }
        }
      }

      .switch {
        position: relative;
        display: inline-block;
        width: 52px;
        height: 24px;
      }

      /* Hide the default checkbox */
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      /* The slider (the rounded part of the switch) */
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #d9d8dd;
        transition: 0.4s;
        border-radius: 28px;
      }

      /* Rounded corners of slider */
      .slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }

      /* When the checkbox is checked, change the background color of the slider */
      .switch input:checked + .slider {
        background-color: white;
      }

      /* When the checkbox is checked, move the knob to the right */
      .switch input:checked + .slider:before {
        transform: translateX(28px);
      }

      /* Rounded corners of slider for dark mode */
      .slider:before {
        background-color: #f2f2f2;
      }

      /* Change knob color for dark mode */
      .switch input:checked + .slider:before {
        background-color: black;
      }
      .theme_title {
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        color: #fff;
      }
    }
  }
  .bottom {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .theme_label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
`;

export const LanguageBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  gap: 12px;

  button {
    width: 100%;
    height: 42px;
    border: none;
    outline: none;
    border-radius: 12px;
    color: white;
    background-color: #FFF3E0;
    font-size: 14px;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid #FFF3E0;

    &:hover {
      border: 1px solid red;
    }

    &.active {
      background-color: white;
      color: #fff;
    }
  }
`;

export const NotificationButton = styled(IconButton)`
  svg {
    path {
      fill: #FFF3E0;
    }
  }
`;

export const NotificationContainer = styled("div")`
  .ant-popover-inner {
    padding: 0;
    margin: 0;
  }
`;
export const NotificationContent = styled("div")`
  width: 400px;
  min-height: 160px;
  max-height: 420px;
  overflow: auto;
  padding: 0 16px 16px 16px;
  border-radius: 10px;
  background-color: black;

  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #fff;
    border-radius: 12px;
  }
  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 12px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    background-color: black;
    position: sticky;
    top: 0;
    z-index: 99;

    h2 {
      font-size: 16px;
      color: #fff;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .item {
      display: flex;
      gap: 6px;
      flex-direction: column;
      background-color: #FFF3E0;
      padding: 12px;
      border-radius: 10px;
      background-color: ${({ theme }) => theme.background.body};

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h4 {
          display: flex;
          gap: 7px;
          font-size: 14px;
          color: #fff;
        }
        span {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
        }
      }

      .message {
        color: #fff;
      }

      .foot {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .readable_box {
          width: 10px;
          height: 10px;
          background-color: #fff;
          border-radius: 10px;
          display: inline-block;
        }

        .time {
          font-size: 13px;
          color: ${({ theme }) => theme.primary.secondary};
        }
      }
    }
  }
`;
