import Pagination from "@mui/material/Pagination";
import React, { useMemo } from "react";
import PagIcon from "../assets/PagIcon";

import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const TablePagination: React.FC<{
  tableData: any[];
  totalData: number;
  defaultLimit: number;
}> = ({ totalData, tableData, defaultLimit }) => {
  const [getParams, setSearchParams] = useSearchParams();
  const allParams = useAllQueryParams();

  const pagination = useMemo(
    () => (
      <Pagination
        count={Math.ceil(+totalData / (+allParams.limit || defaultLimit))}
        variant="outlined"
        page={+allParams.page || 1}
        showFirstButton
        showLastButton
        shape="rounded"
        onChange={(event, page) =>
          setSearchParams({ ...allParams, page: String(page) })
        }
      />
    ),
    [allParams]
  );

  return (
    <div className="pagination_container">
      <CustomizedMenus
        currLimit={+allParams.limit || defaultLimit}
        onLimitChange={(limit) => {
          setSearchParams({ ...allParams, limit: String(limit), page: "1" });
        }}
      />

      {tableData?.length > 0 && pagination}
    </div>
  );
};

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({}));

function CustomizedMenus({
  onLimitChange,
  currLimit,
}: {
  onLimitChange: (limit: number) => void;
  currLimit: number;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { t } = useTranslation();
  return (
    <>
      <button onClick={handleClick} className="pag_title">
        <PagIcon /> {currLimit} {t("PAGES_TITLE.ROWDAN")}
      </button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {[10, 20, 40, 50, 100].map((limit) => (
          <MenuItem
            disabled={currLimit === limit}
            onClick={() => {
              onLimitChange(limit);
              handleClose();
            }}
            disableRipple
            key={limit}
            sx={{
              width: "145px",
            }}
          >
            {limit}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
}

export default TablePagination;
