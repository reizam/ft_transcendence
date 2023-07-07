import { Fragment, ReactElement, useState } from 'react';
import friendsStyles from '@/styles/friends.module.css';
import chatStyles from '@/styles/chat.module.css';
import { useUpdateFriends } from '@/api/friends/friends.patch.api';
import { TiUserAdd, TiUserDelete } from 'react-icons/ti';
import { AiFillMessage } from 'react-icons/ai';
import { RiPingPongFill, RiMovieFill } from 'react-icons/ri';
import { IChatUser } from '@/api/channel/channel.types';
import Link from 'next/link';
import Modal from '../mute/Mute';

interface ButtonsProps {
  user: IChatUser;
  isBan: boolean;
}

function GetAdminButton(isAdmin: boolean): ReactElement {
  switch (isAdmin) {
    case true:
      return (
        <div className={chatStyles.ctn_btn}>
          <button className={chatStyles.style_btn_activate}>Admin</button>
        </div>
      );
    default:
      return (
        <div className={chatStyles.ctn_btn}>
          <button className={chatStyles.style_btn_activate}>Admin</button>
        </div>
      );
  }
}

function GetMuteButton(isMute: boolean, user: IChatUser): ReactElement {
  const [showModal, setShowModal] = useState(false);

  switch (isMute) {
    case true:
      return (
        <div className={chatStyles.ctn_btn}>
          <button className={chatStyles.style_btn_activate}>Mute</button>
        </div>
      );
    default:
      return (
        <Fragment>
          <div className={chatStyles.ctn_btn}>
            <button className={chatStyles.style_btn_desactivate} onClick={() => setShowModal(true)}>Mute</button>
          </div>
          <Modal user={user} isVisible={showModal} onClose={() => setShowModal(false)}/>
        </Fragment>
      );
  }
}

function GetBanButton(isBan: boolean): ReactElement {
  switch (isBan) {
    case true:
      return (
        <div className={chatStyles.ctn_btn}>
          <button className={chatStyles.style_btn_activate}>Ban</button>
        </div>
      );
    default:
      return (
        <Fragment>
          <div className={chatStyles.ctn_btn}>
            <button className={chatStyles.style_btn_desactivate}>Ban</button>
          </div>
        
        </Fragment>
      );
  }
}

function GetKickButton(): ReactElement {
  return (
    <div className={chatStyles.ctn_btn}>
      <button className={chatStyles.style_btn_desactivate}>Kick</button>
    </div>
  );
}

function GetBlockButton(isBlock: boolean): ReactElement {
  switch (isBlock) {
    case true:
      return (
        <div className={chatStyles.ctn_btn}>
          <button className={chatStyles.style_btn_activate}>Block</button>
        </div>
      );
    default:
      return (
        <div className={chatStyles.ctn_btn}>
          <button className={chatStyles.style_btn_desactivate}>Block</button>
        </div>
      );
  }
}

function Buttons({ user, isBan }: ButtonsProps): ReactElement {
  if (isBan)
    return (
      <div className={chatStyles.ctn_list_btn}>
        {GetBanButton(user.isBan)}
      </div>
    );
  else
    return (
        <div className={chatStyles.ctn_list_btn}>
          {GetAdminButton(user.isAdmin)}
          {GetMuteButton(user.isMute, user)}
          {GetKickButton()}
          {GetBanButton(user.isBan)}
          {GetBlockButton(user.isBlock)}
        </div>
  );
}

export default Buttons;
