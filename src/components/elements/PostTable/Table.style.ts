import styled from "styled-components";

export const TableContainerMain = styled.div<{ tableHeight?: number }>`
  position: relative;
  width: 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);

  .MuiDataGrid-columnSeparator {
    display: none !important;
  }

  .MuiDataGrid-columnHeadersInner {
    border-bottom: none !important;
  }

  .MuiDataGrid-root .MuiDataGrid-columnHeader:focus,
  .MuiDataGrid-root .MuiDataGrid-cell:focus {
    outline: none !important;
  }

  .MuiDataGrid-root .MuiDataGrid-cell {
    outline: none !important;
  }

  .grid-container > * {
    border: 0;
    color: #232323 !important;
    font-weight: 500;
    overflow-x: auto;
  }
  .MuiDataGrid-virtualScroller {
    &::-webkit-scrollbar {
      width: 9px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #d9d9d9;
      border-radius: 12px;
    }
    &::-webkit-scrollbar-track {
      background-color: #f5f5f5;
    }
  }
  .MuiDataGrid-footerContainer {
    display: none;
  }
  .MuiDataGrid-columnHeaderTitle {
    font-weight: 500;
    font-size: 13px;
    color: #888a99 !important;
  }
  .MuiDataGrid-main > * {
    background-color: #f5f5f5;
    border-radius: 12px;
    color: #232323 !important;
    font-weight: 500;
    font-size: 14px;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 18px;
  }
  .grid-container {
    width: 100%;
    height: calc(100vh - 65px - 140px - 56px);
    background-color: #fff;
    border-radius: 4px;
    &.no-data {
      height: 50px;
    }
    &:last-child {
      border-bottom: none !important;
    }
  }
  .MuiDataGrid-virtualScrollerContent {
    border: none !important;
  }

  .no-data-found {
    width: 100%;
    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1.5rem;
    h2 {
      font-size: 1rem;
      font-weight: 600;
      color: #666687;
    }
  }
  .MuiDataGrid-row {
    &:last-child {
      .MuiDataGrid-cell {
        border: 0 !important;
      }
    }
  }

  .pagination_container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 68px;
    border-top: 1px solid #d9d9d9;
    background-color: #ffffff;
    gap: 20px;

    .pag_title {
      min-width: 145px;
      height: 48px;
      border: 1px solid #d9d9d9;
      background-color: #ffffff;
      display: flex;
      justify-content: center;
      color: #454545;
      font-size: 15px;
      font-weight: 700;
      align-items: center;
      gap: 5px;
      border-radius: 16px;
      cursor: pointer;
    }
    .MuiButtonBase-root {
      width: 40px;
      height: 40px;
      border-radius: 16px;
      color: #bdbdbd;
      font-weight: 600;
      border: 1px solid #ffffff;
      background-color: #ffffff;

      &:hover {
        background-color: #f5f5f5;
      }

      &.Mui-selected {
        border: 1px solid #d9d9d9;
        color: #454545;
      }
    }
  }
  .table-header {
    .MuiDataGrid-columnHeaderTitle {
      font-weight: 700 !important;
      color: #666687;
    }
  }
  .table_add_button {
    width: 20px !important;
  }
  .row-hover {
    &:hover {
      cursor: pointer;
    }
  }
  .header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
