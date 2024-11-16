import styled from "styled-components";

export const BasketStyled = styled.div`
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
  padding: 16px;
  height: calc(100vh - 110px);
  overflow: auto;
  .tab {
    margin-bottom: 16px;
    .tab-btn {
      color: #999;
      font-size: 14px;
      font-weight: 600;
      padding: 12px;
      width: 50%;
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
  .search {
    display: flex;
    align-items: center;
    justify-content: end;
    > div {
      width: 100%;
    }
    .clear-basket {
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 42px;
      min-width: 42px;
      height: 42px;
      border-radius: 10px;
      background: #f5f5f5;
      margin-left: 30px;
      cursor: pointer;
      svg path {
        fill: #999;
      }
    }
  }
  .product-card {
    position: relative;
    padding: 10px;
    border-radius: 16px;
    background: #f5f5f5;
    cursor: pointer;
    .amount {
      position: absolute;
      top: -10px;
      left: -10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      min-width: 25px;
      padding: 5px;
      height: 25px;
      border-radius: 50%;
      background-color: #006ffd;
      color: #fff;
    }
    .name {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      color: #454545;
      font-size: 14px;
      line-height: 20px;
      overflow: hidden;
    }
    .price {
      display: block;
      font-size: 14px;
      margin-top: 10px;
      font-weight: 600;
    }
    .in-stock {
      font-size: 12px;
      color: #999;
    }
  }
  .basket-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #e9e9e9;
    .name {
      font-size: 14px;
      color: #454545;
      padding-left: 10px;
      width: 75%;
      word-wrap: break-word;
    }
    .action {
      display: flex;
      align-items: center;
      span {
        border-radius: 8px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon {
        width: 34px;
        height: 34px;
        cursor: pointer;
      }
      .amount-input {
        display: block;
        height: 34px;
        padding: 0 10px;
        width: 64px;
        margin: 0 8px;
        border-radius: 8px;
        background: #f5f5f5;
        border: none;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
      }
    }
  }
`;
