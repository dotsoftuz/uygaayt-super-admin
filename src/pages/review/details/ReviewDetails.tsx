import { useParams, useNavigate } from "react-router-dom";
import {
    Grid,
    Rating,
    Chip,
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Divider,
    Paper,
    IconButton,
} from "@mui/material";
import {
    Person,
    Phone,
    Star,
    Comment,
    Image as ImageIcon,
    Store,
    ShoppingBag,
    Inventory,
    CalendarToday,
    Visibility,
    VisibilityOff,
    ArrowBack,
} from "@mui/icons-material";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import { toast } from "react-toastify";
import BackButton from "components/common/backButton/BackButton";
import { MainButton } from "components";
import dayjs from "dayjs";

const ReviewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { data, status, refetch } = useApi(
        `review/get-by-id/${id}`,
        {},
        {
            enabled: !!id,
        }
    );

    const review = data?.data;

    const { mutate: toggleVisibilityMutate } = useApiMutation(
        `review/toggle-visibility/${id}`,
        "post",
        {
            onSuccess() {
                toast.success("Sharh ko'rinishi o'zgartirildi");
                refetch();
            },
            onError(error: any) {
                toast.error(error?.message || "Xatolik yuz berdi");
            },
        }
    );

    const handleToggleVisibility = () => {
        if (review) {
            toggleVisibilityMutate({
                isVisible: !get(review, "isVisible", true),
            });
        }
    };

    if (status === "loading") {
        return (
            <Box
                sx={{
                    p: 4,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    Yuklanmoqda...
                </Typography>
            </Box>
        );
    }

    if (status === "error" || !review) {
        return (
            <Box sx={{ p: 4 }}>
                <BackButton />
                <Box
                    sx={{
                        mt: 3,
                        p: 3,
                        borderRadius: 2,
                        bgcolor: "error.light",
                        color: "error.contrastText",
                    }}
                >
                    <Typography variant="h6">Sharh topilmadi</Typography>
                </Box>
            </Box>
        );
    }

    const customerName = `${get(review, "customer.firstName", "")} ${get(review, "customer.lastName", "")}`.trim() || "Mijoz";
    const rating = get(review, "rating", 0);
    const isVisible = get(review, "isVisible", true);

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                minHeight: "100vh",
            }}
        >
            {/* Header */}
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <BackButton />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                            Sharh Tafsilotlari
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Sharhning barcha ma'lumotlari
                        </Typography>
                    </Box>
                    <Chip
                        icon={isVisible ? <Visibility /> : <VisibilityOff />}
                        label={isVisible ? "Ko'rinadi" : "Yashirilgan"}
                        sx={{
                            bgcolor: isVisible ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                        }}
                    />
                </Box>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {/* Customer Info Card */}
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
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                p: 2,
                                color: "white",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: "rgba(255,255,255,0.3)",
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    <Person sx={{ fontSize: 32 }} />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {customerName}
                                    </Typography>
                                    {get(review, "customer.phoneNumber") && (
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <Phone sx={{ fontSize: 16 }} />
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                {get(review, "customer.phoneNumber")}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                        <CardContent sx={{ p: 3 }}>

                            {/* Rating */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    mb: 3,
                                    borderRadius: 2,
                                    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                                    border: "1px solid #fbbf24",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                    <Star sx={{ color: "#f59e0b", fontSize: 28 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#92400e" }}>
                                        Baho
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, pl: 5 }}>
                                    <Rating
                                        value={rating}
                                        readOnly
                                        precision={0.5}
                                        size="large"
                                        sx={{
                                            "& .MuiRating-iconFilled": {
                                                color: "#f59e0b",
                                            },
                                        }}
                                    />
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            color: "#92400e",
                                            ml: 1,
                                        }}
                                    >
                                        {rating} / 5
                                    </Typography>
                                </Box>
                            </Paper>

                            {/* Comment */}
                            {get(review, "comment") && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        mb: 3,
                                        borderRadius: 2,
                                        background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
                                        border: "1px solid #818cf8",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                                        <Comment sx={{ color: "#4f46e5", fontSize: 24 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#312e81" }}>
                                            Sharh
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            lineHeight: 1.8,
                                            color: "#1e1b4b",
                                            fontSize: "1rem",
                                        }}
                                    >
                                        {get(review, "comment")}
                                    </Typography>
                                </Paper>
                            )}

                            {/* Rate Comments */}
                            {get(review, "rateComments")?.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 700, mb: 2, color: "#1f2937" }}
                                    >
                                        Tanlangan Xususiyatlar
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 1.5,
                                        }}
                                    >
                                        {get(review, "rateComments", []).map((rc: any, idx: number) => (
                                            <Chip
                                                key={idx}
                                                icon={
                                                    rc.image?.url ? (
                                                        <img
                                                            src={rc.image.url}
                                                            alt=""
                                                            style={{
                                                                width: "24px",
                                                                height: "24px",
                                                                borderRadius: "6px",
                                                            }}
                                                        />
                                                    ) : undefined
                                                }
                                                label={rc.title?.uz || rc.title || ""}
                                                sx={{
                                                    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                                                    border: "1px solid #0ea5e9",
                                                    fontWeight: 600,
                                                    fontSize: "0.875rem",
                                                    py: 2.5,
                                                    px: 1,
                                                    "&:hover": {
                                                        background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                                                        transform: "scale(1.05)",
                                                    },
                                                    transition: "all 0.2s",
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Images */}
                            {get(review, "images")?.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                                        <ImageIcon sx={{ color: "#6366f1", fontSize: 24 }} />
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 700, color: "#1f2937" }}
                                        >
                                            Rasmlar ({get(review, "images", []).length})
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "repeat(2, 1fr)",
                                                sm: "repeat(3, 1fr)",
                                                md: "repeat(4, 1fr)",
                                            },
                                            gap: 2,
                                        }}
                                    >
                                        {get(review, "images", []).map((img: any, idx: number) => (
                                            <Paper
                                                key={idx}
                                                elevation={3}
                                                sx={{
                                                    position: "relative",
                                                    width: "100%",
                                                    paddingTop: "100%",
                                                    borderRadius: 3,
                                                    overflow: "hidden",
                                                    cursor: "pointer",
                                                    border: "2px solid transparent",
                                                    transition: "all 0.3s",
                                                    "&:hover": {
                                                        transform: "scale(1.05)",
                                                        borderColor: "#6366f1",
                                                        boxShadow: 6,
                                                    },
                                                }}
                                                onClick={() => {
                                                    const imageUrl = img.url || img.webpUrl;
                                                    if (imageUrl) {
                                                        window.open(imageUrl, "_blank");
                                                    }
                                                }}
                                            >
                                                <img
                                                    src={img.url || img.webpUrl}
                                                    alt={`Review ${idx + 1}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </Paper>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card
                        elevation={4}
                        sx={{
                            borderRadius: 3,
                            overflow: "hidden",
                            position: "sticky",
                            top: 20,
                        }}
                    >
                        <Box
                            sx={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                p: 2,
                                color: "white",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Qo'shimcha Ma'lumotlar
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                            {/* Order Info */}
                            {get(review, "order") && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        mb: 2,
                                        borderRadius: 2,
                                        background: "#f8fafc",
                                        border: "1px solid #e2e8f0",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            background: "#f1f5f9",
                                            transform: "translateX(4px)",
                                        },
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                        <ShoppingBag sx={{ color: "#3b82f6", fontSize: 20 }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#64748b" }}>
                                            Buyurtma
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            cursor: "pointer",
                                            color: "#3b82f6",
                                            fontWeight: 700,
                                            "&:hover": {
                                                textDecoration: "underline",
                                            },
                                        }}
                                        onClick={() => navigate(`/order/${get(review, "order._id")}`)}
                                    >
                                        #{get(review, "order.number", "")}
                                    </Typography>
                                </Paper>
                            )}

                            {/* Product Info */}
                            {get(review, "product") && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        mb: 2,
                                        borderRadius: 2,
                                        background: "#f8fafc",
                                        border: "1px solid #e2e8f0",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            background: "#f1f5f9",
                                            transform: "translateX(4px)",
                                        },
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                        <Inventory sx={{ color: "#10b981", fontSize: 20 }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#64748b" }}>
                                            Mahsulot
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                        {typeof get(review, "product.name") === "object"
                                            ? get(review, "product.name.uz") ||
                                              get(review, "product.name.ru") ||
                                              get(review, "product.name.en")
                                            : get(review, "product.name")}
                                    </Typography>
                                </Paper>
                            )}

                            {/* Store Info */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    borderRadius: 2,
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        background: "#f1f5f9",
                                        transform: "translateX(4px)",
                                    },
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                    <Store sx={{ color: "#8b5cf6", fontSize: 20 }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#64748b" }}>
                                        Do'kon
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                    {get(review, "storeId") === "uygaayt"
                                        ? "Uygaayt Market"
                                        : get(review, "store.name", "") ||
                                          get(review, "storeId", "")}
                                </Typography>
                            </Paper>

                            {/* Date */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    mb: 3,
                                    borderRadius: 2,
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        background: "#f1f5f9",
                                        transform: "translateX(4px)",
                                    },
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                    <CalendarToday sx={{ color: "#f59e0b", fontSize: 20 }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#64748b" }}>
                                        Sana
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                    {review.createdAt
                                        ? dayjs(review.createdAt).format("DD.MM.YYYY HH:mm")
                                        : "-"}
                                </Typography>
                            </Paper>

                            <Divider sx={{ my: 2 }} />

                            {/* Actions */}
                            <Box>
                                <MainButton
                                    title={
                                        isVisible
                                            ? "Sharhni Yashirish"
                                            : "Sharhni Ko'rsatish"
                                    }
                                    variant={isVisible ? "outlined" : "contained"}
                                    color={isVisible ? "error" : "primary"}
                                    onClick={handleToggleVisibility}
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        borderRadius: 2,
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReviewDetails;

