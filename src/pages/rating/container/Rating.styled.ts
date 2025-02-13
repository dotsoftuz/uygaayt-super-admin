import styled from "styled-components";

export const RatingStyled = styled.div`
  margin-top: 10px;
  .ratings {
    left: 20px;
    padding: 10px 20px;
    margin: auto !important;
    .rating {
      display: flex;
      margin: auto !important;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      border-radius: 12px;
      border: 1px solid #f3f3f8;
      padding: 4px 12px;
      width: 112px;
      cursor: pointer;
      &.active {
        background: #EB5B00;
        border: 1px solid #EB5B00;
      }
      svg {
        margin: 0 1px;
      }
    }
  }
`;
