import { DefaultPage } from "assets/svgs";
import { DefaultPageStyled } from "./DefaultPage.style";

import Logo from "assets/images/uygaayt.jpg"

const BLACK_PAGE = () => {
  return (
    <DefaultPageStyled>
      <img src={Logo} alt="" />
      <p>Pulingizni va vaqtingizni tejang!</p>
    </DefaultPageStyled>
  );
};

export default BLACK_PAGE;
