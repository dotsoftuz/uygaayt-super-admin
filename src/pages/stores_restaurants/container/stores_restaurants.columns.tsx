import { GridColumns } from "@mui/x-data-grid";
import { Tooltip } from "antd";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { Chip, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

export const useStoresRestaurantsColumns = (
  onView?: (row: any) => void,
  onEdit?: (row: any) => void,
  onDelete?: (row: any) => void,
  onActivate?: (row: any) => void
): GridColumns => {
  const { t } = useTranslation();

  return [
    {
      field: t("common.name"),
      headerName: "Do'kon nomi",
      flex: 1,
      minWidth: 250,
      renderCell({ row }) {
        const name = get(row, "name", "");
        const truncatedName =
          name?.length > 40 ? `${name.substring(0, 40)}...` : name;
        return (
          <Tooltip title={name} arrow>
            <span style={{ fontWeight: 500 }}>{truncatedName}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "type",
      headerName: "Turi",
      width: 130,
      renderCell({ row }) {
        const type = get(row, "type", "");
        const categoryId = get(row, "categoryId", "");
        const category = get(row, "category", "");
        
        let categoryName = "";
        let color = "#6B7280";

        if (type === "shop" || categoryId === "store" || category === "Do'kon") {
          categoryName = "Do'kon";
          color = "#10B981";
        } else if (type === "restaurant" || categoryId === "restaurant" || category === "Restoran") {
          categoryName = "Restoran";
          color = "#EF4444";
        } else {
          categoryName = type || category || "-";
        }

        return (
          <Chip
            label={categoryName}
            sx={{
              backgroundColor: color,
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
            size="small"
          />
        );
      },
    },
    {
      field: "phoneNumber",
      headerName: "Telefon",
      width: 150,
      renderCell({ row }) {
        const phone = get(row, "phoneNumber", "-");
        return (
          <Tooltip title={phone} arrow>
            <span>{phone}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell({ row }) {
        const isActive = get(row, "isActive", false);
        const isInReview = !isActive && get(row, "isInReview", false);

        let label = "Nofaol";
        let color: "success" | "error" | "warning" = "error";

        if (isActive) {
          label = "Faol";
          color = "success";
        } else if (isInReview) {
          label = "Tekshiruvda";
          color = "warning";
        }

        return (
          <Chip
            label={label}
            color={color}
            size="small"
            sx={{
              fontWeight: 600,
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Amal",
      width: 100,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell({ row }) {
        return (
          <ActionMenu
            row={row}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onActivate={onActivate}
          />
        );
      },
    },
  ];
};

const ActionMenu = ({
  row,
  onView,
  onEdit,
  onDelete,
  onActivate,
}: {
  row: any;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onActivate?: (row: any) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small" sx={{ color: "#EB5B00" }}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        {onView && (
          <MenuItem onClick={() => handleAction(() => onView(row))}>
            👁 Ko'rish
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem onClick={() => handleAction(() => onEdit(row))}>
            ✏️ Tahrir
          </MenuItem>
        )}
        {!row.isActive && onActivate && (
          <MenuItem onClick={() => handleAction(() => onActivate(row))}>
            ➕ Aktivlashtirish
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={() => handleAction(() => onDelete(row))}>
            🗑 O'chirish
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
