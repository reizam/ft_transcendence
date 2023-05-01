import React from 'react';
import { INotificationContext } from './notification.interface';

const NotificationContext = React.createContext<INotificationContext>({
  notification: '',
  notificationText: '',
  success: (text: string) => {},
  error: (test: string) => {},
  clear: () => {},
});

export default NotificationContext;
