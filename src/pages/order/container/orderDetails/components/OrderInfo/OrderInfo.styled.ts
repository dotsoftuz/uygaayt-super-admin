import styled from "styled-components";

export const OrderInfoStyled = styled.div`
  max-height: calc(100vh - 110px);
  overflow: auto;
  .card {
    padding: 16px 20px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
    margin-bottom: 16px;
    &:last-of-type {
      margin-bottom: 0;
    }
    .title {
      font-size: 18px;
      border-bottom: 1px dashed #e9e9e9;
      padding-bottom: 10px;
      margin-bottom: 16px;
    }
    .info {
      display: flex;
      align-items: center;
      .image {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f3f3f8;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        margin-right: 12px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        svg {
          width: 25px;
          height: 25px;
        }
      }
      .phone {
        color: #999;
        font-size: 14px;
      }
    }
    .car {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px dashed #e9e9e9;
      margin-top: 16px;
      padding-top: 16px;
      .number {
        padding: 3px 7px;
        font-weight: 600;
        font-size: 15px;
        border-radius: 4px;
        background: #f5f5f5;
      }
    }
  }

  .comment_boxes {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 10px;

    .comment_box {
      width: 76px;
      background-color: inherit;

      .comment_img {
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0px 0px 12px -2px rgba(0, 0, 0, 0.12);
        border-radius: 6px;
        width: 100%;
        height: 62px;

        img {
          width: 80%;
          object-fit: cover;
        }
      }

      p {
        display: inline-block;
        font-size: 10px !important;
        font-weight: 600;
        color: #000;
        width: 100%;
        white-space: nowrap;
        overflow: hidden !important;
        text-overflow: ellipsis;
      }
    }
  }
`;
