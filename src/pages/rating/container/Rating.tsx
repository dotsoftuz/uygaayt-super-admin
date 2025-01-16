import { FormDrawer, Table } from "components";
import { useState } from "react";
import { useRatingColumns } from "./rating.columns";
import { useAppDispatch } from "../../../store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import RatingForm from "../components/RatingForm";
import { useTranslation } from "react-i18next";
import WarningModal from "components/common/WarningModal/WarningModal";
import { RatingStyled } from "./Rating.styled";
import { RATINGS } from "types/enums";
import { StarIcon } from "assets/svgs";
import { useRoleManager } from "services/useRoleManager";

const Rating = () => {
  const [editingRatingId, setEditingRatingId] = useState<any>();
  const [ratingId, setRatingId] = useState<any>();
  const columns = useRatingColumns();
  const { t } = useTranslation();
  const dis = useAppDispatch();
  const formStore = useForm<any>();
  const [rate, setRate] = useState(5);

  const resetForm = () => {
    setEditingRatingId(undefined);
    formStore.reset({
      title: {
        uz: "",
        ru: "",
        en: "",
      },
      imageId: "",
    });
  };

  const renderHeader = (
    <div className="w-full lg:w-[80%] ratings gap-2 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5">
      {RATINGS.map((item) => {
        return (
          <div
            className={`rating  ${rate === item.rate && "active"}`}
            onClick={() => setRate(item.rate)}
          >
            {Array.from({ length: item.rate }, (_, i) => i + 1).map((e) => (
              <StarIcon />
            ))}
          </div>
        );
      })}
    </div>
  );

  const hasAccess = useRoleManager();

  return (
    <RatingStyled>
      <Table
        dataUrl="rate-comment/paging"
        columns={columns}
        headerChildren={renderHeader}
        exQueryParams={{
          rate,
        }}
        onAddButton={
          hasAccess("rateCommentCreate")
            ? () => dis(setOpenDrawer(true))
            : undefined
        }
        onEditColumn={
          hasAccess("rateCommentUpdate")
            ? (row) => {
                setEditingRatingId(row._id);
                dis(setOpenDrawer(true));
              }
            : undefined
        }
        onDeleteColumn={
          hasAccess("rateCommentDelete")
            ? (row) => setRatingId(row._id)
            : undefined
        }
      />
      <WarningModal open={ratingId} setOpen={setRatingId} url="rate-comment/delete" />
      <FormDrawer
        FORM_ID="rating"
        isEditing={!!editingRatingId}
        customTitle={t("general.addBanner")}
        onClose={resetForm}
      >
        <RatingForm
          formStore={formStore}
          resetForm={resetForm}
          editingRatingId={editingRatingId}
          rate={rate}
        />
      </FormDrawer>
    </RatingStyled>
  );
};

export default Rating;
