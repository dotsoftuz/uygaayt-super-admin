import { ExportButton, FormDrawer, MainButton, Table } from "components";
import { useEffect, useState } from "react";
import { useCourierColumns } from "./courier.columns";
import { useAppDispatch } from "../../../store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRoleManager } from "services/useRoleManager";
import { IIdImage } from "hooks/usePostImage";
import CourierFrom from "../components/CourierForm";
import WarningModal from "components/common/WarningModalPost/WarningModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Grid } from "@mui/material";
import CommonButton from "components/common/commonButton/Button";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { Clusterer, Map, Placemark, YMaps } from "react-yandex-maps";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";

const Courier = () => {
  const allParams = useAllQueryParams();
  const [__, setParams] = useSearchParams();
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
  const [tab, setTab] = useState(allParams.type || "table");

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



  const handleChange = (tabValue: string) => {
    if (tabValue !== tab) {
      setTab(tabValue);
      setParams({ type: tabValue });
    }
  };

  useEffect(() => {
    if (!allParams.type) {
      setParams({ type: "table" });
    }
  }, [allParams, setParams]);


  const { mutate, data, status } = useApiMutation(
    `courier/map`,
    "post",
    {},
    true
  );

  const { data: storeAddress, status: storeAddressStatus } = useApi(
    "store/get",
    {},
    {
      suspense: false,
    }
  );

  useEffect(() => {
    if (tab === "map") {
      mutate({
        radius: 100000000
      });
    }
  }, [tab]);



  useEffect(() => {
    if (storeAddressStatus === "success") {
      formStore.reset();
    }
  }, [storeAddressStatus]);

  // Do'konning koordinatalari
  const storeCoordinates = [
    storeAddress?.data?.addressLocation?.latitude,
    storeAddress?.data?.addressLocation?.longitude,
  ];

  const getPointData = (location: any) => {
    return {
      balloonContentBody:
        " <strong>" +
        location?.firstName +
        " " +
        location?.lastName +
        "</strong>",
    };
  };

  return (
    <div className="bg-white h-full">
      <Grid className="w-full flex gap-x-3 items-center p-2">
        <Button
          variant={tab === "table" ? "contained" : "outlined"}
          sx={{
            height: 36,
            textTransform: "none",
          }}
          onClick={() => handleChange("table")}
        >
          {t("general.courier")}
        </Button>
        <Button
          variant={tab === "map" ? "contained" : "outlined"}
          sx={{
            height: 36,
            textTransform: "none",
          }}
          onClick={() => handleChange("map")}
        >
          {t("general.map")}
        </Button>
      </Grid>
      {tab === "table" ?
        <Table
          dataUrl="courier/paging"
          columns={columns}
          searchable
          onAddButton={hasAccess('courierCreate') ? () => dis(setOpenDrawer(true)) : undefined}
          onEditColumn={hasAccess('courierUpdate') ? (row) => {
            setEditingCourierId(row._id);
            dis(setOpenDrawer(true));
          } : undefined}
          onDeleteColumn={hasAccess('courierDelete') ? (row) => setCourierId(row._id) : undefined}
          onRowClick={(row) => navigate(`/courier/${row._id}`)}
          exQueryParams={{}}
        /> :

        <div style={{ height: "calc(100% - 140px)" }}>
          <YMaps query={{ load: "package.full" }}>
            <Map
              width="100%"
              height="100%"
              state={{
                center: storeCoordinates,
                zoom: 11,
                behaviors: ["default", "scrollZoom"],
              }}
            >
              <Clusterer
                options={{
                  // preset: "islands#invertedVioletClusterIcons",
                  groupByCoordinates: false,
                  clusterDisableClickZoom: true,
                  clusterHideIconOnBalloonOpen: false,
                  geoObjectHideIconOnBalloonOpen: false,
                }}
              >
                {data?.data?.map((location: any, index: number) => (
                  <Placemark
                    key={location?.addressLocationCoordination?.coordinates[1] + location?.addressLocationCoordination?.coordinates[0] + "_key"}
                    geometry={[location?.addressLocationCoordination?.coordinates[1], location?.addressLocationCoordination?.coordinates[0]]}
                    properties={getPointData(location)}
                    options={{
                      preset: location?.hasOrder !== true ? "islands#greenDotIcon" : "islands#redDotIcon", 
                    }}
                  />
                ))}
              </Clusterer>
            </Map>
          </YMaps>
        </div>
      }

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
    </div>
  );
};

export default Courier;
