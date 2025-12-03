import { DataGrid, GridColumns, GridRowParams } from "@mui/x-data-grid";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useDebounce from "hooks/useDebounce";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "store/storeHooks";
import NoDataFound from "./components/noDataFound";
import TableHeader from "./components/tableHeader";
import TablePagination from "./components/tablePagination";
import { reRenderTable } from "./reducer/table.slice";
import { IQueryParams, ITable, ITableData } from "./Table.constants";
import { TableContainerMain } from "./Table.style";
import { getTableColumns, localization } from "./utils";
import { socketReRender } from "store/reducers/SocketSlice";
import { useLocation, useSearchParams } from "react-router-dom";

const Table = <TData extends { _id: string }>({
  onEditColumn,
  onDeleteColumn,
  onRowClick = undefined,
  onAddButton,
  onDeleteSuccess,
  onDataChange,
  getAllData,
  onSeenClick,
  isRowSelectable = () => true,
  mapData,

  dataUrl,
  deleteUrl,
  columns,
  title,
  exQueryParams = {},
  tableHeight,
  searchable = false,
  deletable = false,
  selection = deletable ? true : false,
  hasPagination = true,
  numerate = true,
  isGetAll = false,
  addButtonTitle,
  noRerender,

  headerChildren,
  headerChildrenSecondRow,
  insteadOfTable,
  getUniqueId,
  processingParams,
}: ITable<TData>) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const allParams = useAllQueryParams();

  const [search, setSearch] = useState<any>(allParams.search || "");
  const { debouncedValue: debValue } = useDebounce(search, 500);
  const isOpen = useAppSelector((store) => store.formDrawerState.isOpen);
  const reRender = useAppSelector((store) => store.tableState.render);
  const socketRender = useAppSelector((store) => store.SocketState.render);
  const dis = useDispatch();
  const defaultLimit = 20;
  const { search: locationSearch } = useLocation();

  const filterParams = useMemo(() => {
    if (processingParams) {
      const params: Record<string, any> = {};
      const queryData = processingParams(allParams);

      Object.entries(queryData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });

      return params;
    }
    return undefined;
  }, [locationSearch]);

  /** Update query params when search changes */
  useEffect(() => {
    if (!isGetAll) {
      setSearchParams({
        ...allParams,
        ...exQueryParams, // FIX 1: external filters qo‘shildi
        search: search || "",
        page: search ? "1" : allParams.page || "1",
        limit: allParams.limit || "20",
      });
    }
  }, [debValue]);

  /** Fetch data */
  const { mutate, reset, data, isLoading } = useApiMutation(dataUrl, "post", {
    onSuccess(response) {
      const tableData = isGetAll
        ? get(response, "data", [])
        : response?.data?.data;

      onDataChange?.(tableData);
      getAllData?.(response?.data);

      if (response?.data?.total > 0 && response?.data?.data?.length === 0) {
        setSearchParams({
          ...(filterParams ? { ...filterParams } : { ...allParams }),
          ...exQueryParams, // FIX 2: filter params yo‘qolmasligi uchun
          ...allParams,
          search: debValue || "",
          page: search ? "1" : allParams.page || "1",
          limit: allParams.limit || defaultLimit + "",
        });
      }
      console.log("response", response);
    },
  });
  console.log("data", data);

  /** Trigger data fetch */
  useEffect(() => {
    mutate({
      ...allParams,
      ...exQueryParams, // FIX 3: backendga to‘g‘ri query boradi
    });
  }, [debValue, reRender, exQueryParams, locationSearch]);

  /** Delete request */
  const { mutate: deleteMutate, isSuccess: isDeleteSuccess } = useApiMutation(
    deleteUrl || dataUrl,
    "delete"
  );

  const onDelete = () => {
    deleteMutate({ ids: selectedRows });
  };

  useEffect(() => {
    if (isDeleteSuccess) {
      reset();
      onDeleteSuccess?.();
    }
    if (reRender && !noRerender) {
      reset();
      dis(reRenderTable(false));
    }
  }, [isDeleteSuccess, isOpen, reRender]);

  useEffect(() => {
    if (socketRender) {
      dis(socketReRender(false));
    }
  }, [socketRender]);

  /** Prepare table data */
  const tableData: TData[] = React.useMemo(() => {
    const dataKey: any[] = isGetAll
      ? get(data, "data.products", [])
      : data?.data?.data;

    if (isGetAll && searchable && search) {
      return dataKey?.filter(
        (item) =>
          item?.firstName?.toLowerCase()?.includes(search) ||
          item?.lastName?.toLowerCase()?.includes(search) ||
          item?.name?.toLowerCase()?.includes(search) ||
          item?.car?.name?.toLowerCase()?.includes(search)
      );
    }

    return dataKey?.map((item: Record<string, any>, i: number) => {
      const index = isGetAll
        ? 0
        : ((+allParams?.page || 1) - 1) * (+allParams?.limit || defaultLimit);

      return {
        ...item,
        _id: getUniqueId
          ? getUniqueId(item)
          : item?._id || `${i}${i + 1 + index}`,
        _number: i + 1 + index,
      };
    });
  }, [data, search]);

  const tableColumns: GridColumns<TData> = React.useMemo(
    () =>
      getTableColumns<TData>({
        columns,
        numerate,
        onEditColumn,
        onDeleteColumn,
        onSeenClick,
      }),
    [columns]
  );

  const totalData = data?.data?.total || tableData?.length || 0;

  return (
    <>
      <TableContainerMain tableHeight={tableHeight}>
        <TableHeader
          title={title}
          addButtonTitle={addButtonTitle}
          searchable={searchable}
          setSearch={setSearch}
          search={search}
          headerChildren={headerChildren}
          headerChildrenSecondRow={headerChildrenSecondRow}
          deletable={deletable}
          selectedRows={selectedRows}
          onAddButton={onAddButton}
          onDelete={onDelete}
          dataUrl={dataUrl}
        />

        {tableData?.length === 0 && !isLoading ? (
          <>
            <div className="grid-container no-data">
              <DataGrid rows={[]} sx={{ height: 50 }} columns={tableColumns} />
            </div>
            <NoDataFound />
          </>
        ) : (
          insteadOfTable || (
            <div className="grid-container">
              <DataGrid
                getRowId={(row: any) => row?._id}
                rows={(mapData ? mapData(tableData) : tableData) || []}
                columns={tableColumns}
                localeText={localization}
                pageSize={Number(searchParams.get("limit"))}
                rowsPerPageOptions={[5, 10, 20]}
                loading={isLoading}
                hideFooterPagination
                disableSelectionOnClick
                sortingMode="server"
                onSortModelChange={(model) => {
                  if (model.length) {
                    setSearchParams({
                      ...allParams,
                      ...exQueryParams, // FIX 4
                      sortBy: `${model[0].field}`,
                      sortOrder: `${model[0].sort === "asc" ? 1 : -1}`,
                    });
                  } else {
                    delete allParams.sortBy;
                    delete allParams.sortOrder;
                    setSearchParams({
                      ...allParams,
                      ...exQueryParams,
                    });
                  }
                }}
                isRowSelectable={(params: GridRowParams<TData>) =>
                  isRowSelectable?.(params.row)
                }
                onPageSizeChange={(newPageSize) => {
                  setSearchParams({
                    ...allParams,
                    ...exQueryParams, // FIX 5
                    limit: String(newPageSize),
                  });
                }}
                onRowClick={(props) => {
                  onRowClick?.(props.row);
                }}
                rowCount={totalData}
                getRowClassName={(params) => (!!onRowClick ? "row-hover" : "")}
                checkboxSelection={selection}
                onSelectionModelChange={(rows) => {
                  setSelectedRows(rows);
                }}
                paginationMode="server"
                sx={{ height: "100%" }}
                rowHeight={48}
                headerHeight={45}
              />
            </div>
          )
        )}

        {!!allParams && hasPagination && !isGetAll && (
          <TablePagination
            totalData={totalData}
            tableData={tableData}
            defaultLimit={defaultLimit}
          />
        )}
      </TableContainerMain>
    </>
  );
};

export default Table;
