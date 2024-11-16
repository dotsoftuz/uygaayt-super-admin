import React from "react";
import { CommonLoaderStyled } from "./CommonLoader.style";

const CommonLoader = () => {
  return (
    <CommonLoaderStyled>
      <span className="loader"></span>
    </CommonLoaderStyled>
  );
};

export default CommonLoader;
