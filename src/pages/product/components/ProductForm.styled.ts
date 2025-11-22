import styled from "styled-components";

export const ProductFormStyled = styled.div`
  width: 100%;
  
  form {
    width: 100%;
  }
  
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

export const ImportStudentStyle = styled.div`
  h2 {
    color: black;
  }
  h4 {
    color: black;
  }
  .import-student-box {
    width: 100%;

    label {
      width: max-content;
      min-height: max-content !important;
      display: flex;
      align-items: center;
      gap: 20px;
      border-radius: 10px;
      transition: all 0.3s ease;
      margin: 0 auto;
      padding: 12px;
      color: black;

      .upload-input {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        opacity: 0 !important;
        z-index: -1 !important;
      }

      &:hover {
        background-color: gray;
      }
    }
  }
  .errors-upload {
    margin-bottom: 12px;
    .content {
      width: 100%;
      padding: 10px;
      background-color: gray;
      border-radius: 6px;
      max-height: 400px;
      overflow: auto;
    }
  }
`;
