import { ReactElement } from 'react';
import friendsStyles from '@/styles/friends.module.css';

interface StatusProps {
  status: string;
}

function GetColor(status: string): ReactElement {
  switch (status) {
    case 'Offline':
      return (
        <span className={`${friendsStyles.badge} ${friendsStyles.red}`}></span>
      );
    case 'Online':
      return (
        <span
          className={`${friendsStyles.badge} ${friendsStyles.green}`}
        ></span>
      );
    case 'In-Game':
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

function StatusInfo({ status }: StatusProps): ReactElement {
  return (
    <>
      <div className={friendsStyles.badge__ctn}>{GetColor(status)}</div>
      <div className={friendsStyles.user__info}>{status}</div>
    </>
  );
}

export default StatusInfo;
