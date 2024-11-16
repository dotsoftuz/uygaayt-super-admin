import styled from "styled-components";

export const DateTimePickerStyled = styled.div`
  position: relative;
  .MuiFormControl-root {
    border: 1px solid #d9d9d9;
    border-radius: 10px;
    background-color: #fff;
    input {
      padding: 12px 14px;
    }
  }
  .text-error {
    bottom: -10;
    position: absolute;
  }
`;
