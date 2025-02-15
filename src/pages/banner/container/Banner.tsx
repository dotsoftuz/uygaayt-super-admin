import { FormDrawer, Table } from "components";
import { useMemo, useState } from "react";
import { useBannerColumns } from "./banner.columns";
import { useAppDispatch } from "../../../store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import BannerForm from "../components/BannerForm";
import { useTranslation } from "react-i18next";
import { useRoleManager } from "services/useRoleManager";
import WarningModal from "components/common/WarningModal/WarningModal";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";

const Banner = () => {
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

  const queryParams = useMemo(() => ({}), []);

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
        exQueryParams={queryParams}
      />
      <WarningModal open={bannerId} setOpen={setBannerId} url="banner/delete" />
      <FormDrawer
        FORM_ID="banner"
        isEditing={!!editingBannerId}
        customTitle={editingBannerId ? t("general.editBanner") : t("general.addBanner")}
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

export default Banner;
