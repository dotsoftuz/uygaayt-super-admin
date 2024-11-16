import { Tooltip } from "@mui/material";
import React, { FC } from "react";

interface TooltipType {
  title: string;
}

const TooltipBox: FC<TooltipType> = ({ title }) => {
  return (
    <Tooltip
      title={title}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "#2A3042",
            fontSize: "16px",
            "& .MuiTooltip-arrow": {
              color: "#2A3042",
            },
          },
        },
      }}
    >
      <div>{title?.length > 18 ? title?.slice(0, 20) + "..." : title}</div>
    </Tooltip>
  );
};

export default TooltipBox;
