import friendsStyles from '@/styles/friends.module.css';
import { ReactElement } from 'react';
import { IUserDataSummary } from '@/api/friends/friends.types';

interface UserInfoProps {
  user: IUserDataSummary;
}

function UserInfo({ user: user }: UserInfoProps): ReactElement {
  return (
    <>
      <div
        className={friendsStyles.pict__prof}
      >
        <img
          className={friendsStyles.img__prof}
          src={user?.profilePicture}
        />
      </div>
      <div className={friendsStyles.user__name}>{user?.username}</div>

    </>
  );
}

export default UserInfo;