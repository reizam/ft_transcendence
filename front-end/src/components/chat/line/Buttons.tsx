import React, { Fragment, ReactElement, useState } from 'react';
import chatStyles from '@/styles/chat.module.css';
import { IChannelUser, Sanction } from '@/api/channel/channel.types';
import Modal from '@/components/chat/mute/Mute';
import { useAuth } from '@/providers/auth/auth.context';
import { useChannelUpdate } from '@/api/channel/channel.api';
import { useBlockUser } from '@/api/user/user.patch.api';
import { FaUser, FaUserShield, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { LiaHandMiddleFingerSolid, LiaHandPeace } from 'react-icons/lia';
import { ImCross } from 'react-icons/im';
import { CgBlock, CgUnblock } from 'react-icons/cg';
import { AiFillMessage } from 'react-icons/ai';
import { TiUserAdd } from 'react-icons/ti';
import { RiPingPongFill } from 'react-icons/ri';

interface ButtonsProps {
  user: IChannelUser;
  isInChannel: boolean;
  isBanned: boolean;
}

function GetAdminButton(user: IChannelUser): ReactElement {
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);

  const { mutate: demote } = useChannelUpdate({});
  const handleDemote = () => {
    demote(
      {
        sanction: Sanction.DEMOTE,
        userId: user.userId,
        channelId: user.channelId,
      },
      { onSuccess: () => setIsAdmin(false) }
    );
  };

  const { mutate: promote } = useChannelUpdate();
  const handlePromote = () => {
    promote(
      {
        sanction: Sanction.PROMOTE,
        userId: user.userId,
        channelId: user.channelId,
      },
      { onSuccess: () => setIsAdmin(true) }
    );
  };

  if (isAdmin) {
    return (
      <div className={chatStyles.ctn_btn}>
        <button
          className={chatStyles.style_btn_activate}
          onClick={handleDemote}
          name="Admin"
        >
          <FaUser size='24px' />
        </button>
      </div>
    );
  } else {
    return (
      <div className={chatStyles.ctn_btn}>
        <button
          className={chatStyles.style_btn_desactivate}
          onClick={handlePromote}
          name="Admin"
        >
          <FaUserShield size='24px' />
        </button>
      </div>
    );
  }
}

function GetMuteButton(asMuted: boolean, user: IChannelUser): ReactElement {
  const [showModal, setShowModal] = useState(false);
  const [isMuted, setIsMuted] = useState(asMuted);

  const { mutate: unmute } = useChannelUpdate();
  const handleUnmute = () => {
    unmute(
      {
        sanction: Sanction.UNMUTE,
        userId: user.userId,
        channelId: user.channelId,
      },
      { onSuccess: () => setIsMuted(false) }
    );
  };

  const [muteInMinutes, setMuteInMinutes] = useState<string>('');
  const { mutate: mute } = useChannelUpdate();
  const handleMute = () => {
    mute(
      {
        sanction: Sanction.MUTE,
        userId: user.userId,
        channelId: user.channelId,
        minutesToMute: parseInt(muteInMinutes),
      },
      {
        onSuccess: () => setIsMuted(true),
        onSettled: () => setShowModal(false),
      }
    );
  };

  if (isMuted) {
    return (
      <div className={chatStyles.ctn_btn}>
        <button
          className={chatStyles.style_btn_activate}
          onClick={handleUnmute}
          name="Mute"
        >
          <FaMicrophone size='24px' />
        </button>
      </div>
    );
  } else {
    return (
      <Fragment>
        <div className={chatStyles.ctn_btn}>
          <button
            className={chatStyles.style_btn_desactivate}
            onClick={() => setShowModal(true)}
            name="Unmute"
          >
            <FaMicrophoneSlash size='24px' />
          </button>
        </div>
        <Modal
          user={user.user}
          isVisible={showModal}
          valueInMinutes={muteInMinutes}
          setMuteInMinutes={setMuteInMinutes}
          onClick={handleMute}
          onClose={() => setShowModal(false)}
        />
      </Fragment>
    );
  }
}

function GetBanButton(asBanned: boolean, user: IChannelUser): ReactElement {
  const [isBanned, setIsBanned] = useState(asBanned);

  const { mutate: unban } = useChannelUpdate();
  const handleUnban = () => {
    unban(
      {
        sanction: Sanction.UNBAN,
        userId: user.userId,
        channelId: user.channelId,
      },
      { onSuccess: () => setIsBanned(false) }
    );
  };

  const { mutate: ban } = useChannelUpdate();
  const handleBan = () => {
    ban(
      {
        sanction: Sanction.BAN,
        userId: user.userId,
        channelId: user.channelId,
      },
      { onSuccess: () => setIsBanned(true) }
    );
  };

  if (isBanned) {
    return (
      <div className={chatStyles.ctn_btn}>
        <button
          className={chatStyles.style_btn_activate}
          onClick={handleUnban}
          name="Unban"
        >
          <LiaHandPeace size='24px' />
        </button>
      </div>
    );
  } else {
    return (
      <div className={chatStyles.ctn_btn}>
        <button
          className={chatStyles.style_btn_desactivate}
          onClick={handleBan}
          name="Ban"
        >
          <LiaHandMiddleFingerSolid size='24px' />
        </button>
      </div>
    );
  }
}

function GetKickButton(user: IChannelUser): ReactElement {
  const { mutate: kick } = useChannelUpdate();
  const handleKick = () => {
    kick({
      sanction: Sanction.KICK,
      userId: user.userId,
      channelId: user.channelId,
    });
  };

  return (
    <div className={chatStyles.ctn_btn}>
      <button
        className={chatStyles.style_btn_desactivate}
        onClick={handleKick}
        name="Kick"
      >
        <ImCross />
      </button>
    </div>
  );
}

function GetBlockButton(isBlocked: boolean, user: IChannelUser): ReactElement {
  const { mutate: blockUser } = useBlockUser();

  switch (isBlocked) {
    case true:
      return (
        <div className={chatStyles.ctn_btn}>
          <button
            className={chatStyles.style_btn_activate}
            onClick={(): void =>
              blockUser({ id: user.userId, toggleBlock: !isBlocked })
            }
            name="Unblock"
          >
            <CgUnblock size="24px" />
          </button>
        </div>
      );
    default:
      return (
        <div className={chatStyles.ctn_btn}>
          <button
            className={chatStyles.style_btn_desactivate}
            onClick={(): void =>
              blockUser({ id: user.userId, toggleBlock: !isBlocked })
            }
            name="Block"
          >
            <CgBlock size='24px' />
          </button>
        </div>
      );
  }
}

function  GetMessageButton(): ReactElement {
  return (
    <div className={chatStyles.ctn_btn}>
        <button
          className={chatStyles.style_btn_desactivate}
          name="Private Message"
        >
          <AiFillMessage size="24px" />
        </button>
    </div>
  )
}

function  GetAddButton(): ReactElement {
  return (
    <div className={chatStyles.ctn_btn}>
      <button
        className={chatStyles.style_btn_desactivate}
        name="Add"
      >
        <TiUserAdd size="24px" />
      </button>
    </div>
  )
}

function GetPlayMatch(): ReactElement {
  return (
    <div className={chatStyles.ctn_btn}>
      <button
        className={chatStyles.style_btn_desactivate}
        name="Launch a Game"
      >
        <RiPingPongFill size="24px" />
      </button>
    </div>
  )
}

function Buttons({ user, isInChannel, isBanned }: ButtonsProps): ReactElement {
  const { user: socketUser } = useAuth();
  const isBlocked = React.useMemo(
    () => socketUser?.blockedUsers.some((u) => u.id === user?.userId),
    [socketUser?.blockedUsers, user?.userId]
  );

  const isMuted = (mutedUntil?: Date | null): boolean => {
    if (mutedUntil instanceof Date) {
      if (mutedUntil.getTime() > Date.now()) {
        return true;
      }
    } else if (typeof mutedUntil === 'string') {
      const date = new Date(mutedUntil);
      if (!isNaN(date.getTime()) && date.getTime() > Date.now()) {
        return true;
      }
    }
    return false;
  };

  if (isBanned)
    return (
      <div className={chatStyles.ctn_list_btn}>
        {GetBanButton(isBanned, user)}
        {GetBlockButton(!!isBlocked, user)}
      </div>
    );
  else
    return (
      <div className={chatStyles.ctn_list_btn}>
        {isInChannel && GetAdminButton(user)}
        {!isInChannel && GetAddButton()}
        {isInChannel && GetPlayMatch()}
        {isInChannel && GetMessageButton()}
        {isInChannel && GetMuteButton(isMuted(user.mutedUntil), user)}
        {isInChannel && GetKickButton(user)}
        {GetBanButton(isBanned, user)}
        {GetBlockButton(!!isBlocked, user)}
      </div>
    );
}

export default Buttons;
