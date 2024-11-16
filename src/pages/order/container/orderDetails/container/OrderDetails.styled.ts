import styled from "styled-components";

export const OrderDetailsStyled = styled.div`
  padding: 10px 0;
  .top {
    display: flex;
    align-items: center;
    width: 100%;
    .state-select {
      min-width: 180px;
      margin-top: -3px;
      div {
        width: 100% !important;
      }
      margin-right: 15px;
    }
    .payment-type {
      display: flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 12px;
      background: #fff;
      width: 100%;
      .type {
        margin-left: 11px;
        span {
          color: #999;
          font-size: 12px;
          font-weight: 500;
        }
        h4 {
          font-weight: 500;
          font-size: 15px;
        }
      }
      .state {
        margin-left: auto;
        color: #eb5757;
        font-size: 15px;
      }
    }
  }
`;
