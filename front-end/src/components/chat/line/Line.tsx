import chatStyles from '@/styles/chat.module.css';
import { IChannelUser } from '@/api/channel/channel.types';
import { ReactElement } from 'react';
import UserInfo from '@/components/chat/line/UserInfo';
import Buttons from '@/components/chat/line/Buttons';
import StatusInfo from '@/components/friends/line/StatusInfo';

interface LineProps {
  user: IChannelUser;
  isOwner: boolean;
  isInChannel: boolean;
  isBanned: boolean;
  isPrivateChannel: boolean;
}

function Line({
  user,
  isOwner,
  isInChannel,
  isBanned,
  isPrivateChannel,
}: LineProps): ReactElement {
  return (
    <div className={chatStyles.ctn_list}>
      <StatusInfo status={user.user.status} withInfo={false} />
      &nbsp;
      <UserInfo user={user.user} isOwner={isOwner} />
      <Buttons
        user={user}
        isInChannel={isInChannel}
        isBanned={isBanned}
        isPrivateChannel={isPrivateChannel}
      />
    </div>
  );
}

export default Line;
