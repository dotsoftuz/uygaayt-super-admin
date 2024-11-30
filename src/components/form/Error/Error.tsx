import { FC } from "react";
import { ErrorMessageStyled } from "./Error.style";
import { ErrorPropsType } from "./Error.types";

const Error: FC<ErrorPropsType> = ({ message }) => {
  return <ErrorMessageStyled>{message}</ErrorMessageStyled>;
};

export default Error;
