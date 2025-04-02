import { ButtonStyled, IconButtonStyled } from "./ButtonStyled";
import { ButtonProps, CircularProgress } from "@mui/material";

interface ICommonButton extends ButtonProps {
  title?: string;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  icon?: React.ReactNode;
  iconButton?: boolean;
  status?: string;
}

const CommonButton: React.FC<ICommonButton> = ({
  endIcon,
  startIcon,
  icon,
  title,
  status,
  iconButton = false,
  ...props
}) => {
  return (
    <>
      {!iconButton ? (
        <ButtonStyled {...props} startIcon={startIcon} endIcon={endIcon}>
           {status === "loading" && (
            <CircularProgress size={20} sx={{ marginRight: "12px" }} />
          )}
          {title && <span>{title}</span>}
        </ButtonStyled>
      ) : (
        <IconButtonStyled {...props}>{icon}</IconButtonStyled>
      )}
    </>
  );
};

export default CommonButton;
