import { ExportButton, FormDrawer, Table } from "components";
import { useState } from "react";
import { useCourierColumns } from "./courier_analytics.columns";
import { useAppDispatch } from "../../../store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRoleManager } from "services/useRoleManager";
import { IIdImage } from "hooks/usePostImage";
import CourierFrom from "../components/CourierForm";
import WarningModal from "components/common/WarningModalPost/WarningModal";
import { useNavigate } from "react-router-dom";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { Grid } from "@mui/material";

const CourierAnalytics = () => {
  const [editingCourierId, setEditingCourierId] = useState<any>();
  const [courierId, setCourierId] = useState<any>();
  const columns = useCourierColumns();
  const hasAccess = useRoleManager();
  const { t } = useTranslation();
  const dis = useAppDispatch();
  const formStore = useForm<any>();
  const [courierImages, setCourierImages] = useState<IIdImage[]>([]);
  const [mainImageId, setMainImageId] = useState<any>();
  const navigate = useNavigate();
  const allParams = useAllQueryParams();


  const resetForm = () => {
    setEditingCourierId(undefined);
    formStore.reset({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      carBrand: "",
      carColor: "",
      carModel: "",
      carNumber: "",
      imageUrl: "",
    });
  };

  const exportUrl = `/report/courier/export/${allParams.dateFrom ? `dateFrom=${allParams.dateFrom}&` : ""
    }${allParams?.dateTo ? `dateTo=${allParams.dateTo}&` : ""}`;

  const renderHeader = (
    <Grid className="w-full flex justify-end items-center pb-2">
      <Grid>
        <ExportButton url={exportUrl} />
      </Grid>
    </Grid>
  );



  return (
    <>
      <Table
        dataUrl="report/courier"
        columns={columns}
        // searchable
        headerChildren={renderHeader}
        // onAddButton={hasAccess('courierCreate') ? () => dis(setOpenDrawer(true)) : undefined}
        onEditColumn={hasAccess('courierUpdate') ? (row) => {
          setEditingCourierId(row._id);
          dis(setOpenDrawer(true));
        } : undefined}
        onDeleteColumn={hasAccess('courierDelete') ? (row) => setCourierId(row._id) : undefined}
        onRowClick={(row) => navigate(`/courier/${row._id}`)}
        exQueryParams={{}}
      />
      <WarningModal open={courierId} setOpen={setCourierId} url="courier/delete" />
      <FormDrawer
        FORM_ID="courier"
        isEditing={!!editingCourierId}
        customTitle={t("general.addCourier")}
        onClose={resetForm}
      >
        <CourierFrom
          formStore={formStore}
          resetForm={resetForm}
          editingCourierId={editingCourierId}
          productProps={{
            courierImages,
            setCourierImages,
            mainImageId,
            setMainImageId,
          }}
        />
      </FormDrawer>
    </>
  );
};

export default CourierAnalytics;
