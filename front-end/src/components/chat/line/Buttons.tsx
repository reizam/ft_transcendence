import { ReactElement } from 'react';
import friendsStyles from '@/styles/friends.module.css';

import { useUpdateFriends } from '@/api/friends/friends.patch.api';
import { TiUserAdd, TiUserDelete } from 'react-icons/ti';
import { AiFillMessage } from 'react-icons/ai';
import { RiPingPongFill, RiMovieFill } from 'react-icons/ri';

import { IChatUser } from '@/api/channel/channel.types';
import Link from 'next/link';

interface ButtonsProps {
  user: IChatUser;
  isBan: boolean;
}

function GetAdminButton(isAdmin: boolean): ReactElement {
  switch (isAdmin) {
    case true:
      return (
        <div className={friendsStyles.button__ctn}>
          <button className={friendsStyles.style__button__1}>Admin</button>
        </div>
      );
    default:
      return (
        <div className={friendsStyles.button__ctn}>
          <button className={friendsStyles.style__button__1}>NonAdmin</button>
        </div>
      );
  }
}

function GetMuteButton(isMute: boolean): ReactElement {
  switch (isMute) {
    case true:
      return (
        <div className={friendsStyles.button__ctn}>
          <button className={friendsStyles.style__button__1}>Mute</button>
        </div>
      );
    default:
      return (
        <div className={friendsStyles.button__ctn}>
          <button className={friendsStyles.style__button__1}>NonMute</button>
        </div>
      );
  }
}

function GetBanButton(isBan: boolean): ReactElement {
  switch (isBan) {
    case true:
      return (
        <div className={friendsStyles.button__ctn}>
          <button className={friendsStyles.style__button__1}>Ban</button>
        </div>
      );
    default:
      return (
        <div className={friendsStyles.button__ctn}>
          <button className={friendsStyles.style__button__1}>NonBan</button>
        </div>
      );
  }
}

function GetKickButton(): ReactElement {
  return (
    <div className={friendsStyles.button__ctn}>
      <button className={friendsStyles.style__button__1}>Kick</button>
    </div>
  );
}

function GetBlockButton(isBlock: boolean): ReactElement {
  switch (isBlock) {
    case true:
      return (
        <div className={friendsStyles.button__ctn}>
          <button className={friendsStyles.style__button__1}>Block</button>
        </div>
      );
    default:
      return (
        <div className={friendsStyles.button__ctn}>
          <button className={friendsStyles.style__button__1}>NonBlock</button>
        </div>
      );
  }
}

function Buttons({ user, isBan }: ButtonsProps): ReactElement {
  if (isBan) return <>{GetBanButton(user.isBan)}</>;

  return (
    <div className={friendsStyles.buttons__ctn}>
      {GetAdminButton(user.isAdmin)}
      {GetMuteButton(user.isMute)}
      {GetKickButton()}
      {GetBanButton(user.isBan)}
      {GetBlockButton(user.isBlock)}
    </div>
  );
}

export default Buttons;
