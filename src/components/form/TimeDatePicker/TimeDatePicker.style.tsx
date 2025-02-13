import styled from "@emotion/styled";

export const DateTimePickerStyled = styled.div`
  svg {
    fill: #EB5B00 !important;
  }
  position: relative;
  .MuiFormControl-root {
    width: 100%;
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
    color: red !important;
  }
  .MuiFormLabel-root {
  }
  .MuiInputBase-root {
    background: #fff;
    border-radius: 12px;
    padding-top: 0.5rem;
  }
  fieldset {
    border: none;
  }
  .MuiFormLabel-root[data-shrink="true"] {
    margin-top: 0.7rem;
  }
`;
