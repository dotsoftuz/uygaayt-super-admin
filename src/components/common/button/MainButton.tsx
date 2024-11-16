import { StyledButton } from "./MainButton.style";
import { ButtonProps } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

// @ts-ignore
interface IButtonProps extends ButtonProps {
  fullWidth?: boolean;
  title?: string | React.ReactNode;
  loader?: boolean;
}

const MainButton: React.FC<IButtonProps> = ({
  title,
  loader = false,
  ...props
}) => {
  return (
    <StyledButton {...props} endIcon={loader && <CircularProgress size={25} />}>
      {title}
    </StyledButton>
  );
};

export default MainButton;
