export interface INotificationContext {
  notification: string;
  notificationText: string;
  success: (text: string) => void;
  error: (test: string) => void;
  clear: () => void;
}
