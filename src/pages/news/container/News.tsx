import { FormDrawer, Table } from "components";
import { useState } from "react";
import { useBannerColumns } from "./news.columns";
import { useAppDispatch } from "../../../store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import BannerForm from "../components/NewsForm";
import { useTranslation } from "react-i18next";
import { useRoleManager } from "services/useRoleManager";
import WarningModal from "components/common/WarningModal/WarningModal";

const News = () => {
  const [editingNewsId, setEditingNewsId] = useState<any>();
  const [newsId, setNewsId] = useState<any>();
  const columns = useBannerColumns();
  const hasAccess = useRoleManager();
  const { t } = useTranslation();
  const dis = useAppDispatch();
  const formStore = useForm<any>();

  const resetForm = () => {
    setEditingNewsId(undefined);
    formStore.reset({
      title: { uz: "", ru: "", en: "" },
      imageId: "",
      description: "",
    });
  };


  return (
    <>
      <Table
        dataUrl="news/paging"
        columns={columns}
        searchable
        onAddButton={() => dis(setOpenDrawer(true))}
        onEditColumn={(row) => {
          setEditingNewsId(row._id);
          dis(setOpenDrawer(true));
        }}
        onDeleteColumn={(row) => setNewsId(row._id)}
        exQueryParams={{}}
      />
      <WarningModal open={newsId} setOpen={setNewsId} url="news/delete" />
      <FormDrawer
        FORM_ID="banner"
        isEditing={!!editingNewsId}
        customTitle={t("general.addNews")}
        onClose={resetForm}
      >
        <BannerForm
          formStore={formStore}
          resetForm={resetForm}
          editingNewsId={editingNewsId}
        />
      </FormDrawer>
    </>
  );
};

export default News;
