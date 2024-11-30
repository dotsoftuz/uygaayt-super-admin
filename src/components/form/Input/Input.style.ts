import styled from "styled-components";

export const StyledInput = styled.input`
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  width: 100%;
  color: gray;
  padding: 13px;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  margin-top: 3px;
  outline: none;
  transition: all 300ms ease-out;
  &::placeholder {
    color: gray;
  }
  &.error {
    border-color: red;
  }
`;
