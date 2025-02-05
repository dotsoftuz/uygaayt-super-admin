import styled from "styled-components";

export const AutoCompleteStyled = styled.div<any>`
  //! @dangerous qolgan autocomplete lar ham stili shunda
  label {
    display: block;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #32324d;
    padding: 5px 0 !important;
    span {
      color: red;
    }
  }
  .MuiFormControl-root {
    border: 1px solid #d9d9d9 !important;
    border-radius: 10px;
  }
  .MuiInputBase-root {
    border-radius: 10px;
    padding: 0 60px 0 4px !important;
    background-color: #fff;
    display: flex;
    justify-content: center;
    height: ${({ multiple }) => (multiple ? "auto" : "45px !important")};
    min-height: 45px;
    align-items: center;
    border: none !important;
    .MuiOutlinedInput-input {
      padding-left: 1rem !important;
    }
  }
  h6.text-error {
    position: absolute;
    bottom: -18px;
  }
  position: relative;
  .MuiOutlinedInput-root {
    transition: all 0.3s ease;
    .MuiChip-root {
      width: ${({ multiple }) => (multiple ? "150px" : "")};
    }
  }
`;
