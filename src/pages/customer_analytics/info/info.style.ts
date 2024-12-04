import styled from "styled-components";

export const TabStyled = styled.div`
    padding: 20px;
  .tab {
    margin-bottom: 16px;
    padding: 20px;
    .tab-btn {
      color: #999;
      font-size: 14px;
      font-weight: 600;
      padding: 20px;
      border: none;
      border-bottom: 2px solid #e9e9e9;
      background: none;
      cursor: pointer;
      &.active {
        color: #000;
        border-bottom: 2px solid #006ffd;
      }
    }
  }
`;
