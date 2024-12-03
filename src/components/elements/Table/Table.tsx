import { DataGrid, GridColumns, GridRowParams } from "@mui/x-data-grid";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useDebounce from "hooks/useDebounce";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
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
import { useSearchParams } from "react-router-dom";

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
}: ITable<TData>) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get("search") || ""
  );
  const { debouncedValue: debValue } = useDebounce(search, 700);
  const allParams = useAllQueryParams();
  const isOpen = useAppSelector((store) => store.formDrawerState.isOpen);
  const reRender = useAppSelector((store) => store.tableState.render);
  const socketRender = useAppSelector((store) => store.SocketState.render);
  const dis = useDispatch();
  /** @todo work with query params */
  const [queryParams, setQueryParams] = useState<any>(
    !isGetAll
      ? {
          page: searchParams.get("page") || 1,
          limit: searchParams.get("limit") || 10,
          search: searchParams.get("search") || "",
        }
      : undefined
  );
  useEffect(() => {
    setQueryParams((prev: any) => {
      return prev
        ? {
            ...prev,
            search: search || "",
            page: searchParams.get("page") || queryParams?.page,
            limit: searchParams.get("limit") || queryParams?.limit,
          }
        : undefined;
    });

    setSearchParams({
      ...queryParams,
      ...exQueryParams,
      page: searchParams.get("page") || queryParams?.page,
      limit: searchParams.get("limit") || queryParams?.limit,
    });
  }, [debValue, search]);

  /** @todo to get data */
  const { mutate, reset, data, isLoading } = useApiMutation(
    dataUrl,
    "post",
    {
      onSuccess(response) {
        const tableData = isGetAll ? get(response, "data", []) : response?.data?.data;
        onDataChange?.(tableData);
        getAllData?.(response?.data);
        if (response?.data?.total > 0 && response?.data?.data?.length === 0) {
          setSearchParams({
            ...queryParams,
            ...exQueryParams,
            ...allParams,
            search: searchParams.get("search") || "",
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
            suspense: false,
          });
        }
      },
    }
  );

  useEffect(() => {
    mutate({
      ...queryParams,
      ...allParams,
      ...exQueryParams,
    });
  }, [debValue, search, mutate, searchParams, reRender]);
  /** @todo to delete */
  const { mutate: deleteMutate, isSuccess: isDeleteSuccess } = useApiMutation(
    deleteUrl || dataUrl,
    "delete"
  );

  const onDelete = () => {
    deleteMutate({
      ids: selectedRows,
    });
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
      reset();
      dis(socketReRender(false));
    }
  }, [socketRender]);

  /** @constant memorize fetched data */
  const tableData: TData[] = React.useMemo(() => {
    const dataKey: any[] = isGetAll ? get(data, "data", []) : data?.data?.data;
    if (isGetAll && searchable && search) {
      return dataKey?.filter(
        (item) =>
          item?.firstName?.toLowerCase()?.includes(search) ||
          item?.lastName?.toLowerCase()?.includes(search) ||
          item?.name?.toLowerCase()?.includes(search) ||
          item?.car?.name?.toLowerCase()?.includes(search)
      );
    }
    return dataKey?.map((item: any, i: number) => ({
      ...item,
      _number:
        i +
        1 +
        ((Number(searchParams.get("page")) || 1) - 1) *
          (Number(searchParams.get("limit")) || 10),
    }));
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
                sortModel={
                  allParams?.sortBy && !reset
                    ? [
                        {
                          sort: allParams?.sortOrder === "1" ? "asc" : "desc",
                          field: allParams?.sortBy,
                        },
                      ]
                    : []
                }
                onSortModelChange={(model) => {
                  if (model.length) {
                    setSearchParams({
                      ...allParams,
                      sortBy: `${model[0].field}`,
                      sortOrder: `${model[0].sort === "asc" ? 1 : -1}`,
                    });
                  } else {
                    delete allParams.sortBy;
                    delete allParams.sortOrder;
                    setSearchParams({
                      ...allParams,
                    });
                  }
                }}
                isRowSelectable={(params: GridRowParams<TData>) =>
                  isRowSelectable?.(params.row)
                }
                onPageSizeChange={(newPageSize) => {
                  setSearchParams({
                    ...queryParams,
                    limit: searchParams.get("limit") || newPageSize,
                    page: searchParams.get("page"),
                  });
                }}
                onRowClick={(props) => {
                  onRowClick?.(props.row);
                }}
                rowCount={totalData}
                getRowClassName={(params) => (!!onRowClick ? "row-hover" : "")}
                checkboxSelection={selection}
                onSelectionModelChange={(rows, data) => {
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
        {!!queryParams && hasPagination && (
          <TablePagination
            totalData={totalData}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            tableData={tableData}
          />
        )}
      </TableContainerMain>
    </>
  );
};

export default Table;
