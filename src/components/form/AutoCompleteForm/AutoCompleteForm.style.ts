import styled from "styled-components";

export const AutoCompleteStyled = styled.div`
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
    height: 45px !important;
    background-color: #fff;
    display: flex;
    justify-content: center;
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
    /* border: 1px solid #d9d9d9 !important; */
    transition: all 0.3s ease;
  }
`;
