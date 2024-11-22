import { useState } from 'react';
import { useApiMutation } from "hooks/useApi/useApiHooks";
import { Card, Lane } from '../OrderBoard.constants';

interface CardUpdatePayload {
  stateId: string;
  position: number;
}

export const useBoardActions = () => {
  const [orderId, setOrderId] = useState("");

  const { mutate: cardUpdate } = useApiMutation<CardUpdatePayload>(
    `order/state/${orderId}`,
    "put",
    {
      onSuccess() {
        setOrderId("");
      },
      onError(error) {
        console.error('Failed to update order state:', error);
        // Reset the orderId on error as well to prevent stuck states
        setOrderId("");
      }
    }
  );

  const { mutate: laneUpdate } = useApiMutation<{
    position: number;
    _id: string;
  }>("status", "put", {
    onError(error) {
      console.error('Failed to update lane position:', error);
    }
  });

  const { mutate: laneDelete } = useApiMutation<{
    ids: string[];
  }>("status", "delete", {
    onError(error) {
      console.error('Failed to delete lane:', error);
    }
  });

  const onCardDragEnd = (
    cardId: Card["id"],
    sourceLandId: Lane["id"],
    targetLaneId: Lane["id"],
    position: number,
    card: Card
  ) => {
    setOrderId(card.id);
    
    // Send the update request with the correct payload
    cardUpdate({
      stateId: targetLaneId,
      position,
    });
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

  return {
    onCardDragEnd,
    onLaneDragEnd,
    laneDelete,
  };
};