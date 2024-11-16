import styled from "styled-components";

export const AddOrderFormStyled = styled.div`
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
  padding: 16px;
  max-height: calc(100vh - 110px);
  overflow: auto;
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    .key {
      font-size: 14px;
    }
    .value {
      font-size: 14px;
      font-weight: 600;
    }
    &:last-of-type {
      .key {
        font-weight: 600;
      }
    }
  }
  .submit-btn {
    width: 100%;
  }
`;

export const AddressModalStyled = styled.div`
  width: 860px;
  height: 500px;
  background-color: #fff;
  border-radius: 24px;
  overflow: hidden;
  .modal-form {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px;
    .title {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      h2 {
        font-size: 20px;
        font-weight: 600;
        margin-left: 23px;
      }
    }
    .address-options {
      position: absolute;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
      padding: 10px 0;
      border-radius: 10px;
      background-color: #fff;
      max-height: 300px;
      overflow: auto;
      z-index: 1;
      .option {
        padding: 8px 15px;
        cursor: pointer;
        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
    .save-btn {
      width: 100%;
      margin-top: auto;
    }
  }
`;
