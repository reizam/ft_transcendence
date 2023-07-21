import chatStyles from '@/styles/chat.module.css';
import { FaCrown } from 'react-icons/fa';
import { ReactElement } from 'react';
import { IChatUser } from '@/api/channel/channel.types';
import Link from 'next/link';

interface UserInfoProps {
  user: IChatUser;
  isOwner: boolean;
}

function UserInfo({ user, isOwner }: UserInfoProps): ReactElement {
  return (
    <div className={chatStyles.ctn_user_name}>
      <Link href={`/profile/${user.id}`}>{user?.username}</Link>
      {isOwner ? (
        <>
          &nbsp;&nbsp;
          <FaCrown size="15px" />
        </>
      ) : null}
    </div>
  );
}

export default UserInfo;
