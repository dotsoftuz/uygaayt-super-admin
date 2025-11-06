import { GridColumns } from "@mui/x-data-grid";
import { Tooltip } from "antd";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { numberFormat } from "utils/numberFormat";
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
      field: "ID",
      headerName: "ID",
      width: 100,
      renderCell({ row }) {
        return get(row, "_id", "").slice(-4) || get(row, "id", "");
      },
    },
    {
      field: t("common.name"),
      headerName: "Do'kon nomi",
      flex: 1,
      minWidth: 200,
      renderCell({ row }) {
        const name = get(row, "name", "");
        const truncatedName = name?.length > 30 ? `${name.substring(0, 30)}...` : name;
        return (
          <Tooltip title={name} arrow>
            <span>{truncatedName}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "category",
      headerName: "Kategoriya",
      flex: 1,
      minWidth: 150,
      renderCell({ row }) {
        return get(row, "category", "") || get(row, "type", "") || "-";
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell({ row }) {
        const isActive = get(row, "isActive", false);
        return (
          <Chip
            label={isActive ? "✅ Faol" : "🟥 Nofaol"}
            color={isActive ? "success" : "error"}
            size="small"
            sx={{
              fontWeight: 600,
            }}
          />
        );
      },
    },
    {
      field: "orders",
      headerName: "Buyurtmalar",
      width: 120,
      renderCell({ row }) {
        return numberFormat(get(row, "totalOrders", 0) || get(row, "ordersCount", 0));
      },
    },
    {
      field: "revenue",
      headerName: "Daromad (so'm)",
      width: 150,
      renderCell({ row }) {
        const revenue = get(row, "totalRevenue", 0) || get(row, "revenue", 0) || 0;
        return numberFormat(revenue);
      },
    },
    {
      field: "actions",
      headerName: "Amal",
      width: 120,
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
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ color: "#EB5B00" }}
      >
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

