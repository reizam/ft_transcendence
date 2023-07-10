import React, { Fragment, ReactElement, useState } from 'react';
import chatStyles from '@/styles/chat.module.css';
import { IChannelUser, IChatUser } from '@/api/channel/channel.types';
import Modal from '@/components/chat/mute/Mute';
import { useAuth } from '@/providers/auth/auth.context';

interface ButtonsProps {
  user: IChannelUser;
  isBanned: boolean;
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
            <button
              className={chatStyles.style_btn_desactivate}
              onClick={() => setShowModal(true)}
            >
              Mute
            </button>
          </div>
          <Modal
            user={user}
            isVisible={showModal}
            onClose={() => setShowModal(false)}
          />
        </Fragment>
      );
  }
}

function GetBanButton(isBanned: boolean): ReactElement {
  switch (isBanned) {
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

function GetBlockButton(isBlocked: boolean): ReactElement {
  switch (isBlocked) {
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

function Buttons({ user, isBanned }: ButtonsProps): ReactElement {
  const { user: socketUser } = useAuth();
  const isBlocked = React.useMemo(
    () => socketUser?.blockedUsers.some((u) => u.id === user?.userId),
    [socketUser?.blockedUsers, user?.userId]
  );

  const isMuted = (mutedUntil?: Date): boolean => {
    if (mutedUntil && mutedUntil.getTime() > Date.now()) return true;
    return false;
  };

  if (isBanned)
    return (
      <div className={chatStyles.ctn_list_btn}>{GetBanButton(isBanned)}</div>
    );
  else
    return (
      <div className={chatStyles.ctn_list_btn}>
        {GetAdminButton(user.isAdmin)}
        {GetMuteButton(isMuted(user.mutedUntil), user.user)}
        {GetKickButton()}
        {GetBanButton(isBanned)}
        {GetBlockButton(!!isBlocked)}
      </div>
    );
}

export default Buttons;
