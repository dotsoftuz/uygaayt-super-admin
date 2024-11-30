import { FC } from "react";

import { LabelStyled } from "./Label.style";
import { LabelPropsType } from "./Label.types";

const Label: FC<LabelPropsType> = ({ label }) => {
  return <LabelStyled>{label}</LabelStyled>;
};

export default Label;
