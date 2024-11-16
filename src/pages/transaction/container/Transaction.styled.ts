import styled from "styled-components";

export const TransactionStyled = styled.div`
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
  margin-top: 10px;
  .total-balance {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;
    border-radius: 12px;
    background: #f3f3f8;
    .amount {
      font-size: 24px;
      font-weight: 500;
    }
    .text {
      color: #888a99;
      font-size: 14px;
      font-weight: 500;
    }
  }
  .balance {
    height: 100px;
    border-radius: 12px;
    background: #f3f3f8;
    padding: 14px;
    .amount-wrapper {
      display: flex;
      justify-content: space-between;
      border-radius: 6px;
      background: #e2e2eb;
      padding: 9px 16px;
      border-radius: 6px;
      &:first-of-type {
        margin-bottom: 7px;
        border-left: 5px solid #17c657;
      }
      &:last-of-type {
        border-left: 5px solid #eb5757;
      }
      .title {
        font-size: 13px;
        color: #333;
      }
      .amount {
        font-size: 13px;
        font-weight: 600;
      }
    }
  }
  .buttons {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100px;
    .income {
      background-color: #17c657 !important;
    }
    .outcome {
      background-color: #eb5757 !important;
    }
  }
  .comment {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
