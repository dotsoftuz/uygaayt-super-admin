import { Grid } from "@mui/material";
import { reRenderTable } from "components/elements/Table/reducer/table.slice";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import SwitchView from "pages/order/components/SwitchView/SwitchView";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRoleManager } from "services/useRoleManager";
import { useAppDispatch, useAppSelector } from "store/storeHooks";
import { useOrderTableColumns } from "./orderTable.columns";
import AutoCompleteFilter from "components/common/AutocompleteFilterGet/AutoCompleteFilter";
import { RangeDatePicker, Table } from "components";
import { socketReRender } from "store/reducers/SocketSlice";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";

const OrderTable = () => {
  const [stateUpdateData, setStateUpdateData] = useState<any>();
  const dis = useAppDispatch();
  const hasAccess = useRoleManager();
  const socketRender = useAppSelector((store) => store.SocketState.render);
  const allParams = useAllQueryParams();
  const [orderStates, setOrderStates] = useState([]);

  const { mutate, reset } = useApiMutation(
    `order/state/${stateUpdateData?.orderId}`,
    "put",
    {
      onSuccess() {
        setStateUpdateData(undefined);
        dis(reRenderTable(true));
      },
    }
  );

  useEffect(() => {
    if (stateUpdateData) {
      mutate({
        stateId: stateUpdateData.stateId,
        _id: stateUpdateData.orderId,
        position: 1,
      });
    }
  }, [stateUpdateData]);

  const columns = useOrderTableColumns(setStateUpdateData, orderStates);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (socketRender) {
      reset();
      dis(socketReRender(false));
    }
  }, [socketRender]);

  const renderHeader = (
    <>
      <Grid className="lg:w-[60%] w-full gap-y-2 sm:gap-y-0 grid sm:grid-cols-3 items-center gap-x-2">
        <Grid item className="">
          <AutoCompleteFilter
            optionsUrl="order-state/get-all"
            filterName="stateId"
            placeholder={t("common.status")}
            dataProp="data"

          />
        </Grid>
        <Grid item className="">
          <RangeDatePicker />
        </Grid>
        <Grid item className=" flex justify-end">
          <SwitchView />
        </Grid>
      </Grid>

    </>
  );

  const { data: columnState, status: columnStateStatus, refetch } = useApi(
    "order-state/get-all",
    {},
    {
      onSuccess({ data }) {
        console.log(data)
        setOrderStates(data || []);
      },
    }
  );

  return (
    <>
      <Table
        dataUrl="/order/paging"
        columns={columns}
        headerChildren={renderHeader}
        searchable
        // onAddButton={
        //   hasAccess("orderCreate") ? () => navigate("/order/add") : undefined
        // }
        onAddButton={() => navigate(`/order/add`)}
        // onRowClick={
        //   hasAccess("orderUpdate")
        //     ? (row) => navigate(`/order/${row._id}`)
        //     : undefined
        // }
        onRowClick={(row) => navigate(`/order/${row._id}`)}
        exQueryParams={{
          stateId: allParams?.stateId || undefined,
        }}
      />
    </>
  );
};

export default OrderTable;
