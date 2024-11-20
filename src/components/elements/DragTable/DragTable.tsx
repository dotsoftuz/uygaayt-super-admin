import { MenuOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { ITableData } from "../Table/Table.constants";
import { useAppSelector } from "store/storeHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import useDebounce from "hooks/useDebounce";
import { IQueryParams } from "../Table/Table.constants";
import { get } from "lodash";
import { DragTableStyled } from "./DragTable.style";
import DragTableHeader from "./components/DragTableHeader";
import TablePagination from "../Table/components/tablePagination";
import NoDataFound from "../Table/components/noDataFound";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { reRenderTable } from "../Table/reducer/table.slice";
import { getTableColumns, localization } from "../Table/utils";
import { DataGrid, GridRowParams } from "@mui/x-data-grid";

// interface DataType {
//   key: string;
//   name: string;
//   age: number;
//   address: string;
// }

// const columns: ColumnsType<DataType> = [
//   {
//     key: "sort",
//   },
//   {
//     title: "Name",
//     dataIndex: "name",
//   },
//   {
//     title: "Age",
//     dataIndex: "age",
//   },
//   {
//     title: "Address",
//     dataIndex: "address",
//   },
// ];

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row = ({ children, ...props }: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 1 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === "sort") {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: "none", cursor: "move" }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

interface IDragTable {
  columns: any;
  dataUrl: string;
  dragUrl: string;
  dragKey: string;
  isGetAll?: boolean;
  hasPagination?: boolean;
  searchable?: boolean;
  render: boolean;
  headerChildren?: React.ReactNode;

  deleteUrl?: string;
  onDeleteSuccess?: any;
  onDeleteColumn?:any;
  noRerender?: any;

  setRender?: React.Dispatch<React.SetStateAction<boolean>>;
  onAddButton?: () => void;
  deletable?: boolean;
  selection?: any;
  numerate?: any;
  mapData?: any;
  isRowSelectable?: any;
  onRowClick?: any;
  headerChildrenSecondRow?: any;
  onEditColumn?: any;
  
}
const DragTable: React.FC<IDragTable> = ({
  columns,
  dataUrl,
  dragUrl,
  dragKey,
  isGetAll = false,
  hasPagination = true,
  searchable = true,
  render,

  onDeleteColumn,
  onDeleteSuccess,
  deleteUrl,
  noRerender,
  numerate = true,
  mapData,
  isRowSelectable = () => true,
  onRowClick = undefined,
  headerChildrenSecondRow,
  onEditColumn,

  onAddButton,
  setRender,
  headerChildren,
  deletable = false,
  selection = deletable ? true : false,
}) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string | undefined>(
    searchParams.get("search") || ""
  );
  const [isDragged, setIsDragged] = useState<boolean>(false);
  const isOpen = useAppSelector((store) => store.formDrawerState.isOpen);
  const { debouncedValue: debValue } = useDebounce(search, 500);
  const allParams = useAllQueryParams();
  const reRender = useAppSelector((store) => store.tableState.render);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
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
      page: searchParams.get("page") || queryParams?.page,
      limit: searchParams.get("limit") || queryParams?.limit,
    });
  }, [debValue, search]);

  // const { data, refetch, isFetching } = useApi<ITableData>(
  //   dataUrl,
  //   {
  //     ...queryParams,
  //     ...allParams,
  //     // ...exQueryParams,
  //   },
  //   {
  //     onSuccess(data) {
  //       const tableData = isGetAll ? get(data, "data", []) : data?.data?.data;
  //       // onDataChange?.(tableData);
  //       // getAllData?.(data?.data);
  //       if (data?.data?.total > 0 && data?.data?.data?.length === 0) {
  //         setSearchParams({
  //           ...queryParams,
  //           ...allParams,
  //           search: searchParams.get("search") || "",
  //           page: searchParams.get("page"),
  //           limit: searchParams.get("limit"),
  //         });
  //       }
  //       setRender(false);
  //     },
  //     suspense: false,
  //   }
  // );

  const { mutate: dataUrlMutate, reset, data, isLoading } = useApiMutation(
    dataUrl,
    "post",
    {
      onSuccess(response) {
        const tableData = isGetAll ? get(response, "data", []) : response?.data?.data;
        if (response?.data?.total > 0 && response?.data?.data?.length === 0) {
          setSearchParams({
            ...queryParams,
            ...allParams,
            search: searchParams.get("search") || "",
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
          });
        }
      },
    }
  );

  useEffect(() => {
    dataUrlMutate({
      ...queryParams,
      ...allParams,
    });
  }, [debValue, search, dataUrlMutate]);


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

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
      setIsDragged(true);
    }
  };

  const tableData: any[] = React.useMemo(() => {
    const dataKey: any[] = isGetAll ? get(data, "data", []) : data?.data?.data;
    if (isGetAll && search) {
      return dataKey?.filter(
        (item) =>
          item?.firstName?.toLowerCase()?.includes(search) ||
          item?.lastName?.toLowerCase()?.includes(search) ||
          item?.name?.uz?.toLowerCase()?.includes(search) ||
          item?.car?.name?.toLowerCase()?.includes(search)
      );
    }
    return dataKey?.map((item: any, i: number) => ({
      ...item,
      _number: i + 1,
      key: i + 1,
    }));
  }, [data, search]);

  const { mutate, status } = useApiMutation(dragUrl, "put");

  useEffect(() => {
    setDataSource(tableData || []);
  }, [tableData]);


  useEffect(() => {
    if (render) reset();
  }, [render]);

  const reOrderedData = useMemo(() => {
    return dataSource.map((item: any) => item._id);
  }, [dataSource]);

  useEffect(() => {
    if (status === "success") {
      reset();
      setIsDragged(false);
    }
  }, [status]);

  useEffect(() => {
    if (isDragged) {
      mutate({ [dragKey]: reOrderedData });
    }
  }, [isDragged]);

  const dragTableColumns: any  = React.useMemo(
    () =>
      getTableColumns<any>({
        columns,
        // numerate,
        onEditColumn,
        onDeleteColumn,
        // onSeenClick,
      }),
    [columns]
  );

  const totalData = data?.data?.total || tableData?.length || 0;


  return (
    <DragTableStyled>
      <DragTableHeader
        setSearch={setSearch}
        search={search}
        onAddButton={onAddButton}
        headerChildren={headerChildren}
        headerChildrenSecondRow={headerChildrenSecondRow}
        searchable={searchable}
        onDelete={onDelete}
        selectedRows={selectedRows}
        deletable={deletable}
      />
      {tableData?.length === 0 && !isLoading ? (
        <>
          <div className="grid-container no-data">
            <DataGrid
                getRowId={(row: any) => row?._id}
                rows={(mapData ? mapData(tableData) : tableData) || []}
                columns={dragTableColumns}
                localeText={localization}
                pageSize={Number(searchParams.get("limit"))}
                rowsPerPageOptions={[5, 10, 20]}
                loading={isLoading}
                hideFooterPagination
                disableSelectionOnClick
                isRowSelectable={(params: GridRowParams<any>) =>
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
          {/* <NoDataFound /> */}
        </>
      ) : (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            // rowKey array
            items={dataSource.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  row: Row,
                },
              }}
              rowKey="key"
              columns={dragTableColumns}
              dataSource={dataSource}
              pagination={false}
              loading={isLoading}
              
            />
          </SortableContext>
        </DndContext>
      )}
      {!!queryParams && hasPagination && (
        <TablePagination
          totalData={totalData}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          tableData={tableData}
        />
      )}
    </DragTableStyled>
  );
};

export default DragTable;
