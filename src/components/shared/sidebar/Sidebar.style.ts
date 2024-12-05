import styled from "styled-components";
interface IValueProps {
  value: boolean;
}
export const SidebarContainer = styled.div<IValueProps>`
  z-index: 99;
  .sidebar-item {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    padding-left: ${(props) => (props.value ? "27px" : "21px")};
    transition: all 0.3s ease;
    height: ${(props) => (props.value ? "auto" : "50px")};

    .MuiListItemIcon-root {
      color: #fff;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    .iconActive {
      padding-left: 15px;
    }

    .unical-logo {
      width: 1200px !important;
      background-color: red;
    }

    svg {
      color: #666687;
      transition: all 0.3s ease;
    }

    color: #666687;
    font-size: 14px;
    font-weight: 400;
    &:hover {
      cursor: pointer !important;
      background-color: #364880;
      color: #0086ff;
    }
    &:hover svg {
      color: #0086ff;
      transition: all 0.3s ease;
    }
  }
  .store_name {
    color: #fff;
    font-weight: 500;
  }
  .sidebar-item-parent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px;
    color: #666687;
    padding-left: ${(props) => (props.value ? "27px" : "21px")};
    font-size: 14px;
    font-weight: 400;
    /* margin-bottom: 0.5rem; */
    transition: all 0.3s ease;
    height: ${(props) => (props.value ? "auto" : "50px")};

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

    .upAndDownIcon {
      margin-right: 10px;
    }

    svg {
      color: #666687;
      transition: all 0.3s ease;
    }

    &:hover {
      cursor: pointer !important;
      background-color: #364880;
      color: #0086ff;
    }
    &:hover svg {
      color: #0086ff;
      transition: all 0.3s ease;
    }
  }

  .sideBar-active {
    cursor: pointer !important;
    background-color: #364880;
    color: #0086ff;

    svg {
      color: #0086ff;
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
    svg {
      color: #666687;
    }
    white-space: nowrap;
  }
  .sidebar-content {
    background-color: #3e5189;
    width: 100%;
    left: 0;
    top: 0;
    height: 100vh;
    position: fixed;
    bottom: 0;
    border-right: 1px solid #eaeaef;
  }

  .sidebar-top {
    height: 70px;
    display: flex;
    align-items: center;
    padding-right: 6px;
    justify-content: center;
    gap: 12px;
    &.active {
      height: 150px;
    }
  }
  .sidebar-top-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 19px;
    width: ${(props) => (props.value ? "auto" : "100%")};
    padding-left: ${(props) => (props.value ? "24px" : "0")};

    .unical-logo {
      width: 160px;
    }

    &.active {
      flex-direction: column-reverse;
      gap: 8px;
    }

    .logoFirst {
      width: 80px;
      height: 61px;
    }
    .sidebar_arrow {
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        transform: rotateY(180deg);
      }
    }
  }

  .sidebar-main {
    overflow-x: hidden;
    height: calc(100vh - 126px);
    overflow-y: auto !important;
    display: grid;
    grid-template-columns: 1fr;

    /* width */
    ::-webkit-scrollbar {
      width: 4px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: #f5f5f5;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #888;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }

  .asosiy {
    margin-bottom: 10px;
    h3 {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: #666687;
    }
  }

  /* .sidebar-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #3e5189;
    display: flex;
    justify-content: right;
    align-items: right;
    padding: 1rem;
    .balance {
      display: flex;
      flex-direction: column;
      background-color: #364880;
      padding: 10px;
      border-radius: 10px;
      width: 100%;
      .title {
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 5px;
      }
      .amount {
        color: #fff;
        font-size: 20px;
        font-weight: 600;
      }
    }
  } */
  .MuiTypography-root {
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    font-family: "SF Pro Display";
    font-style: normal;
  }
  .sidebar-bottom {
    li {
      svg {
        transition: all 0.4s ease;

        transform: ${(props) =>
          props.value ? "rotateZ(0)" : "rotateZ(180deg)"};
      }
    }
  }

  .copyBtn {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.3);

    &:hover {
      background-color: #f9f9f9;
    }

    svg {
      width: 20px;
      height: 20px;

      path {
        fill: blue;
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
  li {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    transition: all 0.3s ease;
    font-size: 12px;
    font-weight: 600;

    &:hover {
      background: #364880;
    }

    &.sideBarHovered-active {
      background: #364880;
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
    border-bottom: 1px solid #364880;

    span {
      margin-top: 2px;
      img {
        width: 16px;
      }
    }
  }
`;
