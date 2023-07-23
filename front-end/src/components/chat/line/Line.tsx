import chatStyles from '@/styles/chat.module.css';
import { IChannelUser } from '@/api/channel/channel.types';
import { ReactElement } from 'react';
import UserInfo from '@/components/chat/line/UserInfo';
import Buttons from '@/components/chat/line/Buttons';
import StatusInfo from '@/components/friends/line/StatusInfo';

interface LineProps {
  isDM: boolean;
  user: IChannelUser;
  isInChannel: boolean;
  asOwner: boolean;
  asAdmin: boolean;
  isOwner: boolean;
  isBanned: boolean;
  isPrivateChannel: boolean;
}

function Line({
  isDM,
  user,
  isInChannel,
  asOwner,
  asAdmin,
  isOwner,
  isBanned,
  isPrivateChannel,
}: LineProps): ReactElement {
  return (
    <div className={chatStyles.ctn_list}>
      <StatusInfo status={user.user.status} withInfo={false} />
      &nbsp;
      <UserInfo user={user.user} isOwner={isOwner} />
      <Buttons
        isDM={isDM}
        user={user}
        isInChannel={isInChannel}
        asOwner={asOwner}
        asAdmin={asAdmin}
        isOwner={isOwner}
        isBanned={isBanned}
        isPrivateChannel={isPrivateChannel}
      />
    </div>
  );
}

export default Line;
