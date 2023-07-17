import chatStyles from '@/styles/chat.module.css';
import { FaCrown } from 'react-icons/fa';
import { ReactElement } from 'react';
import { IChannel, IChannelUser, IChatUser } from '@/api/channel/channel.types';

interface UserInfoProps {
  user: IChatUser;
  ownerId: IChannel;
}

function UserInfo({ user: user, ownerId }: UserInfoProps): ReactElement {
  // TODO: Add a crown symbol if isOwner
  if (ownerId === user.id)
    return (
      <div className={chatStyles.ctn_user_name}>
        {user?.username}
        <FaCrown size="15px" />
      </div>
    )
  else 
    return (
      <div className={chatStyles.ctn_user_name}>
        {user?.username}
      </div>
    )
}

export default UserInfo;
