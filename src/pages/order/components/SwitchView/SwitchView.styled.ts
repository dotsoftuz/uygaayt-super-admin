import styled from "styled-components";

export const SwitchViewStyled = styled.div<any>`
  .MuiToggleButton-root {
    border-radius: 12px;
    background-color: #f5f5f5 !important;
    z-index: 2;
    transition: all 0.3s ease;
    &.active {
      background-color: #EB5B00 !important;
    }
  }
`;
