import chatStyles from '@/styles/chat.module.css';

import { IChatUser } from '@/api/channel/channel.types';
import { ReactElement } from 'react';
import UserInfo from '@/components/chat/line/UserInfo';
import Buttons from '@/components/chat/line/Buttons';

interface LineProps {
  user: IChatUser;
  isBan: boolean;
}

function Line({ user, isBan }: LineProps): ReactElement {
  return (
    <div className={chatStyles.ctn_list}>
      <UserInfo user={user} />
      <Buttons user={user} isBan={isBan} />
    </div>
  );
}

export default Line;
