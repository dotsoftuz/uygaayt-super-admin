import styled from "styled-components";

export const ProductFormStyled = styled.div`
  .product-images {
    display: flex;
    flex-wrap: wrap;
    .input-file {
      margin-right: 10px;
    }
    .product-image {
      position: relative;
      width: 76px;
      height: 76px;
      border-radius: 12px;
      overflow: hidden;
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: pointer;
      &:hover {
        .on-hover {
          display: flex;
        }
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .on-hover {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: none;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        .delete svg {
          width: 20px;
          height: 20px;
          path {
            fill: #fff;
          }
        }
        .main-image {
          position: absolute;
          right: 5px;
          top: 5px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 2px solid gold;
          &.active {
            background-color: gold;
          }
        }
      }
    }
  }
`;
