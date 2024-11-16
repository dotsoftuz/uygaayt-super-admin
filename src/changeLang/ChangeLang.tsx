import { Button, MenuItem } from "@mui/material";
import { MenuLangItemStyled } from "components/shared/navbar/Navbar.style";
import Arrow from "components/shared/navbar/assets/Arrow";
import RuIcon from "components/shared/navbar/assets/RuIcon";
import UzIcon from "components/shared/navbar/assets/UzIcon";
import React, { useState } from "react";
import { LANGUAGES } from "./ChangeLang.const";
import { useTranslation } from "react-i18next";

const ChangeLang = () => {
  const { i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelectLang = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const selectedLang = event.target.getAttribute("data-language");
    i18n.changeLanguage(selectedLang);

    setAnchorEl(null);
  };

  return (
    <div className="language_content">
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className={anchorEl ? "language_button active" : "language_button"}
      >
        <div>
          {localStorage.getItem("i18nextLng") === "ru" && <RuIcon />}
          {localStorage.getItem("i18nextLng") === "uz" && <UzIcon />}

          <span>
            {localStorage.getItem("i18nextLng") === "ru" ? "RUS" : "UZB"}
          </span>
        </div>
        <div className="icon">
          <Arrow />
        </div>
      </Button>
      <MenuLangItemStyled
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {localStorage.getItem("i18nextLng") === "ru" && (
          <MenuItem onClick={handleSelectLang} data-language={LANGUAGES.uz}>
            <div className="lang_box" data-language={LANGUAGES.uz}>
              <UzIcon data-language={LANGUAGES.uz} />
              <span data-language={LANGUAGES.uz}>UZB</span>
            </div>
            <div className="icon"></div>
          </MenuItem>
        )}

        {localStorage.getItem("i18nextLng") === "uz" && (
          <MenuItem onClick={handleSelectLang} data-language={LANGUAGES.ru}>
            <div className="lang_box" data-language={LANGUAGES.ru}>
              <RuIcon data-language={LANGUAGES.uz} />
              <span data-language={LANGUAGES.ru}>RUS</span>
            </div>
            <div className="icon"></div>
          </MenuItem>
        )}
      </MenuLangItemStyled>
    </div>
  );
};

export default ChangeLang;
