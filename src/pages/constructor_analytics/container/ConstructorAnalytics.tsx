import {
  BarChart as BarChartIcon,
  Close,
  Delete,
  Download,
  Fullscreen,
  Save,
} from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { saveAs } from "file-saver";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type GroupKey = "available" | "rows" | "columns" | "filters" | "extras";
type ElementType = "entity" | "dimension" | "metric" | "filterOnly";

const CHART_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

const ALL_ELEMENTS: { id: string; label: string }[] = [
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
];

const ELEMENT_BY_ID = Object.fromEntries(ALL_ELEMENTS.map((e) => [e.id, e]));

const ELEMENT_TYPE_BY_ID: Record<string, ElementType> = {
  orders: "entity",
  customers: "entity",
  products: "entity",
  couriers: "entity",
  "stores-restaurants": "dimension",
  categories: "dimension",
  employees: "dimension",
  date: "filterOnly",
  salePrice: "metric",
  price: "metric",
};

const ALLOWED_TARGETS: Record<ElementType, GroupKey[]> = {
  filterOnly: ["filters"],
  metric: ["columns"],
  dimension: ["rows", "columns", "filters", "extras"],
  entity: ["rows", "columns", "extras"],
};

const FILTERABLE_IDS = new Set([
  "stores-restaurants",
  "couriers",
  "customers",
  "categories",
  "employees",
]);

const ConstructorAnalytics = () => {
  const [tableData, setTableData] = useState<any[][]>([]);
  const [tableRowLabels, setTableRowLabels] = useState<string[]>([]);
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [dropError, setDropError] = useState<string>("");
  const [isMaximized, setIsMaximized] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortColIndex, setSortColIndex] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [chartType, setChartType] = useState<"bar" | "pie" | "line" | null>(
    null,
  );
  const [presets, setPresets] = useState<
    {
      name: string;
      rows: string[];
      columns: string[];
      filters: string[];
      filterValues: Record<string, string[]>;
    }[]
  >(() => {
    try {
      const saved = localStorage.getItem("analytics-presets");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [presetName, setPresetName] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>(
    {},
  );
  const [dragging, setDragging] = useState<{
    itemId: string;
    fromKey: GroupKey;
  } | null>(null);

  const [elementsByGroup, setElementsByGroup] = useState<{
    available: { id: string; label: string }[];
    rows: { id: string; label: string }[];
    columns: { id: string; label: string }[];
    filters: { id: string; label: string }[];
    extras: { id: string; label: string }[];
  }>({
    available: [...ALL_ELEMENTS],
    rows: [],
    columns: [],
    filters: [],
    extras: [],
  });

  const isDropAllowed = (itemId: string, toKey: GroupKey): boolean => {
    if (toKey === "available") return true;
    const t = ELEMENT_TYPE_BY_ID[itemId];
    if (!t) return false;
    return ALLOWED_TARGETS[t].includes(toKey);
  };

  const getDragVisualState = (toKey: GroupKey) => {
    if (!dragging) return "idle" as const;
    if (dragging.fromKey === toKey) return "idle" as const;
    return isDropAllowed(dragging.itemId, toKey)
      ? ("allowed" as const)
      : ("blocked" as const);
  };

  const buildMutation = useApiMutation("analytics-constructor/build", "POST", {
    withoutNotification: true,
  });

  const filterableInFilters = useMemo(
    () => elementsByGroup.filters.filter((f) => FILTERABLE_IDS.has(f.id)),
    [elementsByGroup.filters],
  );
  const filterTypesParam = useMemo(
    () => filterableInFilters.map((f) => f.id).join(","),
    [filterableInFilters],
  );
  const { data: filterOptionsRes } = useApi(
    filterTypesParam
      ? `analytics-constructor/filter-options?types=${filterTypesParam}`
      : "",
    {},
    { enabled: filterableInFilters.length > 0 },
  );
  const filterOptions: Record<string, { _id: string; name: string }[]> =
    (filterOptionsRes as any)?.data ?? {};

  const { sortedData, sortedLabels } = useMemo(() => {
    if (sortColIndex === null || tableData.length === 0)
      return { sortedData: tableData, sortedLabels: tableRowLabels };
    const paired = tableData.map((row, i) => ({
      row,
      label: tableRowLabels[i],
    }));
    paired.sort((a, b) => {
      const aVal = a.row[sortColIndex];
      const bVal = b.row[sortColIndex];
      const aNum = typeof aVal === "number" ? aVal : Number(aVal);
      const bNum = typeof bVal === "number" ? bVal : Number(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
      }
      return sortDirection === "asc"
        ? String(aVal ?? "").localeCompare(String(bVal ?? ""))
        : String(bVal ?? "").localeCompare(String(aVal ?? ""));
    });
    return {
      sortedData: paired.map((s) => s.row),
      sortedLabels: paired.map((s) => s.label),
    };
  }, [tableData, sortColIndex, sortDirection, tableRowLabels]);

  const summaryRow = useMemo(() => {
    if (sortedData.length === 0 || elementsByGroup.columns.length === 0)
      return null;
    return elementsByGroup.columns.map((_col, colIndex) => {
      const nums = sortedData
        .map((row) => row[colIndex])
        .filter(
          (v) =>
            typeof v === "number" ||
            (!isNaN(Number(v)) && v !== "" && v !== "-"),
        );
      if (nums.length === 0) return null;
      return nums.reduce((sum, v) => sum + Number(v), 0);
    });
  }, [sortedData, elementsByGroup.columns]);

  const columnStats = useMemo(() => {
    if (sortedData.length === 0) return [];
    return elementsByGroup.columns.map((_col, ci) => {
      const nums = sortedData
        .map((row) => row[ci])
        .filter(
          (v: any) =>
            typeof v === "number" ||
            (!isNaN(Number(v)) && v !== "" && v !== "-"),
        )
        .map(Number);
      if (nums.length < 2) return null;
      return { min: Math.min(...nums), max: Math.max(...nums) };
    });
  }, [sortedData, elementsByGroup.columns]);

  const getConditionalColor = useCallback(
    (value: any, colIndex: number): string | undefined => {
      if (
        typeof value !== "number" &&
        (isNaN(Number(value)) || value === "" || value === "-")
      )
        return undefined;
      const stats = columnStats[colIndex];
      if (!stats || stats.max === stats.min) return undefined;
      const ratio = (Number(value) - stats.min) / (stats.max - stats.min);
      if (ratio >= 0.75) return "#dcfce7";
      if (ratio <= 0.25) return "#fee2e2";
      return undefined;
    },
    [columnStats],
  );

  const handleExportCSV = useCallback(() => {
    if (sortedData.length === 0) return;
    const cols = elementsByGroup.columns.map((c) => c.label);
    const header = ["", ...cols].join(",");
    const rows = sortedData.map((row, i) =>
      [
        `"${(sortedLabels[i] ?? "").replace(/"/g, '""')}"`,
        ...row.map((v: any) =>
          typeof v === "string" ? `"${v.replace(/"/g, '""')}"` : v,
        ),
      ].join(","),
    );
    if (summaryRow) {
      rows.push(
        ["Jami", ...summaryRow.map((v) => (v !== null ? v : ""))].join(","),
      );
    }
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, `analytics-${new Date().toISOString().slice(0, 10)}.csv`);
  }, [sortedData, sortedLabels, elementsByGroup.columns, summaryRow]);

  const handleSavePreset = useCallback(() => {
    if (!presetName.trim()) return;
    const newPreset = {
      name: presetName.trim(),
      rows: elementsByGroup.rows.map((r) => r.id),
      columns: elementsByGroup.columns.map((c) => c.id),
      filters: elementsByGroup.filters.map((f) => f.id),
      filterValues,
    };
    const updated = [
      ...presets.filter((p) => p.name !== newPreset.name),
      newPreset,
    ];
    setPresets(updated);
    localStorage.setItem("analytics-presets", JSON.stringify(updated));
    setPresetName("");
    setDropError("Preset saqlandi!");
  }, [presetName, elementsByGroup, filterValues, presets]);

  const handleLoadPreset = useCallback((preset: (typeof presets)[0]) => {
    const rows = preset.rows.map((id) => ELEMENT_BY_ID[id]).filter(Boolean);
    const columns = preset.columns
      .map((id) => ELEMENT_BY_ID[id])
      .filter(Boolean);
    const filters = preset.filters
      .map((id) => ELEMENT_BY_ID[id])
      .filter(Boolean);
    const usedIds = new Set([
      ...preset.rows,
      ...preset.columns,
      ...preset.filters,
    ]);
    const available = ALL_ELEMENTS.filter((e) => !usedIds.has(e.id));
    setElementsByGroup({ available, rows, columns, filters, extras: [] });
    setFilterValues(preset.filterValues || {});
    setTableData([]);
    setTableRowLabels([]);
    setOrderIds([]);
  }, []);

  const handleDeletePreset = useCallback(
    (name: string) => {
      const updated = presets.filter((p) => p.name !== name);
      setPresets(updated);
      localStorage.setItem("analytics-presets", JSON.stringify(updated));
    },
    [presets],
  );

  const chartData = useMemo(() => {
    if (sortedData.length === 0 || elementsByGroup.columns.length === 0)
      return [];
    return sortedData.slice(0, 20).map((row, i) => {
      const entry: any = { name: sortedLabels[i] ?? `#${i + 1}` };
      elementsByGroup.columns.forEach((col, ci) => {
        const v = row[ci];
        entry[col.label] = typeof v === "number" ? v : Number(v) || 0;
      });
      return entry;
    });
  }, [sortedData, sortedLabels, elementsByGroup.columns]);

  const numericColumns = useMemo(
    () =>
      elementsByGroup.columns.filter((col) =>
        sortedData.some((row) => {
          const ci = elementsByGroup.columns.indexOf(col);
          const v = row[ci];
          return (
            typeof v === "number" ||
            (!isNaN(Number(v)) && v !== "" && v !== "-")
          );
        }),
      ),
    [elementsByGroup.columns, sortedData],
  );

  useEffect(() => {
    if (!elementsByGroup.filters.some((f) => f.id === "date")) {
      setDateFrom("");
      setDateTo("");
    }
  }, [elementsByGroup.filters]);

  const handleDragStart =
    (fromKey: GroupKey, itemId: string) =>
    (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData(
        "application/json",
        JSON.stringify({ fromKey, itemId }),
      );
      event.dataTransfer.effectAllowed = "move";
      setDragging({ fromKey, itemId });
    };

  const handleDrop =
    (toKey: GroupKey, dropIndex?: number) =>
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData("application/json");
      if (!raw) return;

      try {
        const { fromKey, itemId } = JSON.parse(raw) as {
          fromKey: GroupKey;
          itemId: string;
        };

        if (!fromKey || !itemId) return;

        setElementsByGroup((prev) => {
          const sourceList = prev[fromKey] || [];
          const targetList = prev[toKey] || [];

          const item = sourceList.find((el) => el.id === itemId);
          if (!item) return prev;

          if (fromKey !== toKey && !isDropAllowed(itemId, toKey)) {
            setDropError(`"${item.label}" bu bo'limga tashlab bo'lmaydi`);
            return prev;
          }

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
    setOrderIds([]);
    setFilterValues({});
    setPage(0);
    setSortColIndex(null);
    setChartType(null);
  };

  const handleRemoveElement = (
    fromKey: keyof typeof elementsByGroup,
    itemId: string,
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
      const isAlreadyInAvailable = prev.available.some(
        (el) => el.id === itemId,
      );
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
    showDelete: boolean = true,
  ) => (
    <Box
      key={item.id}
      draggable
      onDragStart={handleDragStart(fromKey, item.id)}
      onDragEnd={() => setDragging(null)}
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
    showDelete: boolean = true,
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
              minHeight: "4px",
              borderRadius: 1,
              transition: "background-color 0.2s",
              marginBottom: "2px",
            }}
          />
        )}
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <Box sx={{ mb: 1 }}>{renderElement(item, fromKey, showDelete)}</Box>
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
                minHeight: "4px",
                borderRadius: 1,
                transition: "background-color 0.2s",
              }}
            />
          </React.Fragment>
        ))}
      </>
    );
  };

  const renderTableContent = (paginate: boolean) => {
    const dataSlice = paginate
      ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : sortedData;
    const startIndex = paginate ? page * rowsPerPage : 0;

    return (
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, width: 56, bgcolor: "#fafafa" }}>
              #
            </TableCell>
            <TableCell
              sx={{ fontWeight: 600, minWidth: 120, bgcolor: "#fafafa" }}
            >
              Nomi
            </TableCell>
            {elementsByGroup.columns.map((col, colIndex) => (
              <TableCell
                key={col.id}
                sx={{ fontWeight: 600, bgcolor: "#fafafa" }}
              >
                <TableSortLabel
                  active={sortColIndex === colIndex}
                  direction={sortColIndex === colIndex ? sortDirection : "asc"}
                  onClick={() => {
                    if (sortColIndex === colIndex) {
                      setSortDirection(
                        sortDirection === "asc" ? "desc" : "asc",
                      );
                    } else {
                      setSortColIndex(colIndex);
                      setSortDirection("asc");
                    }
                  }}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {elementsByGroup.rows.length === 0 &&
          elementsByGroup.columns.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={Math.max(1, elementsByGroup.columns.length) + 2}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", py: 3, textAlign: "center" }}
                >
                  Hali maydon tanlanmagan
                </Typography>
              </TableCell>
            </TableRow>
          ) : elementsByGroup.rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={Math.max(1, elementsByGroup.columns.length) + 2}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", py: 3, textAlign: "center" }}
                >
                  Qatorlar (X o'qi) tanlanmagan
                </Typography>
              </TableCell>
            </TableRow>
          ) : dataSlice.length > 0 ? (
            dataSlice.map((rowData: any[], rowIndex: number) => {
              const realIndex = startIndex + rowIndex;
              return (
                <TableRow
                  key={`row-${realIndex}`}
                  hover
                  sx={{ "&:nth-of-type(even)": { bgcolor: "#fafafa" } }}
                >
                  <TableCell
                    sx={{ fontWeight: 500, color: "#6b7280", fontSize: 13 }}
                  >
                    {realIndex + 1}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 500, color: "#374151", fontSize: 13 }}
                  >
                    {orderIds.length > 0 && orderIds[realIndex] ? (
                      <Typography
                        component="a"
                        href={`/orders/${orderIds[realIndex]}`}
                        variant="body2"
                        sx={{
                          color: "#2563eb",
                          textDecoration: "none",
                          fontWeight: 500,
                          fontSize: 13,
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {sortedLabels[realIndex] ?? `#${realIndex + 1}`}
                      </Typography>
                    ) : (
                      (sortedLabels[realIndex] ?? `#${realIndex + 1}`)
                    )}
                  </TableCell>
                  {elementsByGroup.columns.map((col, colIndex) => {
                    const cellValue = rowData[colIndex] ?? "-";
                    const numVal =
                      typeof cellValue === "number"
                        ? cellValue
                        : Number(cellValue);
                    const isNum =
                      typeof cellValue === "number" ||
                      (!isNaN(numVal) && cellValue !== "" && cellValue !== "-");
                    const bgColor = getConditionalColor(cellValue, colIndex);
                    return (
                      <TableCell
                        key={col.id}
                        sx={{
                          backgroundColor: bgColor,
                          transition: "background-color 0.3s",
                          fontSize: 13,
                        }}
                      >
                        {(col.id === "salePrice" || col.id === "price") && isNum
                          ? numVal.toLocaleString()
                          : typeof cellValue === "object"
                            ? JSON.stringify(cellValue)
                            : String(cellValue)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={Math.max(1, elementsByGroup.columns.length) + 2}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", py: 3, textAlign: "center" }}
                >
                  Ma'lumotlarni ko'rish tugmasini bosing
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {summaryRow && sortedData.length > 0 && (
          <TableFooter>
            <TableRow sx={{ bgcolor: "#f0f9ff" }}>
              <TableCell sx={{ fontWeight: 700, fontSize: 13 }} />
              <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Jami</TableCell>
              {summaryRow.map((val: any, i: number) => (
                <TableCell key={i} sx={{ fontWeight: 700, fontSize: 13 }}>
                  {val !== null ? Number(val).toLocaleString() : ""}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            flexWrap: "wrap",
            flex: 1,
            minWidth: 0,
          }}
        >
          <TextField
            size="small"
            placeholder="Preset nomi"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            sx={{ width: 130 }}
            InputProps={{ sx: { height: 30, fontSize: 12 } }}
          />
          <Button
            size="small"
            variant="outlined"
            onClick={handleSavePreset}
            disabled={!presetName.trim()}
            sx={{
              textTransform: "none",
              height: 30,
              fontSize: 12,
              minWidth: 0,
              px: 1.5,
            }}
          >
            <Save sx={{ fontSize: 14, mr: 0.5 }} />
            Saqlash
          </Button>
          {presets.map((p) => (
            <Chip
              key={p.name}
              label={p.name}
              onClick={() => handleLoadPreset(p)}
              onDelete={() => handleDeletePreset(p.name)}
              variant="outlined"
              color="primary"
              size="small"
              sx={{ height: 24, fontSize: 11 }}
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={buildMutation.isLoading}
            sx={{ textTransform: "none", height: 30, fontSize: 12 }}
            onClick={async () => {
              const payload = {
                rows: elementsByGroup.rows.map((r) => r.id),
                columns: elementsByGroup.columns.map((c) => c.id),
                filters: elementsByGroup.filters.map((f) => f.id),
                extras: elementsByGroup.extras.map((e) => e.id),
                dateFrom:
                  elementsByGroup.filters.some((f) => f.id === "date") &&
                  dateFrom
                    ? dateFrom
                    : undefined,
                dateTo:
                  elementsByGroup.filters.some((f) => f.id === "date") && dateTo
                    ? dateTo
                    : undefined,
                filterValues:
                  Object.keys(filterValues).length > 0
                    ? filterValues
                    : undefined,
              };
              setPage(0);
              setSortColIndex(null);

              try {
                const res: any = await buildMutation.mutateAsync(
                  payload as any,
                );
                const rowLabels = res?.data?.rowLabels ?? [];
                const data = res?.data?.data ?? [];
                const oIds = res?.data?.orderIds ?? [];
                setTableRowLabels(Array.isArray(rowLabels) ? rowLabels : []);
                setTableData(Array.isArray(data) ? data : []);
                setOrderIds(Array.isArray(oIds) ? oIds : []);
              } catch (e: any) {
                setTableRowLabels([]);
                setTableData([]);
                setOrderIds([]);
                setDropError(e?.message || "Server error");
              }
            }}
          >
            Ma'lumotlarni ko‘rish
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleClearAll}
            sx={{ textTransform: "none", height: 30, fontSize: 12 }}
          >
            Tozalash
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Paper
          elevation={0}
          sx={{
            width: "15%",
            p: 1.5,
            borderRadius: 2,
            bgcolor: "#fafbfc",
            height: "calc(100vh - 120px)",
            overflowY: "auto",
            border:
              getDragVisualState("available") === "allowed"
                ? "1.5px solid #22c55e"
                : getDragVisualState("available") === "blocked"
                  ? "1.5px solid #ef4444"
                  : "1px solid #e5e7eb",
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "18%",
          }}
        >
          <Paper
            elevation={0}
            onDragOver={handleDragOver}
            onDrop={handleDrop("rows")}
            sx={{
              width: "100%",
              p: 2,
              borderRadius: 2,
              bgcolor: "#fafbfc",
              height: "45vh",
              display: "flex",
              flexDirection: "column",
              border:
                getDragVisualState("rows") === "allowed"
                  ? "1.5px solid #22c55e"
                  : getDragVisualState("rows") === "blocked"
                    ? "1.5px solid #ef4444"
                    : "1px solid #e5e7eb",
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
                overflowY: "auto",
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop("rows")}
            >
              {renderElementsList(elementsByGroup.rows, "rows", true)}
            </Box>
          </Paper>
          <Paper
            elevation={0}
            onDragOver={handleDragOver}
            onDrop={handleDrop("columns")}
            sx={{
              width: "100%",
              p: 2,
              borderRadius: 2,
              bgcolor: "#fafbfc",
              height: "35vh",
              display: "flex",
              flexDirection: "column",
              border:
                getDragVisualState("columns") === "allowed"
                  ? "1.5px solid #22c55e"
                  : getDragVisualState("columns") === "blocked"
                    ? "1.5px solid #ef4444"
                    : "1px solid #e5e7eb",
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
                overflowY: "auto",
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop("columns")}
            >
              {renderElementsList(elementsByGroup.columns, "columns", true)}
            </Box>
          </Paper>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "18%",
          }}
        >
          <Paper
            elevation={0}
            onDragOver={handleDragOver}
            onDrop={handleDrop("filters")}
            sx={{
              width: "100%",
              p: 2,
              borderRadius: 2,
              bgcolor: "#fafbfc",
              height: "45vh",
              display: "flex",
              flexDirection: "column",
              border:
                getDragVisualState("filters") === "allowed"
                  ? "1.5px solid #22c55e"
                  : getDragVisualState("filters") === "blocked"
                    ? "1.5px solid #ef4444"
                    : "1px solid #e5e7eb",
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
            {elementsByGroup.filters
              .filter(
                (f) =>
                  f.id !== "date" &&
                  [
                    "stores-restaurants",
                    "couriers",
                    "customers",
                    "categories",
                    "employees",
                  ].includes(f.id),
              )
              .map((f) => (
                <Box key={f.id} sx={{ mt: 1.5 }}>
                  <Autocomplete
                    multiple
                    size="small"
                    options={filterOptions[f.id] || []}
                    getOptionLabel={(opt: any) => opt.name || opt._id}
                    value={
                      (filterOptions[f.id] || []).filter((opt: any) =>
                        (filterValues[f.id] || []).includes(opt._id),
                      ) as any
                    }
                    onChange={(_e: any, newVal: any) => {
                      setFilterValues((prev) => ({
                        ...prev,
                        [f.id]: newVal.map((v: any) => v._id),
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={f.label}
                        placeholder="Tanlang..."
                      />
                    )}
                    renderTags={(value: any[], getTagProps) =>
                      value.map((option: any, index: number) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option._id}
                          label={option.name}
                          size="small"
                        />
                      ))
                    }
                  />
                </Box>
              ))}
          </Paper>
          <Paper
            elevation={0}
            onDragOver={handleDragOver}
            onDrop={handleDrop("extras")}
            sx={{
              width: "100%",
              p: 2,
              borderRadius: 2,
              bgcolor: "#fafbfc",
              height: "35vh",
              display: "flex",
              flexDirection: "column",
              border:
                getDragVisualState("extras") === "allowed"
                  ? "1.5px solid #22c55e"
                  : getDragVisualState("extras") === "blocked"
                    ? "1.5px solid #ef4444"
                    : "1px solid #e5e7eb",
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
                overflowY: "auto",
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop("extras")}
            >
              {renderElementsList(elementsByGroup.extras, "extras", true)}
            </Box>
          </Paper>
        </Box>
        <Paper
          elevation={0}
          sx={{
            width: "46%",
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#fff",
            height: "calc(100vh - 120px)",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e5e7eb",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Tanlangan maydonlar
              </Typography>
              {sortedData.length > 0 && (
                <Chip
                  label={`${sortedData.length} ta`}
                  size="small"
                  variant="outlined"
                  sx={{ height: 22, fontSize: 12 }}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <Tooltip title="CSV yuklab olish">
                <span>
                  <IconButton
                    size="small"
                    onClick={handleExportCSV}
                    disabled={sortedData.length === 0}
                  >
                    <Download sx={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip
                title={chartType ? "Grafikni yopish" : "Grafik ko'rsatish"}
              >
                <span>
                  <IconButton
                    size="small"
                    onClick={() => setChartType(chartType ? null : "bar")}
                    disabled={
                      sortedData.length === 0 || numericColumns.length === 0
                    }
                    color={chartType ? "primary" : "default"}
                  >
                    <BarChartIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Kattalashtirish">
                <IconButton size="small" onClick={() => setIsMaximized(true)}>
                  <Fullscreen sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          {chartType && chartData.length > 0 && (
            <Box
              sx={{ mb: 1, borderRadius: 1, border: "1px solid #e5e7eb", p: 1 }}
            >
              <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
                {(["bar", "pie", "line"] as const).map((t) => (
                  <Chip
                    key={t}
                    label={
                      t === "bar" ? "Ustun" : t === "pie" ? "Doira" : "Chiziq"
                    }
                    size="small"
                    variant={chartType === t ? "filled" : "outlined"}
                    color={chartType === t ? "primary" : "default"}
                    onClick={() => setChartType(t)}
                    sx={{ cursor: "pointer", height: 24, fontSize: 12 }}
                  />
                ))}
              </Box>
              <ResponsiveContainer width="100%" height={200}>
                {chartType === "bar" ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RechartsTooltip />
                    <Legend />
                    {numericColumns.map((col, i) => (
                      <Bar
                        key={col.id}
                        dataKey={col.label}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                        radius={[2, 2, 0, 0]}
                      />
                    ))}
                  </BarChart>
                ) : chartType === "pie" ? (
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey={numericColumns[0]?.label || ""}
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }: any) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {chartData.map((_: any, index: number) => (
                        <Cell
                          key={index}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RechartsTooltip />
                    <Legend />
                    {numericColumns.map((col, i) => (
                      <Line
                        key={col.id}
                        type="monotone"
                        dataKey={col.label}
                        stroke={CHART_COLORS[i % CHART_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    ))}
                  </LineChart>
                )}
              </ResponsiveContainer>
            </Box>
          )}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              borderRadius: 1,
              border: "1px solid #e5e7eb",
            }}
          >
            {renderTableContent(true)}
          </Box>
          {sortedData.length > rowsPerPage && (
            <TablePagination
              component="div"
              count={sortedData.length}
              page={page}
              onPageChange={(_e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50, 100]}
              labelRowsPerPage="Sahifada:"
              sx={{ borderTop: "1px solid #e5e7eb", mt: 0.5 }}
            />
          )}
        </Paper>
      </Box>

      {/* Maximize Dialog */}
      <Dialog
        fullScreen
        open={isMaximized}
        onClose={() => setIsMaximized(false)}
      >
        <AppBar sx={{ position: "relative" }} color="default" elevation={0}>
          <Toolbar variant="dense" sx={{ borderBottom: "1px solid #e5e7eb" }}>
            <Typography sx={{ flex: 1, fontSize: 16, fontWeight: 600 }}>
              Tanlangan maydonlar
              {sortedData.length > 0 && (
                <Chip
                  label={`${sortedData.length} ta`}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1, height: 22, fontSize: 12 }}
                />
              )}
            </Typography>
            <Tooltip title="CSV yuklab olish">
              <span>
                <IconButton
                  onClick={handleExportCSV}
                  disabled={sortedData.length === 0}
                  size="small"
                >
                  <Download sx={{ fontSize: 20 }} />
                </IconButton>
              </span>
            </Tooltip>
            <IconButton
              edge="end"
              onClick={() => setIsMaximized(false)}
              size="small"
              sx={{ ml: 0.5 }}
            >
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2, overflow: "auto", flex: 1 }}>
          {renderTableContent(false)}
        </Box>
      </Dialog>

      <Snackbar
        open={Boolean(dropError)}
        autoHideDuration={2200}
        onClose={() => setDropError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          variant="filled"
          onClose={() => setDropError("")}
        >
          {dropError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConstructorAnalytics;
