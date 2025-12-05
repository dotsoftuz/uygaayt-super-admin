import { GridColumns } from "@mui/x-data-grid";
import { Chip, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { get } from "lodash";
import { useTranslation } from "react-i18next";

export const useReviewColumns = (
  onToggleVisibility?: (row: any) => void
): GridColumns => {
  const { t } = useTranslation();

  return [
    {
      field: t("common.customer"),
      flex: 1.2,
      renderCell({ row }) {
        const firstName = get(row, "customer.firstName", "");
        const lastName = get(row, "customer.lastName", "");
        const phoneNumber = get(row, "customer.phoneNumber", "");
        const fullName = `${firstName} ${lastName}`.trim() || "Mijoz";
        
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{fullName}</div>
            {phoneNumber && (
              <div style={{ fontSize: "12px", color: "#6b7280" }}>{phoneNumber}</div>
            )}
          </div>
        );
      },
    },
    {
      field: t("common.rating"),
      width: 150,
      renderCell({ row }) {
        const rating = get(row, "rating", 0);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
              <span
                key={star}
                style={{
                  color: star <= rating ? "#fbbf24" : "#d1d5db",
                  fontSize: "16px",
                }}
              >
                ★
              </span>
            ))}
            <span style={{ marginLeft: "4px", fontSize: "14px", fontWeight: 500 }}>
              {rating}
            </span>
          </div>
        );
      },
    },
    {
      field: t("common.comment"),
      flex: 1.5,
      renderCell({ row }) {
        const comment = get(row, "comment", "");
        const truncatedComment = comment?.length > 50 
          ? `${comment.substring(0, 50)}...` 
          : comment || "-";
        
        return (
          <Tooltip title={comment || ""} arrow>
            <span style={{ fontSize: "14px" }}>{truncatedComment}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "store",
      headerName: "Do'kon",
      flex: 1,
      renderCell({ row }) {
        const storeName = get(row, "store.name", "");
        const storeId = get(row, "storeId", "");
        
        if (storeId === "uygaayt") {
          return "Uygaayt Market";
        }
        
        return storeName || storeId || "-";
      },
    },
    {
      field: "order",
      headerName: "Buyurtma",
      width: 120,
      renderCell({ row }) {
        const orderNumber = get(row, "order.number", "");
        return orderNumber ? `#${orderNumber}` : "-";
      },
    },
    {
      field: "product",
      headerName: "Mahsulot",
      flex: 1,
      renderCell({ row }) {
        const productName = get(row, "product.name", "");
        if (!productName) return "-";
        
        const name = typeof productName === "object" 
          ? productName.uz || productName.ru || productName.en 
          : productName;
        
        return name || "-";
      },
    },
    {
      field: t("common.status"),
      width: 120,
      renderCell({ row }) {
        const isVisible = get(row, "isVisible", true);
        return (
          <Chip
            label={isVisible ? "Ko'rinadi" : "Yashirilgan"}
            color={isVisible ? "success" : "default"}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      field: t("common.date"),
      width: 180,
      renderCell({ row }) {
        return dayjs(get(row, "createdAt", "")).format("DD.MM.YYYY HH:mm");
      },
    },
    {
      field: "actions",
      headerName: "Amal",
      width: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell({ row }) {
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleVisibility) {
                  onToggleVisibility(row);
                }
              }}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                borderRadius: "4px",
                border: "1px solid #e5e7eb",
                background: "white",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "white";
              }}
            >
              {get(row, "isVisible", true) ? "Yashirish" : "Ko'rsatish"}
            </button>
          </div>
        );
      },
    },
  ];
};

