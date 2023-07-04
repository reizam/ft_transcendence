import friendsStyles from '@/styles/friends.module.css';

import { IChatUser } from '@/api/channel/channel.types';
import { ReactElement } from 'react';
import UserInfo from '@/components/chat/line/UserInfo';
import Buttons from '@/components/chat/line/Buttons';

interface LineProps {
  user: IChatUser;
}

function Line({ user: user }: LineProps): ReactElement {
  return (
    <div className={friendsStyles.friends__list}>
      <UserInfo user={user} />
      <Buttons user={user} />
    </div>
  );
}

export default Line;
