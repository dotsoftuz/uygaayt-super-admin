import { Loading, MainButton } from "components";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { useEffect, useMemo, useState } from "react";
// @ts-ignore
import Board, { createTranslate } from "react-trello";

import { useNavigate } from "react-router-dom";
import { OrderBoardStyled } from "./OrderBoard.styled";
import LaneHeader from "./components/LaneHeader";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import {
  Card,
  IOrderByStatus,
  Lane,
  mapBoardLanes,
  translateUz,
} from "./OrderBoard.constants";
import { useTranslation } from "react-i18next";
import SwitchView from "pages/order/components/SwitchView/SwitchView";
import { useRoleManager } from "services/useRoleManager";

const customTranslation = createTranslate(translateUz);

const OrderBoard = () => {
  const allParams = useAllQueryParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stateIndex, setStateIndex] = useState(0);
  const [boardData, setBoardData] = useState<any>();
  const [getBoardDataFinished, setGetBoardDataFinished] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [stateId, setStateId] = useState("");
  const [page, setPage] = useState<any>({});
  const hasAccess = useRoleManager();
  const enabled = !!stateIndex || !!stateId;

  const { data:OrderStateData, status } = useApi<IOrderByStatus[]>(
    "/order-state/get-all",
    {
      ...allParams,
    },
    { suspense: false }
  );

  const {mutate, reset, data, isLoading} = useApiMutation(
    "order/paging",
    "post",
    {
      onSuccess({ data }) {
        setBoardData((prev: any) =>
          prev.map((item: any, index: number) => {
            if ((stateId && stateId === item._id) || index === stateIndex - 1) {
              const oldOrders = item.orders || [];
              const newOrders = data?.data?.map((order: any) => ({
                number: order.number,
                totalPrice: order.totalPrice,
                addressName: order.addressName,
                createdAt: order.createdAt,
                state: order.state?.state,
                _id: order._id,
              }));
              return {
                ...item,
                orders: oldOrders.concat(newOrders),
              };
            }
            return item;
          })
        );
        if (stateId) return;
        if (stateIndex < boardData.length) {
          setTimeout(() => setStateIndex((prev) => prev + 1), 0);
        } else {
          setGetBoardDataFinished(true);
          setStateIndex(0);
        }
      },
    }
  );

  useEffect(() => {
    mutate({
      page: stateId
      ? page[stateId]
      : page[boardData?.[stateIndex - 1]?._id] || 1,
    limit: 10,
    stateId: stateId || boardData?.[stateIndex - 1]?._id,
    });
  }, [mutate]);

  useEffect(() => {
    if (status === "success") {
      setBoardData(OrderStateData?.data);
      setStateIndex(1);
      OrderStateData?.data?.map((e) => {
        setPage((prev: any) => ({
          ...prev,
          [e._id]: 1,
        }));
      });
    }
  }, [status, OrderStateData?.data]);

  const readyBoardData = useMemo(() => {
    if (getBoardDataFinished) {
      return mapBoardLanes(boardData || []);
    }
  }, [boardData, getBoardDataFinished]);

  // to update card status
  const { mutate: cardUpdate } = useApiMutation<{
    stateId: string;
    position: number;
  }>(`order/state/${orderId}`, "put", {
    onSuccess() {
      setOrderId("");
    },
  });
  // to update lane position
  const { mutate: laneUpdate } = useApiMutation<{
    position: number;
    _id: string;
  }>("status", "put", {
    onSuccess() {},
  });
  // to delete lane
  const { mutate: laneDelete } = useApiMutation<{
    ids: string[];
  }>("status", "delete", {
    onSuccess(data, variables, context) {
      // refetch();
    },
  });

  const onCardDragEnd = (
    cardId: Card["id"],
    sourceLandId: Lane["id"],
    targetLaneId: Lane["id"],
    position: number,
    card: Card
  ) => {
    setOrderId(card.id);
    setTimeout(
      () =>
        cardUpdate({
          position,
          stateId: targetLaneId,
        }),
      0
    );
  };

  const onLaneDragEnd = (
    removedIndex: string,
    addedIndex: string,
    payload: Lane
  ) => {
    laneUpdate({
      _id: payload.id,
      position: +addedIndex + 1,
    });
  };

  return (
    <OrderBoardStyled>
      <div className="header">
        <SwitchView />
        {/* {hasAccess("orderCreate") && (
          <MainButton
            className="ms-3"
            title={t("general.add")}
            variant="contained"
            onClick={() => navigate("/order/add")}
          />
        )} */}
      </div>
      {!getBoardDataFinished ? (
        <Loading />
      ) : (
        <Board
          data={readyBoardData}
          editable={true}
          handleDragEnd={onCardDragEnd}
          handleLaneDragEnd={onLaneDragEnd}
          editLaneTitle={false}
          canAddLanes={false}
          hideCardDeleteIcon
          onCardClick={(cardId: string) => navigate(`/order/${cardId}`)}
          components={{
            LaneHeader: (lane: any) => LaneHeader(lane, laneDelete),
            AddCardLink: (e: any) => (
              <MainButton
                title={t("general.loadMore")}
                className="load-more"
                onClick={() => {
                  setPage((prev: any) => ({
                    ...prev,
                    [e.laneId]: prev[e.laneId] + 1,
                  }));
                  // setStateId(e.laneId)
                  setTimeout(() => setStateId(e.laneId), 0);
                }}
              />
            ),
          }}
          // draggable
          lang="ru"
          t={customTranslation}
        />
      )}
    </OrderBoardStyled>
  );
};

export default OrderBoard;
