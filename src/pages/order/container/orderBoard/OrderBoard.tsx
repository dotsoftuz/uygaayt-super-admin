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
  const [boardData, setBoardData] = useState<IOrderByStatus[]>([]);
  const [getBoardDataFinished, setGetBoardDataFinished] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [stateId, setStateId] = useState("");
  const [page, setPage] = useState<Record<string, number>>({});
  const hasAccess = useRoleManager();
  const enabled = !!stateIndex || !!stateId;

  const { data: orderStateData, status } = useApi<IOrderByStatus[]>(
    "order-state/get-all",
    {
      ...allParams,
    },
    { suspense: false }
  );

  const { mutate, reset, data: orderData, isLoading } = useApiMutation(
    "order/paging",
    "post",
    {
      onSuccess(response) {
        if (!response?.data) return;

        setBoardData((prev) => {
          if (!Array.isArray(prev)) return prev;

          return prev.map((item) => {
            if ((stateId && stateId === item._id) || item._id === boardData?.[stateIndex - 1]?._id) {
              const oldOrders = item.orders || [];
              const newOrders = response.data?.data?.map((order: any) => ({
                number: order.number,
                totalPrice: order.totalPrice,
                addressName: order.addressName,
                createdAt: order.createdAt,
                state: order.state?.state,
                _id: order._id,
              })) || [];

              return {
                ...item,
                orders: [...oldOrders, ...newOrders],
              };
            }
            return item;
          });
        });

        if (!stateId && boardData && stateIndex < boardData.length) {
          setTimeout(() => setStateIndex((prev) => prev + 1), 0);
        } else {
          setGetBoardDataFinished(true);
          setStateIndex(0);
        }
      },
    }
  );

  // console.log(orderData)

  useEffect(() => {
    if (enabled) {
      mutate({
        page: stateId
          ? page[stateId]
          : page[boardData?.[stateIndex - 1]?._id] || 1,
        limit: 10,
        stateId: stateId || boardData?.[stateIndex - 1]?._id,
      });
    }
  }, [stateIndex, stateId, enabled, boardData]);

  useEffect(() => {
    if (status === "success" && Array.isArray(orderStateData)) {
      setBoardData(orderStateData);
      setStateIndex(1);
      
      const newPage: Record<string, number> = {};
      orderStateData.forEach((state) => {
        newPage[state._id] = 1;
      });
      setPage(newPage);
    }
  }, [status, orderStateData]);

  const readyBoardData = useMemo(() => {
    if (getBoardDataFinished) {
      return mapBoardLanes(boardData);
    }
    return { lanes: [] };
  }, [boardData, getBoardDataFinished]);

  const { mutate: cardUpdate } = useApiMutation<{
    stateId: string;
    position: number;
  }>(`order/set-state/${orderId}`, "put", {
    onSuccess() {
      setOrderId("");
    },
  });

  const { mutate: laneUpdate } = useApiMutation<{
    position: number;
    _id: string;
  }>("order/set-state", "put");

  const { mutate: laneDelete } = useApiMutation<{
    ids: string[];
  }>(`order-state/delete/${orderId}`, "delete");

  const onCardDragEnd = (
    cardId: string,
    sourceLandId: string,
    targetLaneId: string,
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
            AddCardLink: ({ laneId }: { laneId: string }) => (
              <MainButton
                title={t("general.loadMore")}
                className="load-more"
                onClick={() => {
                  setPage((prev) => ({
                    ...prev,
                    [laneId]: (prev[laneId] || 1) + 1,
                  }));
                  setStateId(laneId);
                }}
              />
            ),
          }}
          lang="uz"
          t={customTranslation}
        />
      )}
    </OrderBoardStyled>
  );
};

export default OrderBoard;