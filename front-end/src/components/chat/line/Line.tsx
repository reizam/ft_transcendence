import chatStyles from '@/styles/chat.module.css';
import { IChannelUser } from '@/api/channel/channel.types';
import { ReactElement } from 'react';
import UserInfo from '@/components/chat/line/UserInfo';
import Buttons from '@/components/chat/line/Buttons';

interface LineProps {
  user: IChannelUser;
  isBanned: boolean;
}

function Line({ user, isBanned }: LineProps): ReactElement {
  return (
    <div className={chatStyles.ctn_list}>
      <UserInfo user={user.user} />
      <Buttons user={user} isBanned={isBanned} />
    </div>
  );
}

export default Line;
