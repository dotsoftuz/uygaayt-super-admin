import { FormDrawer, Table } from "components";
import { useState } from "react";
import { useBannerColumns } from "./promo-code.columns";
import { useAppDispatch } from "../../../store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import BannerForm from "../components/PromoCodeForm";
import { useTranslation } from "react-i18next";
import { useRoleManager } from "services/useRoleManager";
import WarningModal from "components/common/WarningModal/WarningModal";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";

const PromoCode = () => {
  const [editingBannerId, setEditingBannerId] = useState<any>();
  const [bannerId, setBannerId] = useState<any>();
  const columns = useBannerColumns();
  const hasAccess = useRoleManager();
  const { t } = useTranslation();
  const dis = useAppDispatch();
  const formStore = useForm<any>();

  const resetForm = () => {
    setEditingBannerId(undefined);
    formStore.reset({
      title: "",
      imageId: "",
      description: "",
    });
  };

  return (
    <>
      <Table
        dataUrl="banner/paging"
        columns={columns}
        searchable
        onAddButton={hasAccess("bannerCreate")
          ? () => dis(setOpenDrawer(true))
          : undefined}
        onEditColumn={hasAccess("bannerUpdate") ? (row) => {
          setEditingBannerId(row._id);
          dis(setOpenDrawer(true));
        } : undefined}
        onDeleteColumn={hasAccess("bannerDelete") ? (row) => setBannerId(row._id) : undefined}
        exQueryParams={{}}
      />
      <WarningModal open={bannerId} setOpen={setBannerId} url="banner/delete" />
      <FormDrawer
        FORM_ID="promo-code"
        isEditing={!!editingBannerId}
        customTitle={editingBannerId ? t("promo_code.edit_promo_code") : t("promo_code.new_promo_code")}
        onClose={resetForm}
      >
        <BannerForm
          formStore={formStore}
          resetForm={resetForm}
          editingBannerId={editingBannerId}
        />
      </FormDrawer>

    </>
  );
};

export default PromoCode;
