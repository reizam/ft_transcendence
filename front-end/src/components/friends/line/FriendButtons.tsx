import { ReactElement } from 'react';
import friendsStyles from '@/styles/friends.module.css';
import Link from 'next/link';
import { IUserDataSummary } from '@/api/friends/friends.types';
import { useUpdateFriends } from '@/api/friends/friends.patch.api';
import { TiUserAdd, TiUserDelete } from 'react-icons/ti';
import { AiFillMessage } from 'react-icons/ai';
import { RiPingPongFill, RiMovieFill } from 'react-icons/ri';

interface ButtonsProps {
  user: IUserDataSummary;
  status: string;
  isFriend: boolean;
}

function GetStatusButton(status: string): ReactElement {
  switch (status) {
    case 'Offline':
      return <div></div>;
    case 'Online':
      return (
        <div className={friendsStyles.button__ctn}>
          <Link href="/game/test">
            <button className={friendsStyles.style__button__1}>
              <RiPingPongFill size="24px" />
            </button>
          </Link>
        </div>
      );
    case 'In-Game':
      return (
        <div className={friendsStyles.button__ctn}>
          <Link href="/game/test">
            <button className={friendsStyles.style__button__1}>
              <RiMovieFill size="24px" />
            </button>
          </Link>
        </div>
      );
    default:
      return (
        <div className={friendsStyles.button__ctn}>
          <Link href="/game/test">
            <button className={friendsStyles.style__button__1}>WTF</button>
          </Link>
        </div>
      );
  }
}

function GetSocialButton(
  user: IUserDataSummary,
  isFriend: boolean
): ReactElement {
  const { mutate } = useUpdateFriends();
  if (isFriend)
    return (
      <div className={friendsStyles.button__ctn}>
        <button
          className={friendsStyles.style__button__1}
          onClick={() => mutate({ operation: 'REMOVE', friendId: user.id })}
        >
          <TiUserDelete size="24px" />
        </button>
      </div>
    );
  else
    return (
      <div className={friendsStyles.button__ctn}>
        <button
          className={friendsStyles.style__button__1}
          onClick={() => mutate({ operation: 'ADD', friendId: user.id })}
        >
          <TiUserAdd size="24px" />
        </button>
      </div>
    );
}

function FriendButtons({
  user: user,
  status,
  isFriend,
}: ButtonsProps): ReactElement {
  return (
    <div className={friendsStyles.buttons__ctn}>
      {GetSocialButton(user, isFriend)}
      <div className={friendsStyles.button__ctn}>
        <Link href="/game/test">
          <button className={friendsStyles.style__button__1}>
            <AiFillMessage size="24px" />
          </button>
        </Link>
      </div>
      {GetStatusButton(status)}
    </div>
  );
}

export default FriendButtons;
