import { useParams, useNavigate } from "react-router-dom";
import {
    Grid,
    Chip,
    Box,
    Typography,
    Card,
    CardContent,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import {
    Person,
    Phone,
    ShoppingCart,
    CalendarToday,
    TrendingUp,
    AttachMoney,
    Code,
    Search,
} from "@mui/icons-material";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { numberFormat } from "utils/numberFormat";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const PromoCodeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const limit = 20;

    const { data: promocodeData, status, refetch } = useApi(
        `promocode/get-by-id/${id}`,
        {},
        {
            enabled: !!id,
        }
    );

    const promocode = promocodeData?.data;

    const { mutate: fetchHistory, data: historyData, isLoading: historyLoading } = useApiMutation(
        `promocode/history/paging`,
        "post",
        {
            onSuccess: () => {},
        }
    );

    useEffect(() => {
        if (id) {
            fetchHistory({
                promocodeId: id,
                page,
                limit,
                search: searchTerm || undefined,
            });
        }
    }, [id, page, searchTerm]);

    const history = historyData?.data?.data || [];
    const totalHistory = historyData?.data?.total || 0;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== searchParams.get("search")) {
                setSearchParams({ page: "1", search: searchTerm });
                setPage(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        setSearchParams({ page: String(page), search: searchTerm });
    }, [page]);

    if (status === "loading") {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (status === "error" || !promocode) {
        return (
            <Box
                sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "error.light",
                    color: "error.contrastText",
                }}
            >
                <Typography variant="h6">Promokod topilmadi</Typography>
            </Box>
        );
    }

    const isActive = get(promocode, "state", "") === "active";

    return (
        <Box
            sx={{
                minHeight: "100vh",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                    color: "white",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {get(promocode, "name", get(promocode, "code", "Promokod"))}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Promokod ma'lumotlari va ishlatilganlik tarixi
                        </Typography>
                    </Box>
                    <Chip
                        label={isActive ? "Faol" : "Faol emas"}
                        sx={{
                            bgcolor: isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                        }}
                    />
                </Box>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card
                        elevation={4}
                        sx={{
                            mb: 3,
                            borderRadius: 3,
                            overflow: "hidden",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 6,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                                p: 2,
                                color: "white",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Promokod Ma'lumotlari
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            borderRadius: 2,
                                            background: "#f8fafc",
                                            border: "1px solid #e2e8f0",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                            <Code sx={{ color: "#3b82f6", fontSize: 20 }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#64748b" }}>
                                                Promokod
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontFamily: "monospace", fontSize: "1rem" }}>
                                            {get(promocode, "code", "-")}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            borderRadius: 2,
                                            background: "#f8fafc",
                                            border: "1px solid #e2e8f0",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                            <AttachMoney sx={{ color: "#10b981", fontSize: 20 }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#64748b" }}>
                                                Chegirma summasi
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem" }}>
                                            {numberFormat(get(promocode, "amount", 0))} so'm
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            borderRadius: 2,
                                            background: "#f8fafc",
                                            border: "1px solid #e2e8f0",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                            <TrendingUp sx={{ color: "#f59e0b", fontSize: 20 }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#64748b" }}>
                                                Ishlatilgan
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem" }}>
                                            {get(promocode, "usedCount", 0)}
                                            {get(promocode, "maxUsage") && (
                                                <Typography component="span" variant="body2" sx={{ color: "#64748b", ml: 1, fontSize: "0.875rem" }}>
                                                    / {get(promocode, "maxUsage")}
                                                </Typography>
                                            )}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            borderRadius: 2,
                                            background: "#f8fafc",
                                            border: "1px solid #e2e8f0",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                            <Person sx={{ color: "#8b5cf6", fontSize: 20 }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#64748b" }}>
                                                Foydalanuvchi limiti
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem" }}>
                                            {get(promocode, "maxUsageForUser", 1)} marta
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {get(promocode, "minOrderPrice") && (
                                    <Grid item xs={12} sm={4}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                mb: 2,
                                                borderRadius: 2,
                                                background: "#f8fafc",
                                                border: "1px solid #e2e8f0",
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#64748b", mb: 1 }}>
                                                Minimal buyurtma summasi
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem" }}>
                                                {numberFormat(get(promocode, "minOrderPrice", 0))} so'm
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}

                                {get(promocode, "description") && (
                                    <Grid item xs={12}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                mb: 2,
                                                borderRadius: 2,
                                                background: "#f8fafc",
                                                border: "1px solid #e2e8f0",
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#64748b", mb: 1 }}>
                                                Tavsif
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: "#1e293b" }}>
                                                {get(promocode, "description")}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}

                                <Grid item xs={12} sm={4}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            borderRadius: 2,
                                            background: "#f8fafc",
                                            border: "1px solid #e2e8f0",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                            <CalendarToday sx={{ color: "#f59e0b", fontSize: 20 }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#64748b" }}>
                                                Sana oralig'i
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.25, fontSize: "0.75rem" }}>
                                                    Boshlanish sanasi
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem", lineHeight: 1.2 }}>
                                                    {get(promocode, "fromDate")
                                                        ? dayjs(get(promocode, "fromDate")).format("DD.MM.YYYY HH:mm")
                                                        : "-"}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.25, fontSize: "0.75rem" }}>
                                                    Tugash sanasi
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem", lineHeight: 1.2 }}>
                                                    {get(promocode, "toDate")
                                                        ? dayjs(get(promocode, "toDate")).format("DD.MM.YYYY HH:mm")
                                                        : "-"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
                        <Box
                            sx={{
                                background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                                p: 2,
                                color: "white",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Ishlatilganlik Tarixi
                            </Typography>
                        </Box>

                        <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Mijoz yoki buyurtma bo'yicha qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: "#64748b" }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {historyLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : history.length > 0 ? (
                            <>
                                <Box sx={{ overflowX: "auto" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700 }}>Mijoz</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Telefon</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Buyurtma</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Chegirma</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Sana</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {history.map((item: any) => (
                                                <TableRow key={item._id} hover>
                                                    <TableCell>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                            <Person sx={{ color: "#64748b", fontSize: 18 }} />
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                {get(item, "customer.firstName", "")} {get(item, "customer.lastName", "")}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {get(item, "customer.phoneNumber", "-")}
                                                    </TableCell>
                                                    <TableCell>
                                                        {get(item, "order.number") ? (
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: 1,
                                                                    cursor: "pointer",
                                                                    color: "#3b82f6",
                                                                    "&:hover": { textDecoration: "underline" },
                                                                }}
                                                                onClick={() => navigate(`/order/${get(item, "order._id")}`)}
                                                            >
                                                                <ShoppingCart sx={{ fontSize: 16 }} />
                                                                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                                                                    #{get(item, "order.number")}
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#10b981" }}>
                                                            {numberFormat(get(item, "amount", 0))} so'm
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                            <CalendarToday sx={{ color: "#64748b", fontSize: 16 }} />
                                                            <Typography variant="body2" sx={{ color: "#64748b" }}>
                                                                {get(item, "createdAt")
                                                                    ? dayjs(get(item, "createdAt")).format("DD.MM.YYYY HH:mm")
                                                                    : "-"}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>

                                {totalHistory > limit && (
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderTop: "1px solid #e2e8f0",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                                            Jami: {totalHistory} ta yozuv
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                            <Box
                                                component="button"
                                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                sx={{
                                                    px: 2,
                                                    py: 1,
                                                    border: "1px solid #e2e8f0",
                                                    borderRadius: 1,
                                                    cursor: page === 1 ? "not-allowed" : "pointer",
                                                    opacity: page === 1 ? 0.5 : 1,
                                                    background: "white",
                                                    "&:hover": { background: "#f8fafc" },
                                                }}
                                            >
                                                Oldingi
                                            </Box>
                                            <Typography variant="body2" sx={{ px: 2 }}>
                                                {page} / {Math.ceil(totalHistory / limit)}
                                            </Typography>
                                            <Box
                                                component="button"
                                                onClick={() => setPage((p) => p + 1)}
                                                disabled={page >= Math.ceil(totalHistory / limit)}
                                                sx={{
                                                    px: 2,
                                                    py: 1,
                                                    border: "1px solid #e2e8f0",
                                                    borderRadius: 1,
                                                    cursor: page >= Math.ceil(totalHistory / limit) ? "not-allowed" : "pointer",
                                                    opacity: page >= Math.ceil(totalHistory / limit) ? 0.5 : 1,
                                                    background: "white",
                                                    "&:hover": { background: "#f8fafc" },
                                                }}
                                            >
                                                Keyingi
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                            </>
                        ) : (
                            <Box sx={{ p: 4, textAlign: "center" }}>
                                <Typography variant="body1" sx={{ color: "#64748b" }}>
                                    {searchTerm ? "Tarix topilmadi" : "Hali ishlatilmagan"}
                                </Typography>
                            </Box>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PromoCodeDetail;

