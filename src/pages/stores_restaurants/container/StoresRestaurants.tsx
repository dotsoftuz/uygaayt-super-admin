import { AutoCompleteFilter, Checkbox, ExportButton, FormDrawer, Table } from "components";
import { useStoresRestaurantsColumns } from "./stores_restaurants.columns";
import { useAppDispatch } from "store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRoleManager } from "services/useRoleManager";
import { Grid, MenuItem, Select } from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import WarningModal from "components/common/WarningModal/WarningModal";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import { toast } from "react-toastify";
import StoreForm from "../components/StoreForm";
import { IIdImage } from "hooks/usePostImage";
import { getStoresFromLocalStorage, deleteStoreFromLocalStorage, activateStoreInLocalStorage, ILocalStore } from "../utils/localStorageUtils";

const StoresRestaurants = () => {
    const hasAccess = useRoleManager();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const formStore = useForm();
    const navigate = useNavigate();
    const [editingStoreId, setEditingStoreId] = useState<any>();
    const [storeId, setStoreId] = useState("");
    const [logoImage, setLogoImage] = useState<IIdImage | null>(null);
    const [bannerImage, setBannerImage] = useState<IIdImage | null>(null);
    const [localStores, setLocalStores] = useState<ILocalStore[]>([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    // localStorage'dan do'konlarni o'qish
    useEffect(() => {
        const stores = getStoresFromLocalStorage();
        setLocalStores(stores);
    }, [reloadTrigger]);

    const { mutate: activateStore } = useApiMutation("store/activate", "put", {
        onSuccess() {
            toast.success(t("general.success"));
            window.location.reload();
        },
        onError() {
            toast.error("Xatolik yuz berdi");
        },
    });

    const handleActivate = (row: any) => {
        if (window.confirm(`${row.name} do'konini aktivlashtirmoqchimisiz?`)) {
            // localStorage'dan aktivlashtirish
            if (row._id?.startsWith('store_')) {
                activateStoreInLocalStorage(row._id);
                setReloadTrigger(prev => prev + 1);
                toast.success("Do'kon aktivlashtirildi!");
            } else {
                // API orqali aktivlashtirish (keyinchalik)
                activateStore({ id: row._id });
            }
        }
    };

    const handleDelete = (storeId: string) => {
        if (storeId?.startsWith('store_')) {
            // localStorage'dan o'chirish
            deleteStoreFromLocalStorage(storeId);
            setReloadTrigger(prev => prev + 1);
            toast.success("Do'kon o'chirildi!");
        } else {
            // API orqali o'chirish (keyinchalik)
            setStoreId(storeId);
        }
    };

    const columns = useStoresRestaurantsColumns(
        (row) => navigate(`/stores_restaurants/${row._id}`),
        hasAccess("storeUpdate")
            ? (row) => {
                setEditingStoreId(row._id);
                dispatch(setOpenDrawer(true));
            }
            : undefined,
        hasAccess("store") ? (row) => handleDelete(row._id) : undefined,
        handleActivate
    );

    const queryParams = useMemo(
        () => ({
            isActive: formStore.watch("isActiveQuery") || undefined,
            categoryId: formStore.watch("categoryId") || undefined,
            orderSort: formStore.watch("orderSort") || undefined,
        }),
        [
            formStore.watch("isActiveQuery"),
            formStore.watch("categoryId"),
            formStore.watch("orderSort"),
        ]
    );

    const exportUrl: string = "/store/export";

    const renderHeader = (
        <Grid className="lg:w-[80%] w-full flex flex-wrap gap-2 items-center mt-2 ml-2 pb-2">
            <Grid item>
                <Checkbox
                    control={formStore.control}
                    label={t("enum.active")}
                    name="isActiveQuery"
                />
            </Grid>
            <Grid item>
                <Select
                    style={{
                        width: "150px",
                        paddingBlock: "4px",
                        borderRadius: "10px",
                    }}
                    size="small"
                    value={formStore.watch("orderSort") || ""}
                    onChange={(e) => formStore.setValue("orderSort", e.target.value)}
                    displayEmpty
                >
                    {formStore.watch("orderSort") && (
                        <MenuItem value="">Tozalash</MenuItem>
                    )}
                    {!formStore.watch("orderSort") && (
                        <MenuItem value="" hidden disabled>
                            Buyurtma soni
                        </MenuItem>
                    )}
                    <MenuItem value="mostActive">Eng faol</MenuItem>
                    <MenuItem value="leastActive">Eng kam</MenuItem>
                </Select>
            </Grid>
            <Grid item>
                <AutoCompleteFilter
                    optionsUrl="category/paging"
                    filterName="categoryId"
                    placeholder={t("common.category")}
                    onChange={() => { }}
                />
            </Grid>
            <Grid item>
                <ExportButton url={exportUrl} extraParams={queryParams} />
            </Grid>
        </Grid>
    );

    const resetForm = () => {
        setEditingStoreId(null);
        setLogoImage(null);
        setBannerImage(null);
        setReloadTrigger(prev => prev + 1); // localStorage'dan yangi ma'lumotlarni o'qish
        formStore.reset({
            name: "",
            phoneNumber: "",
            addressName: "",
            addressLocation: null,
            categoryId: formStore.watch("categoryId") || "",
            storeType: "",
            minimumOrderAmount: "",
            commissionPercent: "",
            paymentMethods: {
                card: false,
                cash: false,
                bonus: false,
            },
            startTime: "",
            endTime: "",
            description: "",
            logoId: null,
            bannerId: null,
            isActiveQuery: formStore.watch("isActiveQuery"),
            orderSort: formStore.watch("orderSort"),
        });
    };

    // localStorage va API ma'lumotlarini birlashtirish
    const mapData = (apiData: any[]) => {
        // API dan kelgan ma'lumotlar
        const apiStores = apiData || [];
        // localStorage'dan kelgan ma'lumotlar
        const localStoresData = localStores || [];

        // Birlashtirish (localStorage ma'lumotlari birinchi bo'lib ko'rsatiladi)
        return [...localStoresData, ...apiStores];
    };

    return (
        <>
            <Table
                columns={columns}
                dataUrl="store/paging"
                searchable
                headerChildren={renderHeader}
                onAddButton={
                    hasAccess("store")
                        ? () => dispatch(setOpenDrawer(true))
                        : undefined
                }
                onEditColumn={
                    hasAccess("storeUpdate")
                        ? (row) => {
                            setEditingStoreId(row._id);
                            dispatch(setOpenDrawer(true));
                        }
                        : undefined
                }
                exQueryParams={queryParams}
                mapData={mapData}
            />
            {storeId && !storeId?.startsWith('store_') && (
                <WarningModal
                    open={storeId}
                    setOpen={setStoreId}
                    url="store/delete"
                />
            )}
            <FormDrawer
                FORM_ID="store"
                isEditing={!!editingStoreId}
                customTitle={editingStoreId ? "Do'konni tahrirlash" : "Do'kon qo'shish"}
                onClose={resetForm}
            >
                <StoreForm
                    formStore={formStore}
                    editingStoreId={editingStoreId}
                    resetForm={resetForm}
                    storeProps={{
                        logoImage,
                        setLogoImage,
                        bannerImage,
                        setBannerImage,
                    }}
                />
            </FormDrawer>
        </>
    );
};

export default StoresRestaurants;

