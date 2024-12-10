import React, { useEffect, useMemo, useState } from "react";
// @ts-ignore
import Board, { createTranslate } from "react-trello";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MainButton, Loading } from "components";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useRoleManager } from "services/useRoleManager";
import SwitchView from "pages/order/components/SwitchView/SwitchView";
import LaneHeader from "./components/LaneHeader";
import { OrderBoardStyled } from "./OrderBoard.styled";
import {
  Card,
  IOrderByStatus,
  Lane,
  mapBoardLanes,
  translateUz,
} from "./OrderBoard.constants";
import { useAppDispatch, useAppSelector } from "store/storeHooks";
import { socketReRender } from "store/reducers/SocketSlice";
import { reRenderTable } from "components/elements/Table/reducer/table.slice";
import { socket } from "socket";

// @ts-ignore
import audio from "../../../../assets/order-voice.mp3";

const customTranslation = createTranslate(translateUz);

const OrderBoard = () => {
  const allParams = useAllQueryParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState<any>();
  const [getBoardDataFinished, setGetBoardDataFinished] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [pagesMap, setPagesMap] = useState<Record<string, number>>({});
  const hasAccess = useRoleManager();
  const socketRender = useAppSelector((store) => store.SocketState.render);
  const dis = useAppDispatch();
  const [stateUpdateData, setStateUpdateData] = useState<any>();

  const { data: statesData, status: statesStatus, refetch } = useApi<IOrderByStatus[]>(
    "order-state/get-all",
    {
      ...allParams,
    },
    { suspense: false }
  );

  const { mutate, reset: resetUpdatedCard } = useApiMutation(
    `order/state/${stateUpdateData?.orderId}`,
    "put",
    {
      onSuccess() {
        setStateUpdateData(undefined);
        dis(reRenderTable(true));
      },
    }
  );

  useEffect(() => {
    if (stateUpdateData) {
      mutate({
        stateId: stateUpdateData.stateId,
        _id: stateUpdateData.orderId,
        position: 1,
      });
    }
  }, [stateUpdateData]);

  const { mutate: fetchOrders, reset } = useApiMutation(
    "order/paging",
    "post",
    {
      onSuccess({ data }, variables) {
        const { stateId } = variables;
        setBoardData((prev: any) => {
          if (!prev) return prev;
          return prev.map((item: any) => {
            if (item._id === stateId) {
              const oldOrders = pagesMap[stateId] === 1 ? [] : (item.orders || []);
              const existingOrderIds = new Set(oldOrders.map((order: any) => order._id));

              const newOrders = data?.data
                ?.filter((order: any) => !existingOrderIds.has(order._id))
                ?.map((order: any) => ({
                  number: order.number,
                  totalPrice: order.totalPrice,
                  addressName: order.addressName,
                  createdAt: order.createdAt,
                  state: order.state?.state,
                  _id: order._id,
                  uniqueId: `${order._id}-${order.createdAt}`
                }));

              return {
                ...item,
                orders: [...oldOrders, ...(newOrders || [])]
              };
            }
            return item;
          });
        });

        setLoadingStates(prev => ({
          ...prev,
          [stateId]: false
        }));
      },
      onError(error, variables) {
        const { stateId } = variables;
        setLoadingStates(prev => ({
          ...prev,
          [stateId]: false
        }));
      }
    }
  );

  useEffect(() => {
    if (socketRender) {
      resetUpdatedCard()
      reset();
      refetch()
      dis(socketReRender(false));
    }
  }, [socketRender]);

  const makeNoice = () => {
    try {
      new Audio(audio).play();
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    const handleUpdateOrder = (data: { data: any }) => {
      if (!!data.data.state?.isSoundable) makeNoice();
      setBoardData((prev: any) => {
        if (!prev) return prev;

        return prev.map((item: any) => {
          if (item._id === data.data.stateId) {
            const newOrder = {
              number: data.data.number,
              totalPrice: data.data.totalPrice,
              addressName: data.data.addressName,
              createdAt: data.data.createdAt,
              state: data.data.state?.state,
              _id: data.data._id,
              uniqueId: `${data.data._id}-${data.data.createdAt}`
            };

            const existingOrderIds = new Set((item.orders || []).map((order: any) => order._id));
            if (existingOrderIds.has(newOrder._id)) {
              return item; // Agar buyurtma mavjud bo'lsa, qo'shmang
            }

            return {
              ...item,
              orders: [...(item.orders || []), newOrder],
            };
          }
          return item;
        });
      });
    };

    socket.on('orderCreated', handleUpdateOrder);

    return () => {
      socket.off('orderCreated', handleUpdateOrder);
    };
  }, []);


  // Initialize board data and fetch initial orders
  useEffect(() => {
    if (statesStatus === "success" && statesData?.data) {
      setBoardData(statesData.data);

      // Initialize pages map
      const initialPagesMap = statesData.data.reduce((acc, state) => ({
        ...acc,
        [state._id]: 1
      }), {});
      setPagesMap(initialPagesMap);

      // Fetch initial orders for each state
      statesData.data.forEach(state => {
        setLoadingStates(prev => ({
          ...prev,
          [state._id]: true
        }));

        fetchOrders({
          page: 1,
          limit: 10,
          stateId: state._id,
        });
      });
    }
  }, [statesStatus, statesData?.data]);

  // Set board data as finished when all initial loads are complete
  useEffect(() => {
    if (boardData && Object.values(loadingStates).every(state => !state)) {
      setGetBoardDataFinished(true);
    }
  }, [boardData, loadingStates]);

  const handleLoadMore = (laneId: string) => {
    if (loadingStates[laneId]) return;

    setLoadingStates(prev => ({
      ...prev,
      [laneId]: true
    }));

    const nextPage = (pagesMap[laneId] || 1) + 1;
    setPagesMap(prev => ({
      ...prev,
      [laneId]: nextPage
    }));

    fetchOrders({
      page: nextPage,
      limit: 10,
      stateId: laneId,
    });
  };

  const { mutate: cardUpdate } = useApiMutation<{
    stateId: string;
    position: number;
    _id?: string;
  }>(`order/state/${orderId}`, "put", {
    onSuccess() {
      setOrderId("");
    },
  });

  const { mutate: laneUpdate } = useApiMutation<{
    position: number;
    _id: string;
  }>("status", "put");

  const { mutate: laneDelete } = useApiMutation<{
    ids: string[];
  }>("status", "delete");

  const onCardDragEnd = (
    cardId: Card["id"],
    sourceLandId: Lane["id"],
    targetLaneId: Lane["id"],
    position: number,
    card: Card
  ) => {
    setOrderId(card.metadata?.originalId || card.id);
    setTimeout(
      () =>
        cardUpdate({
          position,
          stateId: targetLaneId,
          _id: card?.metadata?.originalId
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

  const handleCardClick = (cardId: string, metadata?: { originalId?: string }) => {
    const originalId = metadata?.originalId;
    if (originalId) {
      navigate(`/order/${originalId}`);
    }
  };





  const readyBoardData = useMemo(() => {
    if (getBoardDataFinished) {
      return mapBoardLanes(boardData || []);
    }
    return { lanes: [] };
  }, [boardData, getBoardDataFinished]);

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
          onCardClick={handleCardClick}
          components={{
            LaneHeader: (lane: any) => LaneHeader(lane, laneDelete),
            AddCardLink: ({ laneId }: { laneId: string }) => (
              <MainButton
                title={loadingStates[laneId] ? t("general.loading") : t("general.loadMore")}
                className="load-more"
                disabled={loadingStates[laneId]}
                onClick={() => handleLoadMore(laneId)}
              />
            ),
          }}
          lang="ru"
          t={customTranslation}
        />
      )}
    </OrderBoardStyled>
  );
};

export default OrderBoard;