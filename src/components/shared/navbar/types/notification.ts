export interface NotificationType {
    id: string;
    shortText: {
      [key: string]: string;
    };
    type: string;
    documentId?: string;
    courierId?: string;
    isRead: boolean;
    date: string;
  }
  
  export interface NotificationResponse {
    data: NotificationType[];
    total: number;
  }
  
  export interface NotificationState {
    notifications: NotificationType[];
    total: number;
    unreadCount: number;
    page: number;
    hasMore: boolean;
    isLoading: boolean;
  }

