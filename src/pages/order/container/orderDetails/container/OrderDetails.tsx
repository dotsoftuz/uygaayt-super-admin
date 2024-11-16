import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { OrderDetailsStyled } from "./OrderDetails.styled";
import { MainButton, Select } from "components";
import MoneyImage from "assets/images/money.png";
import OrderProducts from "../components/OrderProducts/OrderProducts";
import OrderInfo from "../components/OrderInfo/OrderInfo";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useTranslation } from "react-i18next";
import { IOrder } from "types/common.types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { get } from "lodash";
import { useAppSelector } from "store/storeHooks";
import { useDispatch } from "react-redux";
import { socketReRender } from "store/reducers/SocketSlice";

const OrderDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const formStore = useForm();
  const { setValue, reset, handleSubmit } = formStore;
  const socketRender = useAppSelector((store) => store.SocketState.render);
  const dis = useDispatch();

  const { data, status, refetch } = useApi<IOrder>(
    `order/${id}`,
    {},
    {
      enabled: !!id,
    }
  );
  const order = data?.data;
  const isCompleted = order?.state?.state === "completed";
  const isCancelled = order?.state?.state === "cancelled";

  const { data: orderStates, refetch: refetchOrderState } = useApi(
    "order/states",
    {},
    { suspense: false }
  );

  const { mutate: updateState } = useApiMutation(
    `order/state/${order?._id}`,
    "put",
    {
      onSuccess() {
        refetch();
        toast.success(t("general.success"));
      },
    }
  );

  const { mutate } = useApiMutation(`order/${id}`, "put");

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
        phoneNumber: order?.customer.phoneNumber,
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
    const requestData = {
      ...data,
      items: data.items?.map((e: any) => ({
        productId: e.productId,
        amount: e.amount,
      })),
    };
    mutate(requestData);
  });

  const stateIndex = orderStates?.data?.findIndex(
    (item: any) => item._id === order?.state._id
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
                  title={orderStates?.data[stateIndex + 1]?.name}
                  variant="contained"
                  className="me-3"
                  onClick={() =>
                    updateState({
                      stateId: orderStates?.data[stateIndex + 1]?._id,
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
