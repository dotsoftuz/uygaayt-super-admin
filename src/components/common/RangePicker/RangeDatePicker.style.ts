import styled from "styled-components";

export const RangeDatePickerStyled = styled.div`
  .ant-picker {
    width: 100%;
    min-width: 220px;
    max-height: 48px;
    height: 48px;
    background-color: #f5f5f5;
    border-radius: 12px;
    border: none;
    box-shadow: none;
    margin: auto !important;

    input {
      font-size: 12px;
    }
  }

  .ant-picker-dropdown {
    max-width: 100%; 
    overflow-x: auto;
  }
  @media (max-width: 768px) {
  .ant-picker-panels{
    overflow-x: auto;
    width: 250px;
  }
  }
  @media (max-width: 768px) {
    .ant-picker-dropdown {
      left: 0 !important; 
      right: 0 !important;
      margin: 0 auto !important;
    }
  }

  @media (max-width: 768px) {

    .ant-picker-input input {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {

    .ant-picker-input input {
      font-size: 10px;
    }
  }
`;
