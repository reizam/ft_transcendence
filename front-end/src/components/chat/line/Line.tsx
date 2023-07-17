import chatStyles from '@/styles/chat.module.css';
import { IChannelUser } from '@/api/channel/channel.types';
import { ReactElement } from 'react';
import UserInfo from '@/components/chat/line/UserInfo';
import Buttons from '@/components/chat/line/Buttons';
import StatusInfo from '@/components/friends/line/StatusInfo';

interface LineProps {
  user: IChannelUser;
  isInChannel: boolean;
  isBanned: boolean;
}

function Line({ user, isInChannel, isBanned }: LineProps): ReactElement {
  return (
    <div className={chatStyles.ctn_list}>
      <UserInfo user={user.user} />
      <StatusInfo status={user.status} />
      <Buttons user={user} isInChannel={isInChannel} isBanned={isBanned} />
    </div>
  );
}

export default Line;
