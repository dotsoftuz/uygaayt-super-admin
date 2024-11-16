import { Button } from "@mui/material";
import React, { FC } from "react";
import { HeaderStyled } from "./ComHeader.style";
import FilterIcon from "./assets/FilterIcon";
import VectorIcon from "./assets/VectorIcon";

interface IHeader {
  title: string;
  btnTitle?: string;
  isFilter?: boolean;
}
const ComHeader: FC<IHeader> = ({ title, btnTitle, isFilter, ...props }) => {
  return (
    <HeaderStyled>
      <h2>{title}</h2>
      <div className="header-btn-content">
        {isFilter && (
          <Button className="header-filter">
            <div className={true && "devider-filter-box"}>
              <FilterIcon />
              Filter
            </div>
            <VectorIcon />
          </Button>
        )}
        {btnTitle && <Button>{btnTitle}</Button>}
      </div>
    </HeaderStyled>
  );
};

export default ComHeader;
