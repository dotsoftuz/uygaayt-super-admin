import { Grid } from "@mui/material";
import { reRenderTable } from "components/elements/Table/reducer/table.slice";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import SwitchView from "pages/order/components/SwitchView/SwitchView";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRoleManager } from "services/useRoleManager";
import { useAppDispatch, useAppSelector } from "store/storeHooks";
import { useOrderTableColumns } from "./orderTable.columns";
import AutoCompleteFilter from "components/common/AutocompleteFilterGet/AutoCompleteFilter";
import { Table } from "components";
import { socketReRender } from "store/reducers/SocketSlice";

const OrderTable = () => {
  const [stateUpdateData, setStateUpdateData] = useState<any>();
  const dis = useAppDispatch();
  const hasAccess = useRoleManager();
  const socketRender = useAppSelector((store) => store.SocketState.render);

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

  const columns = useOrderTableColumns(setStateUpdateData);
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
      <Grid container width={200}>
        <Grid item sm={12}>
          <AutoCompleteFilter
            optionsUrl="order-state/get-all"
            filterName="stateId"
            placeholder={t("common.status")}
            dataProp="data"
          />
        </Grid>
      </Grid>
      <SwitchView />
    </>
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
          stateId: undefined,
        }}
      />
    </>
  );
};

export default OrderTable;
