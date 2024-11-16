import styled from "styled-components";

interface ITextInputStyled {
  isError?: boolean;
  searchIcon?: boolean;
}

export const TextInputStyled = styled.div<ITextInputStyled>`
  position: relative;
  display: flex;
  flex-direction: column;
  label {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #32324d;
    padding: 5px 0;
    span {
      color: red;
    }
  }
  .search-icon {
    position: absolute;
    right: 12px;
    bottom: 10px;
    z-index: 1;
  }
  input {
    height: 45px !important;
    padding: ${({ searchIcon }) => (searchIcon ? "0 40px 0 12px" : "0 12px")};
    border: none;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    background-color: #fff;

    &::placeholder {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #8e8ea9;
    }
  }
  h6 {
    position: absolute;
    bottom: -18px;
  }
  .MuiFormControl-root {
    min-height: 45px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #d9d9d9;
  }
`;
