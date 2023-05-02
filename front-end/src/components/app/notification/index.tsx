import NotificationContext from '@/providers/notification/notification.context';
import { ReactElement, useContext } from 'react';

const NotificationBar = (): ReactElement => {
  const notificationCtx = useContext(NotificationContext);
  return (
    <>
      {notificationCtx.notification !== null && (
        <div className={notificationCtx.notification}>
          <p> {notificationCtx.notificationText} </p>
        </div>
      )}
    </>
  );
};

export default NotificationBar;
