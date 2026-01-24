import { History } from "@mui/icons-material";
import { Box, Grid, Paper, Tab, Tabs } from "@mui/material";
import { Tooltip } from "antd";
import { RangeDatePicker, Select, Table } from "components";
import AutoCompleteFilter from "components/common/AutocompleteFilterGet/AutoCompleteFilter";
import { reRenderTable } from "components/elements/Table/reducer/table.slice";
import dayjs from "dayjs";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { socketReRender } from "store/reducers/SocketSlice";
import { useAppDispatch, useAppSelector } from "store/storeHooks";
import styled from "styled-components";
import { numberFormat } from "utils/numberFormat";

const StateSelectStyled = styled.div<{ stateColor: string; luma: any }>`
  margin-bottom: 5px;
  .MuiInputBase-root {
    background-color: ${({ stateColor }) => stateColor};
    color: ${({ luma }) => (luma > 60 ? "#232323" : "#ffffff")} !important;
  }
  & .MuiSelect-select.Mui-disabled {
    color: ${({ luma }) => (luma > 60 ? "#232323" : "#ffffff")} !important;
    -webkit-text-fill-color: ${({ luma }) =>
      luma > 60 ? "#232323" : "#ffffff"} !important;
  }

  & svg {
    path {
      fill: ${({ luma }) => (luma > 60 ? "#232323" : "#ffffff")} !important;
    }
  }
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface StoreTabsProps {
  storeId: string;
  store: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`store-tabpanel-${index}`}
      aria-labelledby={`store-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const StoreTabs: React.FC<StoreTabsProps> = ({ storeId, store }) => {
  const [value, setValue] = useState(0);
  const [stateUpdateData, setStateUpdateData] = useState<any>();
  const [orderStates, setOrderStates] = useState([]);
  const { t } = useTranslation();
  const allParams = useAllQueryParams();
  const navigate = useNavigate();
  const dis = useAppDispatch();
  const socketRender = useAppSelector((store) => store.SocketState.render);

  const { mutate: getStatistics, data: statisticsData } = useApiMutation(
    "store/statistics",
    "post",
    {
      onError: () => {},
    },
  );

  const { mutate, reset } = useApiMutation(
    `order/state/${stateUpdateData?.orderId}`,
    "put",
    {
      onSuccess() {
        setStateUpdateData(undefined);
        dis(reRenderTable(true));
      },
    },
  );

  const {
    data: columnState,
    status: columnStateStatus,
    refetch,
  } = useApi(
    "order-state/get-all",
    {},
    {
      onSuccess({ data }) {
        setOrderStates(data || []);
      },
    },
  );

  useEffect(() => {
    if (value === 1 && storeId) {
      getStatistics({
        storeId: storeId,
        ...(allParams?.dateFrom && allParams?.dateTo
          ? {
              dateFrom: new Date(allParams.dateFrom),
              dateTo: new Date(allParams.dateTo),
            }
          : {}),
      });
    }
  }, [value, allParams.dateFrom, allParams.dateTo, storeId]);

  useEffect(() => {
    if (stateUpdateData) {
      mutate({
        stateId: stateUpdateData.stateId,
        _id: stateUpdateData.orderId,
        position: 1,
      });
    }
  }, [stateUpdateData]);

  useEffect(() => {
    if (socketRender) {
      reset();
      dis(socketReRender(false));
    }
  }, [socketRender]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const statistics = statisticsData?.data || {};

  const orderColumns = [
    {
      field: t("common.number"),
      renderCell({ row }: { row: any }) {
        return row.number;
      },
      flex: 0.6,
    },
    {
      field: t("common.price"),
      renderCell({ row }: { row: any }) {
        return numberFormat(row.totalPrice);
      },
      flex: 0.6,
    },
    {
      field: t("order.receiver"),
      renderCell({ row }: { row: any }) {
        const firstName = row?.customer?.firstName;
        const shortFirst =
          firstName?.length > 10
            ? `${firstName.substring(0, 10)}...`
            : firstName;

        const lastName = row?.customer?.lastName;
        const shortLast =
          lastName?.length > 10 ? `${lastName.substring(0, 10)}...` : lastName;

        const fullName = `${shortFirst}${lastName ? ` ${shortLast}` : ""}`;
        const tooltipText = `${firstName}${lastName ? ` ${lastName}` : ""}`;

        return (
          <Tooltip title={tooltipText} arrow>
            <span>{fullName}</span>
          </Tooltip>
        );
      },
    },
    {
      field: t("common.phoneNumber"),
      renderCell({ row }: { row: any }) {
        return row.customer?.phoneNumber;
      },
    },
    {
      field: t("common.receiverPhoneNumber"),
      renderCell({ row }: { row: any }) {
        return row.receiverCustomer?.phoneNumber;
      },
    },
    {
      field: t("common.paymentType"),
      renderCell({ row }: { row: any }) {
        return t(`enum.${row.paymentType}`);
      },
      flex: 0.6,
    },
    {
      field: t("common.time"),
      renderCell({ row }: { row: any }) {
        return dayjs(row.createdAt).format("DD.MM.YYYY HH:mm");
      },
    },
    {
      field: t("common.status"),
      renderCell({ row }: { row: any }) {
        const c: any = row?.state?.color?.substring(1);
        const rgb = parseInt(c, 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = rgb & 0xff;
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        return (
          <StateSelectStyled
            stateColor={row?.state?.color}
            luma={luma}
            onClick={(event) => event.stopPropagation()}
          >
            <Select
              onChange={(id) =>
                setStateUpdateData({
                  stateId: id,
                  orderId: row._id,
                })
              }
              customValue={row.stateId}
              options={orderStates}
              disabled={
                row.state?.state === "completed" ||
                row.state?.state === "cancelled"
              }
            />
          </StateSelectStyled>
        );
      },
    },
  ];

  const renderOrderHeader = (
    <>
      <Grid className="lg:w-[60%] w-full gap-y-2 sm:gap-y-0 grid sm:grid-cols-2 items-center gap-x-2">
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
      </Grid>
    </>
  );

  return (
    <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden", flex: 1 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="store tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
            },
            "& .Mui-selected": {
              color: "#EB5B00",
            },
          }}
        >
          <Tab icon={<History />} iconPosition="start" label="Buyurtmalar" />
          {/* <Tab icon={<Analytics />} iconPosition="start" label="Statistika" /> */}
          {/* <Tab icon={<Payment />} iconPosition="start" label="Transaksiyalar" /> */}
          {/* <Tab
            icon={<AccountBalance />}
            iconPosition="start"
            label="Hisob-kitoblar"
          /> */}
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Table
          columns={orderColumns}
          dataUrl="/order/paging"
          headerChildren={renderOrderHeader}
          searchable
          onRowClick={(row) => navigate(`/order/${row._id}`)}
          exQueryParams={{
            storeId: storeId,
            ...(allParams?.stateId && allParams.stateId.trim() !== ""
              ? { stateId: allParams.stateId }
              : {}),
            ...(allParams?.dateFrom && allParams?.dateTo
              ? {
                  dateFrom: new Date(allParams.dateFrom),
                  dateTo: new Date(allParams.dateTo),
                }
              : {}),
          }}
        />
      </TabPanel>

      {/* <TabPanel value={value} index={1}>
        <Box sx={{ mb: 3 }}>
          <RangeDatePicker />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, backgroundColor: "#F7FAFC", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUp sx={{ color: "#10B981", mr: 1 }} />
                <Typography variant="h6">Umumiy daromad</Typography>
              </Box>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {numberFormat(statistics.totalRevenue || 0)}{" "}
                {t("common.symbol")}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, backgroundColor: "#F7FAFC", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ShoppingCart sx={{ color: "#3B82F6", mr: 1 }} />
                <Typography variant="h6">Umumiy buyurtmalar</Typography>
              </Box>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {statistics.totalOrders || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, backgroundColor: "#F7FAFC", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CheckCircle sx={{ color: "#10B981", mr: 1 }} />
                <Typography variant="h6">Bajarilgan buyurtmalar</Typography>
              </Box>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {statistics.completedOrders || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, backgroundColor: "#F7FAFC", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Cancel sx={{ color: "#EF4444", mr: 1 }} />
                <Typography variant="h6">Bekor qilingan buyurtmalar</Typography>
              </Box>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {statistics.cancelledOrders || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel> */}

      {/* <TabPanel value={value} index={2}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <RangeDatePicker />
            </Grid>
          </Grid>
        </Box>

        <Table
          columns={[
            {
              field: "id",
              headerName: "ID",
              width: 100,
              renderCell: ({ row }: { row: any }) =>
                row._id?.slice(-4) || row.id || "-",
            },
            {
              field: "date",
              headerName: "Sana",
              flex: 1,
              minWidth: 150,
              renderCell: ({ row }: { row: any }) =>
                row.createdAt
                  ? dayjs(row.createdAt).format("YYYY-MM-DD HH:mm")
                  : "-",
            },
            {
              field: "amount",
              headerName: "Summa",
              flex: 1,
              minWidth: 120,
              renderCell: ({ row }: { row: any }) =>
                numberFormat(row.amount || 0) + " " + t("common.symbol"),
            },
            {
              field: "type",
              headerName: "Turi",
              flex: 1,
              minWidth: 120,
              renderCell: ({ row }: { row: any }) => row.type || "-",
            },
            {
              field: "description",
              headerName: "Izoh",
              flex: 1,
              minWidth: 150,
              renderCell: ({ row }: { row: any }) => row.description || "-",
            },
          ]}
          dataUrl="balance/paging"
          searchable={false}
          exQueryParams={{
            storeId: storeId,
            ...(allParams?.dateFrom && allParams?.dateTo
              ? {
                  dateFrom: new Date(allParams.dateFrom),
                  dateTo: new Date(allParams.dateTo),
                }
              : {}),
          }}
        />
      </TabPanel> */}

      {/* <TabPanel value={value} index={3}>
        <Accounting storeId={storeId} store={store} />
      </TabPanel> */}
    </Paper>
  );
};
