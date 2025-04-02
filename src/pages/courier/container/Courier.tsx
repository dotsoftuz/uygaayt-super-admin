import { FormDrawer, Table } from "components";
import { useEffect, useMemo, useState } from "react";
import { useCourierColumns } from "./courier.columns";
import { useAppDispatch, useAppSelector } from "../../../store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRoleManager } from "services/useRoleManager";

import CourierFrom from "../components/CourierForm";
import WarningModal from "components/common/WarningModalPost/WarningModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Checkbox, Grid, TextField } from "@mui/material";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import CourierMap from "../components/CourierMap";
import { socket } from "socket";
import { socketReRender } from "store/reducers/SocketSlice";
import { IIdImage } from "hooks/usePostImage";

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
  const [showDriverName, setShowDriverName] = useState<boolean>(true);
  const [radius, setRadius] = useState<any>(200000)
  const socketRender = useAppSelector((store) => store.SocketState.render);
  const [couriers, setCouriers] = useState<any[]>([]);
  

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


  const { mutate, data, reset, status } = useApiMutation(
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
        radius: +radius
      });
    }
  }, [tab, radius]);


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

  const queryParams = useMemo(() => ({}), []);

  useEffect(() => {
    if (socketRender) {
      reset()
      dis(socketReRender(false));
    }
  }, [socketRender]);

  useEffect(() => {
    const handleUpdateCourier = (socketData: { data: any }) => {
      setCouriers((prevCouriers) => {
        const updatedCouriers = prevCouriers.map((courier) =>
          courier._id === socketData.data.courierId
            ? { ...courier, location: socketData.data.location }
            : courier
        );
  
        return updatedCouriers;
      });
    };
  
    socket.on("courierLocation", handleUpdateCourier);
  
    return () => {
      socket.off("courierLocation", handleUpdateCourier);
    };
  }, []);
  
  
  useEffect(() => {
    if (data?.data) {
      setCouriers((prevCouriers) => {
        const courierMap = new Map(prevCouriers.map((c) => [c.courierId, c]));
  
        data.data.forEach((courier: any) => {
          courierMap.set(courier._id, courier);
        });
  
        return Array.from(courierMap.values());
      });
  
      reset();
    }
  }, [data]);
  

  return (
    <div className="bg-white h-full">
      <Grid className="w-full flex gap-x-3 items-center p-2">
        <Button
          variant={tab === "table" ? "contained" : "outlined"}
          sx={{
            height: 36,
            textTransform: "none",
            backgroundColor: tab === "table" ? "#EB5B00" : "transparent",
            borderColor: "#EB5B00",
            color: tab === "table" ? "#fff" : "#EB5B00",
            '&:hover': {
              backgroundColor: tab === "table" ? "#EB5B00" : "rgba(235, 91, 0, 0.1)",
              borderColor: "#EB5B00",
            },
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
            backgroundColor: tab === "map" ? "#EB5B00" : "transparent",
            borderColor: "#EB5B00",
            color: tab === "map" ? "#fff" : "#EB5B00",
            '&:hover': {
              backgroundColor: tab === "map" ? "#EB5B00" : "rgba(235, 91, 0, 0.1)",
              borderColor: "#EB5B00",
            },
          }}
          onClick={() => handleChange("map")}
        >
          {t("general.map")}
        </Button>
      </Grid>
      {
        tab === "map" ?
          <Grid className="flex items-center justify-between px-2">
            <div>
              <Checkbox
                id="showDriverName"
                checked={showDriverName}
                onChange={(event: any) => {
                  setShowDriverName(event.target.checked as boolean);
                }}
              />
              <label htmlFor="showDriverName" className="hover">
                {t('general.show_name')}
              </label>
            </div>
            <div>
              <TextField
                value={radius / 1000}
                onChange={(e) => {
                  const kmValue = parseFloat(e.target.value) || 0;
                  setRadius(kmValue * 1000);
                }}
                size="small"
                placeholder={String(t('general.radius'))}
                label={t('general.radius')}
                type="number"
              />
            </div>
          </Grid>
          : null
      }
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
          exQueryParams={queryParams}
        /> :
        <CourierMap couriers={couriers} storeCoordinates={storeCoordinates} showDriverName={showDriverName} />
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
