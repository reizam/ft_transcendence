import friendsStyles from '@/styles/friends.module.css';

import { ReactElement } from 'react';
import { IChatUser } from '@/api/channel/channel.types';

interface UserInfoProps {
  user: IChatUser;
}

function UserInfo({ user: user }: UserInfoProps): ReactElement {
  return <div className={friendsStyles.user__name}>{user?.username}</div>;
}

export default UserInfo;
