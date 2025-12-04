import { GridColumns } from "@mui/x-data-grid";
import { Tooltip } from "antd";
import { Select } from "components";
import dayjs from "dayjs";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
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

export const useOrderTableColumns = (
  setStateUpdateData: any,
  orderStates: any[]
): GridColumns => {
  const { t } = useTranslation();

  return [
    {
      field: t("common.number"),
      renderCell({ row }) {
        return row.number;
      },
      flex: 0.6,
    },
    {
      field: t("common.price"),
      renderCell({ row }) {
        return numberFormat(row.totalPrice);
      },
      flex: 0.6,
    },
    // {
    //   field: t("common.customer"),
    //   renderCell({ row }) {
    //     return (
    //       get(row, "customer.firstName", "") +
    //       " " +
    //       get(row, "customer.lastName", "")
    //     );
    //   },
    // },
    {
      field: t("order.receiver"),
      renderCell({ row }) {
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
      renderCell({ row }) {
        return row.customer?.phoneNumber;
      },
    },
    {
      field: t("common.receiverPhoneNumber"),
      renderCell({ row }) {
        return row.receiverCustomer?.phoneNumber;
      },
    },
    {
      field: t("common.paymentType"),
      renderCell({ row }) {
        return t(`enum.${row.paymentType}`);
      },
      flex: 0.6,
    },
    {
      field: "store",
      headerName: "Do'kon",
      renderCell({ row }) {
        // Agar store name mavjud bo'lsa (to'g'ri populate qilingan)
        if (row?.store?.name) {
          return row.store.name;
        }

        // Agar storeId string bo'lsa (masalan "uygaayt")
        if (typeof row?.storeId === "string") {
          if (row.storeId.toLowerCase() === "uygaayt") {
            return "Uygaayt";
          }
          // Boshqa string holatlar
          return row.storeId;
        }

        // Agar storeId ObjectId bo'lsa lekin store populate qilinmagan
        // Bu storeRestaurants buyurtmasi bo'lishi mumkin
        // Hozircha ID ni ko'rsatamiz, lekin backend to'g'ri populate qilishi kerak
        if (row?.storeId && typeof row.storeId === "object") {
          // ObjectId ni string ga o'tkazish
          return row.storeId.toString();
        }

        return row?.storeId || "-";
      },
      flex: 0.8,
    },
    {
      field: t("common.time"),
      renderCell({ row }) {
        return dayjs(row.createdAt).format("DD.MM.YYYY HH:mm");
      },
    },
    {
      field: t("common.status"),
      renderCell({ row }) {
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
              options={orderStates} // API emas, options prop
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
};
