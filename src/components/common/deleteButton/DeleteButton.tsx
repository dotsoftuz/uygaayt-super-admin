import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Grid } from "@mui/material";
import { MainButton, Modal } from "components";
import { useState } from "react";

interface IProps {
  onclickHandler: () => void;
  sx?: Object;
}

const DeleteButton = ({ onclickHandler, sx }: IProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        className="delete-button"
        sx={{
          padding: "0 !important",
          width: "40px !important",
          height: "40px",
          minWidth: "auto",
          borderRadius: "50%",
          ...sx,
        }}
        variant="outlined"
        color="error"
        type="button"
      >
        <DeleteIcon />
      </Button>
      <Modal open={open} setOpen={setOpen} onClose={() => setOpen(false)}>
        <Grid
          container
          display="flex"
          sx={{
            backgroundColor: "white",
            padding: "5rem",
            borderRadius: 12,
            width: 600,
            height: 300,
            textAlign: "center",
          }}
        >
          <h1>Rostdan ham o'chirishni xohlaysizmi</h1>
          <Grid item md={6} marginTop={2}>
            <MainButton
              onClick={() => setOpen(false)}
              color="primary"
              title="Qoldirish"
              variant="contained"
            />
          </Grid>
          <Grid item md={6} marginTop={2}>
            <MainButton
              onClick={onclickHandler}
              color="error"
              // variant="contained"
              title="O'chirish"
            />
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default DeleteButton;
