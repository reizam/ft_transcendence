import { ReactElement } from 'react';
import friendsStyles from '@/styles/friends.module.css';
import { Status } from '@/api/user/user.types';

interface StatusProps {
  status: Status;
  withInfo?: boolean;
}

function GetColor(status: Status, withInfo: boolean): ReactElement {
  const title: string = withInfo ? '' : status;

  switch (status) {
    case Status.OFFLINE:
      return (
        <span
          className={`${friendsStyles.badge} ${friendsStyles.red}`}
          title={title}
        ></span>
      );
    case Status.ONLINE:
      return (
        <span
          className={`${friendsStyles.badge} ${friendsStyles.green}`}
          title={title}
        ></span>
      );
    case Status.IN_GAME:
      return (
        <span
          className={`${friendsStyles.badge} ${friendsStyles.orange}`}
          title={title}
        ></span>
      );
    default:
      return (
        <span
          className={`${friendsStyles.badge} ${friendsStyles.grey}`}
          title={title}
        ></span>
      );
  }
}

function StatusInfo({ status, withInfo = true }: StatusProps): ReactElement {
  if (withInfo)
    return (
      <>
        <div className={friendsStyles.badge__ctn}>
          {GetColor(status, withInfo)}&nbsp;
        </div>
        <div className={friendsStyles.user__info}>{status}</div>
      </>
    );
  return (
    <div className={friendsStyles.badge__ctn}>
      {GetColor(status, withInfo)}&nbsp;
    </div>
  );
}

export default StatusInfo;
