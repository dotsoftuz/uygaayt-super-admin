import styled from "styled-components";

export const OrderProductsStyled = styled.div`
  border-radius: 12px;
  background: #fff;
  padding: 20px;
  margin-top: 24px;
  .steps {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px dashed #e9e9e9;
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #e9e9e9;
      &.active {
        background-color: #f7e14b;
        .line {
          background: #f7e14b;
        }
        svg path {
          fill: #000;
        }
      }
      .line {
        position: absolute;
        width: 21.5%;
        height: 4px;
        background: #f5f5f5;
        transform: translateX(-71%);
      }
    }
  }
  .products {
    min-height: 450px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .product_info {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;

      li {
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;

        span {
          color: #999;
        }

        .main {
          color: #000;
          font-weight: 600;
        }
      }
    }
  }
  .product {
    display: flex;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px dashed #e9e9e9;
    &:last-of-type {
      border-bottom: none;
    }
    .default-image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: #f3f3f8;
      margin-right: 12px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      svg {
        width: 20px;
        height: 20px;
      }
    }
    .info {
      .name {
        display: block;
        color: #454545;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 5px;
      }
      .amount-price {
        font-size: 14px;
        font-weight: 700;
      }
    }
    .action {
      display: flex;
      margin-left: auto;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #f3f3f8;
        cursor: pointer;
        &:first-of-type {
          margin-right: 16px;
          svg {
            width: 22px;
            height: 22px;
          }
        }
      }
    }
  }
`;
