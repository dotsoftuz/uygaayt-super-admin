import { Grid } from "@mui/material";
import { AutoCompleteFilter, Table } from "components";
import { reRenderTable } from "components/elements/Table/reducer/table.slice";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import SwitchView from "pages/order/components/SwitchView/SwitchView";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRoleManager } from "services/useRoleManager";
import { useAppDispatch } from "store/storeHooks";
import { useOrderTableColumns } from "./orderTable.columns";

const OrderTable = () => {
  const [stateUpdateData, setStateUpdateData] = useState<any>();
  const dis = useAppDispatch();
  const hasAccess = useRoleManager();

  const { mutate } = useApiMutation(
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
        position: 1,
      });
    }
  }, [stateUpdateData]);

  const columns = useOrderTableColumns(setStateUpdateData);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const renderHeader = (
    <>
      <Grid container width={200}>
        <Grid item sm={12}>
          <AutoCompleteFilter
            optionsUrl="order/states"
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
        dataUrl="order/pagin"
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
      />
    </>
  );
};

export default OrderTable;
