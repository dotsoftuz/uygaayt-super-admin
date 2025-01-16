import React from "react";
import { Button, Grid } from "@mui/material";
import { MainButton, SearchInput } from "components";
import { TSetState } from "types/form.types";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

const TableHeader: React.FC<{
  searchable?: boolean;
  setSearch: TSetState<string | undefined>;
  search: string | undefined;
  title?: React.ReactNode | string;
  headerChildren: React.ReactNode;
  headerChildrenSecondRow: React.ReactNode;
  deletable: boolean;

  selectedRows: any[];
  onDelete: () => void;
  onAddButton?: () => void;
  addButtonTitle?: string;
  dataUrl?: string;
}> = ({
  onAddButton,
  onDelete,

  setSearch,
  searchable,
  search,
  headerChildren,
  headerChildrenSecondRow,
  deletable,
  selectedRows,
  title,
  addButtonTitle,
  dataUrl,
}) => {
    const { t } = useTranslation();

    return (
      <div>
        <div className={`lg:flex ${searchable || onAddButton ? "justify-between" : "justify-end"} items-center`}>
          {searchable && (
            <Grid className="lg:w-[20%] w-full py-2">
              <Grid item >
                <SearchInput
                  value={search}
                  onChange={(e: any) => {
                    setSearch(e?.target?.value);
                  }}
                />
              </Grid>
            </Grid>
          )}
          {headerChildren}
          {
           onAddButton || (deletable && selectedRows?.length > 0) ? <div className={`lg:w-[20%] w-full flex justify-end py-2 items-center`}>
              {onAddButton ? (
                <MainButton
                  title={addButtonTitle || t("general.add")}
                  variant="contained"
                  onClick={() => {
                    onAddButton?.();
                  }}
                />
              ) : null}
              {deletable && selectedRows?.length > 0 && (
                <Button
                  style={{ borderRadius: 12 }}
                  onClick={onDelete}
                  sx={{ width: 40 }}
                  variant="outlined"
                  color="error"
                  className="table_add_button"
                >
                  <DeleteIcon />
                </Button>
              )}
            </div> : ""
          }

        </div>
        <div>{headerChildrenSecondRow}</div>
      </div>
    );
  };

export default TableHeader;
