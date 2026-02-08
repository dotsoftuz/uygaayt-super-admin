import { Grid, MenuItem, Select } from "@mui/material";
import { Checkbox, ExportButton, FormDrawer, Table } from "components";
import WarningModal from "components/common/WarningModal/WarningModal";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import { IIdImage } from "hooks/usePostImage";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRoleManager } from "services/useRoleManager";
import { useAppDispatch } from "store/storeHooks";
import StoreForm from "../components/StoreForm";
import { useStoresRestaurantsColumns } from "./stores_restaurants.columns";
// Bu importlarni olib tashlang:
// import { getStoresFromLocalStorage, deleteStoreFromLocalStorage, activateStoreInLocalStorage, ILocalStore } from "../utils/localStorageUtils";

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
  // localStorage state'larini olib tashlang
  // const [localStores, setLocalStores] = useState<ILocalStore[]>([]);
  // const [reloadTrigger, setReloadTrigger] = useState(0);

  // localStorage useEffect'ni olib tashlang
  // useEffect(() => {
  //     const stores = getStoresFromLocalStorage();
  //     setLocalStores(stores);
  // }, [reloadTrigger]);

  const { mutate: activateStore } = useApiMutation("store/activate", "put", {
    onSuccess() {
      toast.success(t("general.success"));
      // window.location.reload() o'rniga Table'ni yangilash
    },
    onError() {
      toast.error("Xatolik yuz berdi");
    },
  });

  const handleActivate = (row: any) => {
    if (window.confirm(`${row.name} do'konini aktivlashtirmoqchimisiz?`)) {
      // Faqat API orqali aktivlashtirish
      activateStore({ _id: row._id, isActive: !row.isActive });
    }
  };

  const handleDelete = (storeId: string) => {
    // localStorage tekshiruvini olib tashlang
    setStoreId(storeId);
  };

  const columns = useStoresRestaurantsColumns(
    (row) => {
      navigate(`/stores_restaurants/${row._id}`);
    },
    hasAccess("storeUpdate")
      ? (row) => {
          setEditingStoreId(row._id);
          dispatch(setOpenDrawer(true));
        }
      : undefined,
    hasAccess("store") ? (row) => handleDelete(row._id) : undefined,
    handleActivate,
  );

  const queryParams = useMemo(
    () => ({
      isActive: formStore.watch("isActiveQuery") || undefined,
      type: formStore.watch("storeType") || undefined,
    }),
    [formStore.watch("isActiveQuery"), formStore.watch("storeType")],
  );

  const exportUrl: string = "store/export";

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
            width: "180px",
            paddingBlock: "4px",
            borderRadius: "10px",
          }}
          size="small"
          value={formStore.watch("storeType") || ""}
          onChange={(e) => formStore.setValue("storeType", e.target.value)}
          displayEmpty
        >
          {formStore.watch("storeType") && (
            <MenuItem value="">Barchasi</MenuItem>
          )}
          {!formStore.watch("storeType") && (
            <MenuItem value="" hidden disabled>
              Turi bo'yicha
            </MenuItem>
          )}
          <MenuItem value="shop">Do'kon</MenuItem>
          <MenuItem value="restaurant">Restoran/Kafe</MenuItem>
        </Select>
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

    // Form qiymatlarini tozalash
    formStore.reset({
      name: "",
      phoneNumber: "",
      password: "",
      email: "",
      website: "",
      addressName: "",
      addressLocation: null,
      type: "shop",
      categoryIds: [],
      orderMinimumPrice: "",
      deliveryPrice: "",
      itemPrepTimeFrom: "",
      itemPrepTimeTo: "",
      startTime: "",
      endTime: "",
      workDays: [1, 2, 3, 4, 5, 6, 7],
      description: "",
      descriptionTranslate: {
        uz: "",
        ru: "",
        en: "",
      },
      isActive: true,
      isVerified: false,
      isPremium: false,
      averageRating: 0,
      acceptCash: false,
      acceptCard: false,
      acceptOnlinePayment: false,
      // Filter qiymatlarini saqlab qolish
      isActiveQuery: formStore.watch("isActiveQuery"),
      storeType: formStore.watch("storeType"),
    });
  };

  // mapData funksiyasini o'zgartiring - localStorage'ni olib tashlang
  const mapData = (apiData: any[]) => {
    // Faqat API dan kelgan ma'lumotlarni qaytarish
    return apiData || [];
  };

  return (
    <>
      <Table
        columns={columns}
        dataUrl="store/paging"
        searchable
        headerChildren={renderHeader}
        onAddButton={
          hasAccess("store") ? () => dispatch(setOpenDrawer(true)) : undefined
        }
        onEditColumn={
          hasAccess("storeUpdate")
            ? (row) => {
                setEditingStoreId(row._id);
                dispatch(setOpenDrawer(true));
              }
            : undefined
        }
        onRowClick={(row) => {
          navigate(`/stores_restaurants/${row._id}`);
        }}
        exQueryParams={queryParams}
        mapData={mapData}
      />
      {/* localStorage tekshiruvini olib tashlang */}
      {storeId && (
        <WarningModal open={storeId} setOpen={setStoreId} url="store/delete" />
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
