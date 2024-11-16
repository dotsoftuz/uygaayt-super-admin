import { CSSProperties } from "react";

export const translateUz = {
  "Add another lane": "+Status qo'shish",
  "Click to add card": "Buyurtma qo'shish",
  "Delete lane": "Statusni o'chirish",
  "Lane actions": "Status ustidagi amallar",
  button: {
    "Add card": "Buyurtma qo'shing",
    "Add lane": "Status qo'shish",
    Cancel: "Bekor qilish",
  },
  placeholder: {
    title: "Nomi",
    description: "Tavsif",
    label: "Yorliq",
  },
};

export function mapBoardLanes(lanes: any[]): BoardData {
  return {
    lanes: lanes?.map((lane) => ({
      cards:
        lane.orders?.map((order: any) => ({
          id: order._id,
          label: `${order.totalPrice} UZS`,
          title: `#${order.number}`,
          description: order.addressName,
          draggable: !["completed", "cancelled"].includes(order.state),
        })) || [],
      id: lane?._id,
      title: lane.name,
      statusColor: lane.color,
      style: {
        width: 280,
        borderTop: `${
          lane.color !== "#ffffff" ? lane.color : "#364880"
        } 5px solid`,
      },
    })),
  };
}

export interface BoardData {
  lanes: Lane[];
}

export interface Lane {
  id: string;
  title?: string;
  label?: string;
  style?: CSSProperties;
  cards?: Card[];
  currentPage?: number;
  droppable?: boolean;
  labelStyle?: CSSProperties;
  cardStyle?: CSSProperties;
  disallowAddingCard?: boolean;
}

export interface Card {
  id: string;
  title?: string;
  label?: string;
  description?: string;
  laneId?: string;
  style?: CSSProperties;
  draggable?: boolean;
}

export interface IOrderByStatus {
  _id: string;
  name: string;
  color: string;
  position: number;
  orders: {
    _id: string;
    orderNumber: string;
    date: number;
    createdAt: string;
    customer: {
      _id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  }[];
}
