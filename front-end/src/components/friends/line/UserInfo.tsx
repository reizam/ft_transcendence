import friendsStyles from '@/styles/friends.module.css';
import Link from 'next/link';
import { ReactElement } from 'react';
import { IUserDataSummary } from '@/api/friends/friends.types';

interface UserInfoProps {
  user: IUserDataSummary;
}

function UserInfo({ user: user }: UserInfoProps): ReactElement {
  return (
    <>
      <div className={friendsStyles.flexContainer}>
        <Link
          href={`/profile/${user.id}`}
          className={friendsStyles.linkContainer}
        >
          <div className={friendsStyles.pict__prof}>
            <picture>
              <img
                className={friendsStyles.img__prof}
                src={user?.profilePicture}
                alt={`${user.username} picture`}
              />
            </picture>
          </div>
          <div className={friendsStyles.user__name}>{user?.username}</div>
        </Link>
      </div>
    </>
  );
}

export default UserInfo;
