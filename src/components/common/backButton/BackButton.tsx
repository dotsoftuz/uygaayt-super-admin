import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeftSharp";
import { IconButton } from "@mui/material";
import { BackStyled } from "./BackStyle.style";

const BackButton = ({ to, onBack }: { to?: string; onBack?: () => void }) => {
  const navigate = useNavigate();
  return (
    <BackStyled>
      <IconButton
        onClick={() => {
          onBack?.();
          // @ts-ignore
          navigate(to || -1);
        }}
        className="back_btn"
      >
        <ChevronLeftIcon className="icon" />
      </IconButton>
    </BackStyled>
  );
};

export default BackButton;
