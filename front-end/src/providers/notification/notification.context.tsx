/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';
import { INotificationContext } from './notification.interface';

const NotificationContext = createContext<INotificationContext>({
  notification: '',
  notificationText: '',
  success: (text: string) => {},
  error: (text: string) => {},
  clear: () => {},
});

export default NotificationContext;
