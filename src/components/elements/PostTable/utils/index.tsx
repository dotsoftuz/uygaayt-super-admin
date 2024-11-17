import { GridColumns, GridLocaleText } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "../assets/EditIcon";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { DeleteIcon } from "assets/svgs";

export const getTableColumns = <TData extends { _id: string }>({
  numerate,
  columns,
  onEditColumn,
  onDeleteColumn,
  onSeenClick,
}: {
  numerate?: boolean;
  columns: GridColumns<any>;
  onEditColumn?: (props?: any) => void;
  onDeleteColumn?: (props?: any) => void;
  onSeenClick?: (props?: any) => void;
}): GridColumns<any> =>
  // @ts-ignore
  [
    numerate
      ? {
        field: "_number",
        headerName: "№",
        maxWidth: 60,
        align: "center",
        // sortable: false,
        filterable: false,
        headerAlign: "center",
        disableColumnMenu: true,
      }
      : undefined,
    ...columns,
    typeof onSeenClick === "function"
      ? {
        field: "_actions_seen",
        renderCell(row: any) {
          return (
            <IconButton
              onClick={(e) => {
                onSeenClick(row.row);
              }}
            >
              <RemoveRedEyeIcon style={{ color: "0F6FDF" }} />
            </IconButton>
          );
        },
        maxWidth: 40,
        align: "center",
        renderHeader: () => null,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
      }
      : undefined,
    typeof onEditColumn === "function"
      ? {
        field: "_actions_edit",
        renderCell(row: any) {
          return (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEditColumn(row.row);
              }}
            >
              <EditIcon />
            </IconButton>
          );
        },
        maxWidth: 40,
        align: "center",
        renderHeader: () => null,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
      }
      : undefined,
    typeof onDeleteColumn === "function"
      ? {
        field: "_actions_delete",
        renderCell(row: any) {
          return (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDeleteColumn(row.row);
              }}
            >
              <DeleteIcon />
            </IconButton>
          );
        },
        maxWidth: 40,
        align: "center",
        renderHeader: () => null,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
      }
      : undefined,
  ]
    .filter(Boolean) // get rid of undefined values
    .map((item) => ({
      disableColumnMenu: true,
      sortable: false,
      headerClassName: "table-header",
      // @ts-ignore
      flex: item?.flex ? item.flex : 1,
      // width: 150,
      ...item,
    }));

export const localization: Partial<GridLocaleText> = {
  // columnMenuUnsort: ...
};

// ? digits and letters allowed no special characters no more than 1 spaces
export const isValidSearch = (search: string) => true;
// /^(([a-z\d]+\s)?[a-z\d]+)?$/i.test(search);
