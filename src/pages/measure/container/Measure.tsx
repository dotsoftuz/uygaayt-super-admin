import { FormDrawer, Table } from "components";
import { useState } from "react";
import { useRatingColumns } from "./measure.columns";
import { useAppDispatch } from "../../../store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import WarningModal from "components/common/WarningModal/WarningModal";
import MeasureForm from "../components/MeasureForm";

const Measure = () => {
  const [editingMeasureId, setEditingMeasureId] = useState<any>();
  const [ratingId, setMeasureId] = useState<any>();
  const columns = useRatingColumns();
  const { t } = useTranslation();
  const dis = useAppDispatch();
  const formStore = useForm<any>();

  const resetForm = () => {
    setEditingMeasureId(undefined);
    formStore.reset({
      name: "",
      symbol: ""
    });
  };

  return (
    <>
      <Table
        dataUrl="measure"
        columns={columns}
        onAddButton={() => dis(setOpenDrawer(true))}
        onEditColumn={(row) => {
          setEditingMeasureId(row._id);
          dis(setOpenDrawer(true));
        }}
        onDeleteColumn={(row) => setMeasureId(row._id)}
      />
      <WarningModal open={ratingId} setOpen={setMeasureId} url="measure" />
      <FormDrawer
        FORM_ID="rating"
        isEditing={!!editingMeasureId}
        customTitle={t("general.addBanner")}
        onClose={resetForm}
      >
        <MeasureForm
          formStore={formStore}
          resetForm={resetForm}
          editingMeasureId={editingMeasureId}
        />
      </FormDrawer>
    </>
  );
};

export default Measure;
