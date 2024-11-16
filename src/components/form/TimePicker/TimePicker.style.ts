import styled from "styled-components";

export const TimePickerStyled = styled("div")`
  border: 1px solid;
  border-color: "grey" !important;
  outline: none;
`;

export const TimePickerContainer = styled("div")`
  .react-time-picker {
    width: 100%;
    .react-time-picker__wrapper {
      width: 100%;
      border-radius: 8px;
      border: 1px solid #d9d9d9;
      box-sizing: border-box;
      color: #333333 !important;
      padding: 9px 16px;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.02em;
      outline: none;
      font-weight: 500;
      transition: all 0.1s ease-out;
      font-weight: 500;
      transition: 0.2s ease all;
      .react-time-picker__inputGroup {
        input {
          outline-color: #949494;
        }
      }
    }
    .react-time-picker__clock {
      display: none;
    }
  }
`;
