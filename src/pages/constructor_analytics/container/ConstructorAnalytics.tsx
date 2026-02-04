import React, { useEffect, useState } from "react";
import { useApi } from "hooks/useApi/useApiHooks";
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const ConstructorAnalytics = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[][]>([]);
  const [tableRowLabels, setTableRowLabels] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const [elementsByGroup, setElementsByGroup] = useState<{
    available: { id: string; label: string }[];
    rows: { id: string; label: string }[];
    columns: { id: string; label: string }[];
    filters: { id: string; label: string }[];
    extras: { id: string; label: string }[];
  }>({
    available: [
      { id: "orders", label: "Buyurtmalar" },
      { id: "customers", label: "Mijozlar" },
      { id: "products", label: "Mahsulotlar" },
      { id: "couriers", label: "Kuryerlar" },
      { id: "categories", label: "Kategoriyalar" },
      { id: "stores-restaurants", label: "Do'konlar va Restoranlar" },
      { id: "employees", label: "Xodimlar" },
      { id: "date", label: "Sana" },
      { id: "salePrice", label: "Summa" },
      { id: "price", label: "Narx" },
    ],
    rows: [],
    columns: [],
    filters: [],
    extras: [],
  });

  const baseURL = process.env.REACT_APP_BASE_URL || "http://165.227.153.9/v1";
  const apiEndpoint = "order/list";
  const fullURL = `${baseURL}/${apiEndpoint}`;

  const { data, status, refetch } = useApi(
    apiEndpoint,
    {},
    {
      suspense: false,
    }
  );

  const { data: productsData, status: productsStatus } = useApi(
    "product/list",
    {},
    { suspense: false }
  );

  const { data: orderItemData, status: orderItemStatus } = useApi(
    "order-item/list",
    {},
    { suspense: false }
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (status === "success" && data?.data) {
      const ordersData = data.data.data || data.data || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    }
  }, [data, status]);

  useEffect(() => {
    if (productsStatus === "success" && productsData?.data) {
      const products = productsData.data?.data ?? productsData.data ?? [];
    }
  }, [productsStatus, productsData]);

  useEffect(() => {
    if (orderItemStatus === "success" && orderItemData?.data) {
      const items = orderItemData.data?.data ?? orderItemData.data ?? [];
    }
  }, [orderItemStatus, orderItemData]);

  const handleDragStart =
    (fromKey: keyof typeof elementsByGroup, itemId: string) =>
    (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData(
        "application/json",
        JSON.stringify({ fromKey, itemId })
      );
      event.dataTransfer.effectAllowed = "move";
    };

  const handleDrop =
    (toKey: keyof typeof elementsByGroup, dropIndex?: number) =>
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData("application/json");
      if (!raw) return;

      try {
        const { fromKey, itemId } = JSON.parse(raw) as {
          fromKey: keyof typeof elementsByGroup;
          itemId: string;
        };

        if (!fromKey || !itemId) return;

        setElementsByGroup((prev) => {
          const sourceList = prev[fromKey] || [];
          const targetList = prev[toKey] || [];

          const item = sourceList.find((el) => el.id === itemId);
          if (!item) return prev;

          if (fromKey === toKey) {
            const currentIndex = sourceList.findIndex((el) => el.id === itemId);
            if (currentIndex === -1) return prev;

            if (dropIndex !== undefined) {
              if (dropIndex === currentIndex) {
                return prev;
              }

              if (dropIndex === currentIndex + 1) {
                return prev;
              }

              const newList = [...sourceList];
              newList.splice(currentIndex, 1);
        
              let insertIndex = dropIndex;
              if (dropIndex > currentIndex) {
                insertIndex = dropIndex - 1;
              }
              
              newList.splice(insertIndex, 0, item);

              return {
                ...prev,
                [toKey]: newList,
              };
            }
            // Agar dropIndex undefined bo'lsa, o'zgartirish yo'q
            return prev;
          }

          // Turli kartalar orasida ko'chirish
          // Agar dropIndex berilgan bo'lsa, uni ishlatamiz
          if (dropIndex !== undefined) {
            const newTargetList = [...targetList];
            newTargetList.splice(dropIndex, 0, item);
            return {
              ...prev,
              [fromKey]: sourceList.filter((el) => el.id !== itemId),
              [toKey]: newTargetList,
            };
          }
          
          // Agar dropIndex berilmagan bo'lsa, oxiriga qo'shamiz
          return {
            ...prev,
            [fromKey]: sourceList.filter((el) => el.id !== itemId),
            [toKey]: [...targetList, item],
          };
        });
      } catch {
        // ignore invalid payload
      }
    };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleClearAll = () => {
    setElementsByGroup((prev) => {
      const allMoved = [
        ...prev.rows,
        ...prev.columns,
        ...prev.filters,
        ...prev.extras,
      ];
      const existingIds = new Set(prev.available.map((el) => el.id));
      const toAdd = allMoved.filter((el) => !existingIds.has(el.id));
      return {
        ...prev,
        rows: [],
        columns: [],
        filters: [],
        extras: [],
        available: [...prev.available, ...toAdd],
      };
    });
    setTableData([]);
    setTableRowLabels([]);
  };

  const handleRemoveElement = (
    fromKey: keyof typeof elementsByGroup,
    itemId: string
  ) => {
    setElementsByGroup((prev) => {
      const sourceList = prev[fromKey] || [];
      const item = sourceList.find((el) => el.id === itemId);
      
      // Agar element topilmasa yoki "available" dan o'chirilayotgan bo'lsa, faqat o'chiramiz
      if (!item || fromKey === "available") {
        return {
          ...prev,
          [fromKey]: sourceList.filter((el) => el.id !== itemId),
        };
      }

      // Boshqa kartalardan o'chirilganda, elementni "available" ro'yxatiga qaytaramiz
      // Lekin agar element allaqachon "available" da bo'lsa, qayta qo'shmaslik kerak
      const isAlreadyInAvailable = prev.available.some((el) => el.id === itemId);
      if (isAlreadyInAvailable) {
        return {
          ...prev,
          [fromKey]: sourceList.filter((el) => el.id !== itemId),
        };
      }

      return {
        ...prev,
        [fromKey]: sourceList.filter((el) => el.id !== itemId),
        available: [...prev.available, item],
      };
    });
  };

  const renderElement = (
    item: { id: string; label: string },
    fromKey: keyof typeof elementsByGroup,
    showDelete: boolean = true
  ) => (
    <Box
      key={item.id}
      draggable
      onDragStart={handleDragStart(fromKey, item.id)}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      sx={{
        p: 1.5,
        borderRadius: 1,
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "&:hover": {
          backgroundColor: "#f9fafb",
        },
      }}
    >
      <Typography variant="body2">{item.label}</Typography>
      {showDelete && fromKey !== "available" && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveElement(fromKey, item.id);
          }}
          sx={{
            p: 0.5,
            "&:hover": {
              backgroundColor: "#fee2e2",
              color: "#dc2626",
            },
          }}
        >
          <Delete sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>
  );

  const renderElementsList = (
    items: { id: string; label: string }[],
    fromKey: keyof typeof elementsByGroup,
    showDelete: boolean = true
  ) => {
    return (
      <>
        {/* Drop zone before first element */}
        {items.length > 0 && (
          <Box
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDragOver(e);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDrop(fromKey, 0)(e);
            }}
            sx={{
              minHeight: "8px",
              borderRadius: 1,
              transition: "background-color 0.2s",
              marginBottom: "4px",
              "&:hover": {
                backgroundColor: fromKey !== "available" ? "#dbeafe" : "transparent",
                minHeight: "12px",
              },
            }}
          />
        )}
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <Box sx={{ mb: 1 }}>
              {renderElement(item, fromKey, showDelete)}
            </Box>
            {/* Drop zone after each element */}
            <Box
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDragOver(e);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDrop(fromKey, index + 1)(e);
              }}
              sx={{
                minHeight: "8px",
                borderRadius: 1,
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: fromKey !== "available" ? "#dbeafe" : "transparent",
                  minHeight: "12px",
                },
              }}
            />
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const hasOrdersInRows = elementsByGroup.rows.some((r) => r.id === "orders");
            const hasOrdersInColumns = elementsByGroup.columns.some((c) => c.id === "orders");
            const hasProductsInRows = elementsByGroup.rows.some((r) => r.id === "products");
            const hasSalePriceInColumns = elementsByGroup.columns.some((c) => c.id === "salePrice");
            const hasPriceInColumns = elementsByGroup.columns.some((c) => c.id === "price");
            const hasDateFilter = elementsByGroup.filters.some((f) => f.id === "date") && (dateFrom || dateTo);

            // Sana filtri: sana oralig'ida bo'lishi kerak
            const isDateInRange = (dateStr: string | undefined) => {
              if (!dateStr) return false;
              const d = new Date(dateStr).getTime();
              if (dateFrom && d < new Date(dateFrom + "T00:00:00").getTime()) return false;
              if (dateTo && d > new Date(dateTo + "T23:59:59").getTime()) return false;
              return true;
            };

            // Sana tanlangan bo'lsa: buyurtmalarni filtrlash
            const ordersFiltered = hasDateFilter
              ? orders.filter((o: any) => isDateInRange(o.createdAt ?? o.date ?? o.updatedAt))
              : orders;

            // Order-item larni faqat filtrlangan buyurtmalar bo'yicha (orderId orqali)
            const filteredOrderIds = new Set(ordersFiltered.map((o: any) => o._id ?? o.id).filter(Boolean));

            /* ======================================================
              1️⃣ MAHSULOTLAR + SALE PRICE / PRICE (JAMI NARX)
            ====================================================== */
            if (hasProductsInRows && (hasSalePriceInColumns || hasPriceInColumns)) {
              const rawProducts = productsData?.data;
              const productsList: any[] = Array.isArray(rawProducts)
                ? rawProducts
                : (rawProducts as any)?.data ?? [];

              const rawOrderItems = orderItemData?.data;
              const allOrderItems: any[] = Array.isArray(rawOrderItems)
                ? rawOrderItems
                : (rawOrderItems as any)?.data ?? [];

              const orderItemsList = hasDateFilter
                ? allOrderItems.filter(
                    (item: any) =>
                      filteredOrderIds.has(item.orderId?._id ?? item.orderId ?? item.order?._id)
                  )
                : allOrderItems;

              // Mahsulot ID bo'yicha: salePrice * amount (jami summa) va price yig'ish
              const sumByProductId: Record<
                string,
                { salePrice: number; price: number }
              > = {};

              orderItemsList.forEach((item: any) => {
                const pid =
                  item.productId?._id ??
                  item.productId ??
                  item.product?._id;

                if (!pid) return;

                // Nechta sotilgan: amount yoki quantity
                const quantity = Number(item.amount ?? item.quantity ?? 0);
                const unitPrice = Number(item.salePrice ?? item.price ?? 0);
                // Jami summa = sotilgan son × bitta narx
                const totalSalePrice = quantity * unitPrice;
                  

                if (!sumByProductId[pid]) {
                  sumByProductId[pid] = { salePrice: 0, price: 0 };
                }

                sumByProductId[pid].salePrice += totalSalePrice;
                sumByProductId[pid].price += Number(item.price ?? 0);
              });

              // Mahsulotlarga jami salePrice (salePrice×amount) va price qo'shish
              const productsWithSums = productsList.map((p: any) => {
                const pid = p._id ?? p.id;
                const sums = sumByProductId[pid] ?? { salePrice: 0, price: 0 };

                return {
                  ...p,
                  salePrice: sums.salePrice,
                  price: sums.price,
                };
              });
              console.log(productsWithSums);
              

              // Jadval ma’lumotlari
              const tableData: any[][] = productsWithSums.map((p: any) =>
                elementsByGroup.columns.map((col) => {
                  if (col.id === "salePrice") return p.salePrice;
                  if (col.id === "price") return p.price;
                  return "-";
                })
              );

              const rowLabels = productsWithSums.map(
                (p: any) => p.name ?? p.title ?? p._id ?? "—"
              );

              setTableRowLabels(rowLabels);
              setTableData(tableData);

              console.log("Mahsulotlar (API):", productsList);
              console.log("Order itemlar:", orderItemsList);
              console.log("Yig‘ilgan natija:", sumByProductId);
              console.log("Jadval:", tableData);

              return;
            }
            setTableRowLabels([]);

            if (hasOrdersInRows || hasOrdersInColumns) {
              const ordersList = ordersFiltered || [];

              // Buyurtmalar qator + summa ustun (salePrice ustunida buyurtma jami summasini ko'rsatamiz)
              if (hasOrdersInRows && hasSalePriceInColumns) {
                const data = ordersList.map((order: any) =>
                  elementsByGroup.columns.map((col) =>
                    col.id === "salePrice"
                      ? order.totalPrice ?? order.amount ?? order.sum ?? 0
                      : "-"
                  )
                );
                setTableData(data);
                return;
              }

              // Buyurtmalar qatorlarda
              if (hasOrdersInRows) {
                const data = ordersList.map((order: any) =>
                  elementsByGroup.columns.map((col) => {
                    switch (col.id) {
                      case "orders":
                        return order._id ?? "-";
                      case "customers":
                        return order.customerId?.name ?? "-";
                      case "products":
                        return order.products?.length ?? "-";
                      case "couriers":
                        return order.courierId?.firstName ?? "-";
                      case "stores-restaurants":
                        return order.storeId?.name ?? "-";
                      case "date":
                        return order.createdAt ?? "-";
                      case "salePrice":
                        return order.totalPrice ?? "-";
                      default:
                        return order[col.id] ?? "-";
                    }
                  })
                );
                setTableData(data);
                return;
              }

              // Buyurtmalar ustunlarda
              if (hasOrdersInColumns) {
                const data = elementsByGroup.rows.map((row) =>
                  ordersList.map((order: any) => {
                    switch (row.id) {
                      case "orders":
                        return order._id ?? "-";
                      case "customers":
                        return order.customerId?.name ?? "-";
                      case "products":
                        return order.products?.length ?? "-";
                      case "couriers":
                        return order.courierId?.firstName ?? "-";
                      case "stores-restaurants":
                        return order.storeId?.name ?? "-";
                      case "date":
                        return order.createdAt ?? "-";
                      case "salePrice":
                        return order.totalPrice ?? "-";
                      default:
                        return order[row.id] ?? "-";
                    }
                  })
                );
                setTableData(data);
                return;
              }
            }

            setTableData([]);
          }}
        >
          Ma'lumotlarni ko‘rish
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearAll}
        >
          Tozalash
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Paper
          elevation={2}
          sx={{
            width: "15%",
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "#F7FAFC",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            height: "calc(100vh - 120px)",
            overflowY: "auto",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 0 }}
            onDragOver={handleDragOver}
            onDrop={handleDrop("available")}
          >
            {renderElementsList(elementsByGroup.available, "available", false)}
          </Box>
        </Paper>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "18%" }}>
          <Paper
            elevation={2}
            onDragOver={handleDragOver}
            onDrop={handleDrop("rows")}
            sx={{
              width: "100%",
              p: 3,
              borderRadius: 2,
              backgroundColor: "#F7FAFC",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              height: "45vh",
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Qatorlar
            </Typography>
            <Box
              sx={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: 0, 
                flex: 1,
                minHeight: 0,
                overflowY: "auto"
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop("rows")}
            >
              {renderElementsList(elementsByGroup.rows, "rows", true)}
            </Box>
          </Paper>
          <Paper
            elevation={2}
            onDragOver={handleDragOver}
            onDrop={handleDrop("columns")}
            sx={{
              width: "100%",
              p: 3,
              borderRadius: 2,
              backgroundColor: "#F7FAFC",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              height: "35vh",
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Ustunlar
            </Typography>
            <Box
              sx={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: 0, 
                flex: 1,
                minHeight: 0,
                overflowY: "auto"
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop("columns")}
            >
              {renderElementsList(elementsByGroup.columns, "columns", true)}
            </Box>
          </Paper>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "18%" }}>
          <Paper
            elevation={2}
            onDragOver={handleDragOver}
            onDrop={handleDrop("filters")}
            sx={{
              width: "100%",
              p: 3,
              borderRadius: 2,
              backgroundColor: "#F7FAFC",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              height: "45vh",
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Filterlar
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop("filters")}
            >
              {renderElementsList(elementsByGroup.filters, "filters", true)}
            </Box>
            {elementsByGroup.filters.some((f) => f.id === "date") && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Sana oralig&apos;i
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    label="Boshlanish sana"
                    type="date"
                    size="small"
                    fullWidth
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Tugash sana"
                    type="date"
                    size="small"
                    fullWidth
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>
            )}
          </Paper>
          <Paper
            elevation={2}
            onDragOver={handleDragOver}
            onDrop={handleDrop("extras")}
            sx={{
              width: "100%",
              p: 3,
              borderRadius: 2,
              backgroundColor: "#F7FAFC",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              height: "35vh",
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Qo'shimchalar
            </Typography>
            <Box
              sx={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: 0, 
                flex: 1,
                minHeight: 0,
                overflowY: "auto"
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop("extras")}
            >
              {renderElementsList(elementsByGroup.extras, "extras", true)}
            </Box>
          </Paper>
        </Box>
        <Paper
          elevation={2}
          sx={{
            width: "46%",
            p: 3,
            borderRadius: 2,
            backgroundColor: "#F7FAFC",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            height: "calc(100vh - 120px)",
            display: "flex",
            flexDirection: "column",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" mb={2}>
            Tanlangan maydonlar
          </Typography>
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              backgroundColor: "#fff",
              borderRadius: 1,
              border: "1px solid #e5e7eb",
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell />
                  {elementsByGroup.columns.map((col) => (
                    <TableCell key={col.id} sx={{ fontWeight: 600 }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {elementsByGroup.rows.length === 0 && elementsByGroup.columns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={Math.max(1, elementsByGroup.columns.length) + 1}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        Hali maydon tanlanmagan
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : elementsByGroup.rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={Math.max(1, elementsByGroup.columns.length) + 1}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        Qatorlar (X o'qi) tanlanmagan
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (() => {
                  // X o'qi: Mahsulotlar, Y o'qi: Summa (salePrice×amount) yoki Narx
                  const hasProductsInRows = elementsByGroup.rows.some((row) => row.id === "products");
                  const hasSalePriceInColumns = elementsByGroup.columns.some((col) => col.id === "salePrice");
                  const hasPriceInColumns = elementsByGroup.columns.some((col) => col.id === "price");
                  if (hasProductsInRows && (hasSalePriceInColumns || hasPriceInColumns)) {
                    if (tableRowLabels.length > 0 && tableData.length > 0) {
                      return tableData.map((rowData: any[], rowIndex: number) => (
                        <TableRow key={`product-${rowIndex}`}>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {tableRowLabels[rowIndex] ?? `Mahsulot ${rowIndex + 1}`}
                          </TableCell>
                          {elementsByGroup.columns.map((col, colIndex) => {
                            const cellValue = rowData[colIndex] ?? "-";
                            const numVal = typeof cellValue === "number" ? cellValue : Number(cellValue);
                            const isNum = !isNaN(numVal) && cellValue !== "" && cellValue !== "-";
                            return (
                              <TableCell key={col.id}>
                                <Typography variant="body2">
                                  {(col.id === "salePrice" || col.id === "price") && isNum
                                    ? numVal.toLocaleString()
                                    : String(cellValue)}
                                </Typography>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ));
                    }
                    return (
                      <TableRow>
                        <TableCell colSpan={(elementsByGroup.columns.length || 1) + 1}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                            Ma'lumotlarni ko'rish tugmasini bosing
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  }
                  // Maxsus holat: qatorlarga Buyurtmalar, ustunlarga Summa
                  const hasOrdersInRows = elementsByGroup.rows.some((row) => row.id === "orders");
                  if (hasOrdersInRows && hasSalePriceInColumns && tableData.length > 0) {
                    return tableData.map((rowData: any[], index: number) => (
                      <TableRow key={`order-${index}`}>
                        <TableCell sx={{ fontWeight: 500 }}>
                          Buyurtma {index + 1}
                        </TableCell>
                        {elementsByGroup.columns.map((col, colIndex) => {
                          const cellValue = rowData[colIndex] ?? "—";
                          const isNum = typeof cellValue === "number" || (!isNaN(Number(cellValue)) && cellValue !== "");
                          return (
                            <TableCell key={col.id}>
                              <Typography variant="body2">
                                {col.id === "salePrice" && isNum
                                  ? Number(cellValue).toLocaleString()
                                  : cellValue === "—" ? "—" : String(cellValue)}
                              </Typography>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ));
                  }
                  
                  // Oddiy holat: tableData mavjud bo'lsa
                  if (tableData.length > 0) {
                    const hasOrdersInRowsForData = elementsByGroup.rows.some((row) => row.id === "orders");
                    if (hasOrdersInRowsForData) {
                      return tableData.map((rowData: any[], rowIndex: number) => (
                        <TableRow key={`order-${rowIndex}`}>
                          <TableCell sx={{ fontWeight: 500 }}>
                            Buyurtma {rowIndex + 1}
                          </TableCell>
                          {elementsByGroup.columns.length > 0 ? (
                            elementsByGroup.columns.map((col, colIndex) => {
                              const cellValue = rowData[colIndex] || "-";
                              return (
                                <TableCell key={col.id}>
                                  <Typography variant="body2">
                                    {typeof cellValue === "object" ? JSON.stringify(cellValue) : String(cellValue)}
                                  </Typography>
                                </TableCell>
                              );
                            })
                          ) : null}
                        </TableRow>
                      ));
                    }
                  }
                  
                  // Default: oddiy qatorlar
                  return elementsByGroup.rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ fontWeight: 500 }}>{row.label}</TableCell>
                      {elementsByGroup.columns.length > 0 ? (
                        elementsByGroup.columns.map((col) => (
                          <TableCell key={col.id}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              —
                            </Typography>
                          </TableCell>
                        ))
                      ) : (
                        <TableCell colSpan={1}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            Ustunlar (Y o'qi) tanlanmagan
                          </Typography>
                        </TableCell>
                      )}
                    </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ConstructorAnalytics;
   