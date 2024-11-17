import { FormDrawer, Table } from "components";
import { useState } from "react";
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

  const { mutate: data, status } = useApiMutation("/banner/paging",
    "post"
  );


  console.log(data)

  return (
    <>
      <Table
        dataUrl="/banner/get-by-id/67388f7872ed4c074cefd556"
        columns={columns}
        searchable
        onAddButton={() => dis(setOpenDrawer(true))}
        onEditColumn={(row) => {
          setEditingBannerId(row._id);
          dis(setOpenDrawer(true));
        }}
        onDeleteColumn={(row) => setBannerId(row._id)}
      />
      <WarningModal open={bannerId} setOpen={setBannerId} url="banner" />
      <FormDrawer
        FORM_ID="banner"
        isEditing={!!editingBannerId}
        customTitle={t("general.addBanner")}
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
