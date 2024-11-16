import styled from "styled-components";
type IStyled = { fullWidth: boolean };

export const CheckboxStyled = styled.div<IStyled>`
  padding: 0px 10px;
  height: 47px;
  background-color: #fff !important;
  border-radius: 10px !important;
  color: black !important;
  text-transform: capitalize !important;
  justify-content: flex-start !important;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  label {
    cursor: pointer;
    color: #333;
  }
`;
