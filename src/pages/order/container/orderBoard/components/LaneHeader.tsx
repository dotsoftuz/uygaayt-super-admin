import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const LaneHeader = (lane: any, laneDelete: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="d-flex justify-content-between align-items-center lane_title">
      <h3>{lane.title}</h3>
      <div>
        {lane.cards?.length === 0 ? (
          <>
            <IconButton
              aria-owns={anchorEl ? "simple-menu" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              {/* <DeleteIcon style={{ color: "red" }} /> */}
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  laneDelete({
                    ids: [lane?.id],
                  });
                  lane.onDelete(lane?.id);
                  handleClose();
                }}
              >
                Statusni o'chirish
              </MenuItem>
            </Menu>
          </>
        ) : (
          " "
        )}
      </div>
    </div>
  );
};

export default LaneHeader;
