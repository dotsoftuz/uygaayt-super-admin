import React from "react";
import Chip from "@mui/material/Chip";

interface ITableStatusItem {
  status: string | undefined;
  label?: string;
  statusColor?: string;
}

const TableStatusItem: React.FC<ITableStatusItem> = ({
  status,
  label,
  statusColor,
}) => {
  let color: string = "#ffffff";
  let background: string = statusColor || "#60699e67";
  switch (status as any) {
    case "completed":
    case "confirmed":
      background = "#239450";
      break;
    case "finished":
    case "new":
    case "created":
    case "approved":
      background = "#1DD767";
      break;
    case "inProgress":
    case "returned":
    case "InWarehouse":
      background = "#7D1EE0";
      break;
    case "waiting":
      background = "#E0AA1E";
      break;
    case "paid":
      background = "#006eff";
      break;
    case "cancelled":
    case "invalid":
    case "rejected":
      background = "#EB4141";
      break;
    default:
      break;
  }
  return (
    <Chip
      label={label || status || "berilmagan"}
      sx={{ color, background, fontWeight: 700, width: "120px" }}
    />
  );
};

export default TableStatusItem;
