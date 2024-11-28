export type NotificationType = 'yangi_mashina' | 'yangi_haydovchi' | 'yangi_guvohnoma';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  person: string;
  date: string;
  time: string;
  read: boolean;
}