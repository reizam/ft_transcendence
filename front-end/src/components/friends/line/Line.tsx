import friendsStyles from '@/styles/friends.module.css';
import UserInfo from '@/components/friends/line/UserInfo';
import StatusInfo from '@/components/friends/line/StatusInfo';
import Buttons from '@/components/friends/line/Buttons';
import { ReactElement } from 'react';
import { IUserDataSummary } from '@/api/friends/friends.types';

interface LineProps {
  user: IUserDataSummary;
  isFriend: boolean;
}

function Line({ user: user, isFriend }: LineProps): ReactElement {
  return (
    <div className={friendsStyles.friends__list}>
      <UserInfo user={user} />
      <StatusInfo status={user.status} />
      <Buttons user={user} status={user.status} isFriend={isFriend} />
    </div>
  );
}

export default Line;
