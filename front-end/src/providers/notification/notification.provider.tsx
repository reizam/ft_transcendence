import { ReactElement, useState } from 'react';
import NotificationContext from './notification.context';

const STATES = {
  SUCCESS: 'success',
  ERROR: 'error',
};

interface NotifProviderProps {
  children: React.ReactNode;
}

const NotificationProvider = ({
  children,
}: NotifProviderProps): ReactElement => {
  const [notification, setNotification] = useState('');
  const [notificationText, setNotificationText] = useState('');

  const success = (text: string): void => {
    window.scroll(0, 0);
    setNotificationText(text);
    setNotification(STATES.SUCCESS);
  };

  const error = (text: string): void => {
    window.scroll(0, 0);
    setNotificationText(text);
    setNotification(STATES.ERROR);
  };

  const clear = (): void => {
    setNotificationText('');
    setNotification('');
  };

  return (
    <NotificationContext.Provider
      value={{
        success,
        error,
        clear,
        notification,
        notificationText,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider };
