import { Grid } from "@mui/material";
import MainButton from "components/common/button/MainButton";
import SearchInput from "components/common/searchInput/SearchInput";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { TSetState } from "types/form.types";

interface IDragTableHeader {
  searchable?: boolean;
  setSearch: TSetState<string | undefined>;
  search: string | undefined;
  headerChildren?: React.ReactNode;

  onAddButton?: () => void;
  addButtonTitle?: string;
}
const DragTableHeader: FC<IDragTableHeader> = ({
  onAddButton,
  setSearch,
  searchable,
  search,
  headerChildren,
  addButtonTitle,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="d-flex justify-content-end align-items-center mb-3 ">
        {searchable && (
          <Grid container className="search-box-container">
            <Grid item md={5}>
              <SearchInput
                value={search}
                onChange={(e: any) => {
                  setSearch(e?.target?.value);
                }}
              />
            </Grid>
          </Grid>
        )}
        <div className="d-flex justify-content-end align-items-center gap-3 w-100">
          {headerChildren}
          {onAddButton ? (
            <MainButton
              title={addButtonTitle || t("general.add")}
              variant="contained"
              onClick={() => {
                onAddButton?.();
              }}
            />
          ) : null}
        </div>
      </div>
      <div>{/* headerChildrenSecondRow */}</div>
    </div>
  );
};

export default DragTableHeader;
