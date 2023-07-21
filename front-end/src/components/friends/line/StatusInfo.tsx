import { ReactElement } from 'react';
import friendsStyles from '@/styles/friends.module.css';
import { Status } from '@/api/user/user.types';

interface StatusProps {
  status: Status;
  withInfo: Boolean;
}

function GetColor(status: Status): ReactElement {
  switch (status) {
    case Status.OFFLINE:
      return (
        <span className={`${friendsStyles.badge} ${friendsStyles.red}`}></span>
      );
    case Status.ONLINE:
      return (
        <span
          className={`${friendsStyles.badge} ${friendsStyles.green}`}
        ></span>
      );
    case Status.IN_GAME:
      return (
        <span
          className={`${friendsStyles.badge} ${friendsStyles.orange}`}
        ></span>
      );
    default:
      return (
        <span className={`${friendsStyles.badge} ${friendsStyles.grey}`}></span>
      );
  }
}

function StatusInfo({ status, withInfo = true }: StatusProps): ReactElement {
  if (withInfo)
    return (
      <>
        <div className={friendsStyles.badge__ctn}>{GetColor(status)}</div>
        <div className={friendsStyles.user__info}>{status}</div>
      </>
    );
  return (
        <div className={friendsStyles.badge__ctn}>{GetColor(status)}</div>
    );
}

export default StatusInfo;
