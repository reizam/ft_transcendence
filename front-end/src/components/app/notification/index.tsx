import NotificationContext from '@/providers/notification/notification.context';
import { useContext } from 'react';

const NotificationBar = () => {
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
