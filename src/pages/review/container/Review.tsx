import { Table, AutoCompleteFilter } from "components";
import { useMemo, useState, useEffect } from "react";
import { useReviewColumns } from "./review.columns";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import { toast } from "react-toastify";
import WarningModal from "components/common/WarningModal/WarningModal";
import { get } from "lodash";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useSearchParams, useNavigate } from "react-router-dom";

const Review = () => {
    const [reviewId, setReviewId] = useState<any>();
    const [toggleReviewId, setToggleReviewId] = useState<any>();
    const { t } = useTranslation();
    const allParams = useAllQueryParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

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
                headerChildren={renderHeader}
                exQueryParams={queryParams}
                onRowClick={(row) => {
                    navigate(`/review/${row._id}`);
                }}
                onDeleteColumn={(row) => setReviewId(row._id)}
            />

            <WarningModal
                open={reviewId}
                setOpen={setReviewId}
                url={`review/delete`}
            />
        </>
    );
};

export default Review;

