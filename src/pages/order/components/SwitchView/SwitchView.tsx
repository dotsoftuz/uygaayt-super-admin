import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { HorizontalIcon, VerticalIcon } from "assets/svgs";
import { useLocation, useNavigate } from "react-router-dom";
import { getLastUrl } from "utils";
import { SwitchViewStyled } from "./SwitchView.styled";

export type TOrderView = "table" | "board";

const SwitchView: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: TOrderView
  ) => {
    if (newAlignment) {
      navigate(`/order/${newAlignment}`);
    }
  };

  return (
    <SwitchViewStyled path={getLastUrl(pathname)}>
      <ToggleButtonGroup
        color="primary"
        value={getLastUrl(pathname)}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton
          value="table"
          className={getLastUrl(pathname) === "table" ? "active" : ""}
        >
          <HorizontalIcon />
        </ToggleButton>
        <ToggleButton
          value="board"
          className={getLastUrl(pathname) === "board" ? "active" : ""}
        >
          <VerticalIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </SwitchViewStyled>
  );
};
export default SwitchView;
