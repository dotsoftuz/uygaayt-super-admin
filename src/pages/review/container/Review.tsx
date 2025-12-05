import { Table, AutoCompleteFilter, Modal } from "components";
import { useMemo, useState, useEffect } from "react";
import { useReviewColumns } from "./review.columns";
import { useTranslation } from "react-i18next";
import { Grid, Rating } from "@mui/material";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import { toast } from "react-toastify";
import WarningModal from "components/common/WarningModal/WarningModal";
import { get } from "lodash";
import CommonModal from "components/common/commonModal";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useSearchParams } from "react-router-dom";

const Review = () => {
    const [reviewId, setReviewId] = useState<any>();
    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [toggleReviewId, setToggleReviewId] = useState<any>();
    const { t } = useTranslation();
    const allParams = useAllQueryParams();
    const [searchParams, setSearchParams] = useSearchParams();

    // Set default storeId to 'uygaayt' if not in URL params
    useEffect(() => {
        if (!allParams.storeId) {
            setSearchParams({
                ...allParams,
                storeId: 'uygaayt',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { mutate: toggleVisibilityMutate } = useApiMutation(
        `review/toggle-visibility/${toggleReviewId}`,
        "post",
        {
            onSuccess() {
                toast.success("Sharh ko'rinishi o'zgartirildi");
                setToggleReviewId(undefined);
                // Table will refetch automatically
            },
            onError(error: any) {
                toast.error(error?.message || "Xatolik yuz berdi");
                setToggleReviewId(undefined);
            },
        }
    );

    function handleToggleVisibility(row: any) {
        setToggleReviewId(row._id);
        toggleVisibilityMutate({
            isVisible: !get(row, "isVisible", true),
        });
    }

    const columns = useReviewColumns(handleToggleVisibility);

    const [ratingFilter, setRatingFilter] = useState<string>("");

    const renderHeader = (
        <Grid className="w-full lg:w-[60%] md:flex md:grid-cols-3 gap-3 justify-end items-center py-2">
            <Grid className="md:w-[30%] py-1">
                <AutoCompleteFilter
                    optionsUrl="store/paging"
                    filterName="storeId"
                    placeholder="Do'kon bo'yicha"
                    getOptionLabel={(option) => option?.name || option?._id}
                />
            </Grid>
            <Grid className="md:w-[30%] py-1">
                <AutoCompleteFilter
                    optionsUrl="customer/paging"
                    filterName="customerId"
                    placeholder={t("common.customer")}
                    getOptionLabel={(option) =>
                        `${option?.firstName || ""} ${option?.lastName || ""}`.trim() || option?.phoneNumber
                    }
                />
            </Grid>
            <Grid className="md:w-[30%] py-1">
                <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                >
                    <option value="">Barcha baholar</option>
                    <option value="5">5 yulduz</option>
                    <option value="4">4 yulduz</option>
                    <option value="3">3 yulduz</option>
                    <option value="2">2 yulduz</option>
                    <option value="1">1 yulduz</option>
                </select>
            </Grid>
        </Grid>
    );

    const queryParams = useMemo(() => ({
        rating: ratingFilter || undefined,
        // storeId will be automatically included from URL params via allParams
    }), [ratingFilter]);

    return (
        <>
            <Table
                dataUrl="review/paging"
                columns={columns}
                searchable
                headerChildren={renderHeader}
                exQueryParams={queryParams}
                onRowClick={(row) => {
                    setSelectedReview(row);
                    setReviewDialogOpen(true);
                }}
                onDeleteColumn={(row) => setReviewId(row._id)}
            />

            <WarningModal
                open={reviewId}
                setOpen={setReviewId}
                url={`review/delete`}
            />

            {/* Review Detail Modal */}
            <CommonModal
                open={reviewDialogOpen}
                setOpen={setReviewDialogOpen}
                title="Sharh Tafsilotlari"
                canCloseView={true}
                canClose={true}
                width={800}
            >
                {selectedReview && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Customer Info */}
                        <div>
                            <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>Mijoz</h3>
                            <div style={{ fontSize: "14px" }}>
                                <div>
                                    {get(selectedReview, "customer.firstName", "")}{" "}
                                    {get(selectedReview, "customer.lastName", "")}
                                </div>
                                <div style={{ color: "#6b7280" }}>
                                    {get(selectedReview, "customer.phoneNumber", "")}
                                </div>
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>Baho</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Rating
                                    value={get(selectedReview, "rating", 0)}
                                    readOnly
                                    precision={0.5}
                                />
                                <span>
                                    {get(selectedReview, "rating", 0)} / 5
                                </span>
                            </div>
                        </div>

                        {/* Comment */}
                        {get(selectedReview, "comment") && (
                            <div>
                                <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>Sharh</h3>
                                <p style={{ fontSize: "14px", background: "#f3f4f6", padding: "12px", borderRadius: "6px" }}>
                                    {get(selectedReview, "comment")}
                                </p>
                            </div>
                        )}

                        {/* Rate Comments */}
                        {get(selectedReview, "rateComments")?.length > 0 && (
                            <div>
                                <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>Tanlangan Xususiyatlar</h3>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {get(selectedReview, "rateComments", []).map((rc: any, idx: number) => (
                                        <div
                                            key={idx}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                padding: "4px 12px",
                                                background: "#f3f4f6",
                                                borderRadius: "6px",
                                            }}
                                        >
                                            {rc.image?.url && (
                                                <img
                                                    src={rc.image.url}
                                                    alt=""
                                                    style={{ width: "24px", height: "24px", borderRadius: "4px" }}
                                                />
                                            )}
                                            <span style={{ fontSize: "14px" }}>
                                                {rc.title?.uz || rc.title || ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Images */}
                        {get(selectedReview, "images")?.length > 0 && (
                            <div>
                                <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>Rasmlar</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                                    {get(selectedReview, "images", []).map((img: any, idx: number) => (
                                        <img
                                            key={idx}
                                            src={img.url || img.webpUrl}
                                            alt={`Review ${idx + 1}`}
                                            style={{
                                                width: "100%",
                                                height: "128px",
                                                objectFit: "cover",
                                                borderRadius: "6px",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Order Info */}
                        {get(selectedReview, "order") && (
                            <div>
                                <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>Buyurtma</h3>
                                <div style={{ fontSize: "14px" }}>
                                    #{get(selectedReview, "order.number", "")}
                                </div>
                            </div>
                        )}

                        {/* Product Info */}
                        {get(selectedReview, "product") && (
                            <div>
                                <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>Mahsulot</h3>
                                <div style={{ fontSize: "14px" }}>
                                    {typeof get(selectedReview, "product.name") === "object"
                                        ? get(selectedReview, "product.name.uz") ||
                                        get(selectedReview, "product.name.ru") ||
                                        get(selectedReview, "product.name.en")
                                        : get(selectedReview, "product.name")}
                                </div>
                            </div>
                        )}

                        {/* Store Info */}
                        <div>
                            <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>Do'kon</h3>
                            <div style={{ fontSize: "14px" }}>
                                {get(selectedReview, "storeId") === "uygaayt"
                                    ? "Uygaayt Market"
                                    : get(selectedReview, "store.name", "") ||
                                    get(selectedReview, "storeId", "")}
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>Sana</h3>
                            <div style={{ fontSize: "14px", color: "#6b7280" }}>
                                {selectedReview.createdAt
                                    ? new Date(selectedReview.createdAt).toLocaleString("uz-UZ")
                                    : "-"}
                            </div>
                        </div>
                    </div>
                )}
            </CommonModal>
        </>
    );
};

export default Review;

