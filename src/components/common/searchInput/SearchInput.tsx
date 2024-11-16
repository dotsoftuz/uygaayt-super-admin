import React, { useRef } from "react";
import { SearchInputStyled } from "./SearchInput.styled";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import { useMediaQuery, useTheme } from "@mui/material";

interface ISearchInput {
  value?: string;
  onChange: any;
}

const SearchInput: React.FC<ISearchInput> = ({ onChange, value = "" }) => {
  const ref = useRef<HTMLInputElement>(null);

  const { t } = useTranslation();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <SearchInputStyled>
      <div className="search-box">
        <label htmlFor="my-input">
          <button className="btn-search">
            <SearchIcon />
          </button>
        </label>
        <input
          type="text"
          className="input-search"
          placeholder={t("PAGES_TITLE.SEARCHING")!}
          id="my-input"
          aria-labelledby="my-input"
          value={value}
          onChange={onChange}
          autoFocus={matches}
        />
      </div>
    </SearchInputStyled>
  );
};

export default SearchInput;
