import styled from "styled-components";

export const DragTableStyled = styled.div`
  height: calc(100vh - 90px);
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;

  .ant-table {
    overflow: auto;

    .ant-table-container {
      .ant-table-content {
        height: calc(100vh - 140px - 60px - 40px);
        table {
          td,
          th {
            height: 48px !important;
            padding: 0 10px !important;
          }

          tr {
            max-height: 48px !important;
            padding: 0 10px !important;
          }

          thead {
            position: sticky;
            top: 0;
            left: 0;
            z-index: 99;
            height: 50px !important;
          }
        }
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
`;
