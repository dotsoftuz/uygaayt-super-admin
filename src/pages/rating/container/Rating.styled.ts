import styled from "styled-components";

export const RatingStyled = styled.div`
  margin-top: 10px;
  .ratings {
    display: flex;
    position: absolute;
    left: 20px;
    .rating {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      border-radius: 12px;
      border: 1px solid #f3f3f8;
      padding: 4px 12px;
      width: 112px;
      cursor: pointer;
      &.active {
        background: #3e5189;
        border: 1px solid #3e5189;
      }
      svg {
        margin: 0 1px;
      }
    }
  }
`;
