import styled from "styled-components";

export const AutoCompleteStyledMultiple = styled.div` //! @dangerous qolgan autocomplete lar ham stili shunda
  label {
    font-weight: 500;
    /* mask-type: ; */
    font-size: 14px;
    line-height: 16px;
    color: #32324d;
    padding: 5px 0;
    span {
      color: red;
    }
  }
  .MuiFormLabel-root {
    /* top: -8px !important; */
    /* margin-top: -5px !important; */
  }
  .MuiInputBase-root {
    /* height: 48px !important; */
    margin-top: 5px;
    padding: 0 60px 0 4px !important;
    height: 54px;
    background-color: #f5f5f5;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;

    .MuiOutlinedInput-notchedOutline {
      /* border: none; */
    }
  }
  h6.text-error {
    position: absolute;
    bottom: -18px;
  }
  position: relative;
`;
