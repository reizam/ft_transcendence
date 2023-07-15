import chatStyles from '@/styles/chat.module.css';

import { ReactElement } from 'react';
import { IChatUser } from '@/api/channel/channel.types';

interface UserInfoProps {
  user: IChatUser;
}

function UserInfo({ user: user }: UserInfoProps): ReactElement {
  // TODO: Add a crown symbol if isOwner
  return <div className={chatStyles.ctn_user_name}>{user?.username}</div>;
}

export default UserInfo;
