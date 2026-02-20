import { Grid } from "@mui/material";
import MoneyImage from "assets/images/money.png";
import { MainButton } from "components";
import dayjs from "dayjs";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { socketReRender } from "store/reducers/SocketSlice";
import { useAppSelector } from "store/storeHooks";
import { IOrder } from "types/common.types";
import OrderInfo from "../components/OrderInfo/OrderInfo";
import OrderProducts from "../components/OrderProducts/OrderProducts";
import { OrderDetailsStyled } from "./OrderDetails.styled";

const OrderDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const formStore = useForm();
  const { setValue, reset, handleSubmit, control } = formStore;
  const socketRender = useAppSelector((store) => store.SocketState.render);
  const dis = useDispatch();
  const currentLang = localStorage.getItem("i18nextLng") || "uz";
  const [selectedCourier, setSelectedCourier] = useState("");

  const { data, status, refetch } = useApi<IOrder>(
    `order/get-by-id/${id}`,
    {},
    {
      enabled: !!id,
    },
  );
  const order = data?.data;
  const isCompleted = order?.state?.state === "completed";
  const isCancelled = order?.state?.state === "cancelled";

  const { data: orderStates, refetch: refetchOrderState } = useApi(
    "order-state/get-all",
    {},
    { suspense: false },
  );

  const { mutate: updateState } = useApiMutation(
    `order/state/${order?._id}`,
    "put",
    {
      onSuccess() {
        refetch();
        toast.success(t("general.success"));
      },
    },
  );

  const { mutate } = useApiMutation(`order/update`, "put");

  useEffect(() => {
    if (status === "success") {
      setValue("items", order?.items);
      reset({
        items: order?.items,
        addressName: order?.addressName,
        addressLocation: order?.addressLocation,
        customer:
          get(order, "customer.firstName", "") +
          " " +
          get(order, "customer.lastName", ""),
        receiverFirstName: get(order, "receiverCustomer.firstName", ""),
        receiverPhoneNumber: get(
          order,
          "receiverCustomer.phoneNumber",
          order?.customer?.phoneNumber,
        ),
        phoneNumber: order?.customer?.phoneNumber,
        paymentType: order?.paymentType,
        houseNumber: order?.houseNumber,
        entrance: order?.entrance,
        floor: order?.floor,
        deliveryDate: get(order, "deliveryDate", ""),
        apartmentNumber: order?.apartmentNumber,
      });

      setTimeout(() => setValue("comment", order?.comment), 0);
    }
  }, [status]);

  const submit = handleSubmit((data: any) => {
    const parsedDeliveryDate = data.deliveryDate
      ? dayjs(data.deliveryDate)
      : null;
    const safeDeliveryDate = parsedDeliveryDate?.isValid()
      ? parsedDeliveryDate.format()
      : undefined;

    const safePhoneNumber = data.phoneNumber || order?.customer?.phoneNumber;

    const sourceItems =
      Array.isArray(data?.items) && data.items.length > 0
        ? data.items
        : order?.items;
    const safeItems = Array.isArray(sourceItems)
      ? sourceItems
          .map((e: any) => ({
            productId: e.productId,
            amount: e.amount,
            attributes: Array.isArray(e?.attributes)
              ? e.attributes
                  .map((item: any) => ({
                    attributeId: item?.attributeId,
                    attributeItem: item?.attributeItem,
                  }))
                  .filter((x: any) => x?.attributeId || x?.attributeItem)
              : undefined,
          }))
          .filter((e: any) => e?.productId && e?.amount)
      : [];

    const requestData = {
      _id: order?._id,
      addressName: data.addressName,
      addressLocation: data.addressLocation,
      receiverFirstName: data.receiverFirstName,
      receiverPhoneNumber: data.receiverPhoneNumber || data.phoneNumber,
      phoneNumber: safePhoneNumber,
      paymentType: data.paymentType,
      houseNumber: data.houseNumber,
      entrance: data.entrance,
      floor: data.floor,
      apartmentNumber: data.apartmentNumber,
      comment: data.comment,
      deliveryDate: safeDeliveryDate,
      storeId: order?.storeId,
      items: safeItems,
    };
    mutate(requestData, {
      onSuccess() {
        refetch();
        toast.success(t("general.success"));
      },
    });
  });

  const stateIndex = orderStates?.data?.findIndex(
    (item: any) => item._id === order?.state._id,
  );

  useEffect(() => {
    if (socketRender) {
      refetch();
      dis(socketReRender(false));
    }
  }, [socketRender]);

  return (
    <OrderDetailsStyled>
      <Grid container columnSpacing={3}>
        <Grid item md={8}>
          <div className="top">
            {!isCancelled && !isCompleted && (
              <div className="d-flex">
                <MainButton
                  title={orderStates?.data[stateIndex + 1]?.name?.[currentLang]}
                  variant="contained"
                  className="me-3"
                  onClick={() =>
                    updateState({
                      stateId: orderStates?.data[stateIndex + 1]?._id,
                      _id: order?._id,
                      position: 1,
                    })
                  }
                />
                <MainButton
                  title="Bekor qilish"
                  variant="outlined"
                  color="error"
                  className="me-3"
                  onClick={() =>
                    updateState({
                      stateId:
                        orderStates?.data[orderStates?.data.length - 1]._id,
                      _id: order?._id,
                      position: 1,
                    })
                  }
                />
              </div>
            )}
            <div className="payment-type">
              <img src={MoneyImage} alt="money" />
              <div className="type">
                <span>To'lov turi</span>
                <h4>{t(`enum.${order?.paymentType}`)}</h4>
              </div>
              <span className="state">
                {order?.paymentType === "cash" &&
                order.state.state === "completed"
                  ? "To'langan"
                  : order?.isPaid
                    ? "To'langan"
                    : "To'lanmagan"}
              </span>
            </div>
            {!isCompleted && !isCancelled && (
              <MainButton
                title="Saqlash"
                variant="contained"
                className="ms-3"
                onClick={submit}
              />
            )}
          </div>
          <OrderProducts
            formStore={formStore}
            state={order?.state?.state}
            order={order}
          />
        </Grid>

        <Grid item md={4}>
          <OrderInfo formStore={formStore} order={order} />
        </Grid>
      </Grid>
    </OrderDetailsStyled>
  );
};

export default OrderDetails;
