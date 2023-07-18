import React, { Fragment, ReactElement, useState } from 'react';
import chatStyles from '@/styles/chat.module.css';
import { IChannelUser, Sanction } from '@/api/channel/channel.types';
import Modal from '@/components/chat/mute/Mute';
import { useAuth } from '@/providers/auth/auth.context';
import { useChannelUpdate } from '@/api/channel/channel.api';
import { useBlockUser } from '@/api/user/user.patch.api';
import {
  FaUser,
  FaUserShield,
  FaMicrophone,
  FaMicrophoneSlash,
} from 'react-icons/fa';
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
  isPrivateChannel: boolean;
}

function GetAdminButton(user: IChannelUser): ReactElement {
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const { mutate: updateStatus } = useChannelUpdate({});
  const changeStatus = (newStatus: Sanction) => {
    updateStatus(
      {
        sanction: newStatus,
        userId: user.userId,
        channelId: user.channelId,
      },
      { onSuccess: () => setIsAdmin(!isAdmin) }
    );
  };

  return (
    <div className={chatStyles.ctn_btn}>
      <button
        className={
          isAdmin
            ? chatStyles.style_btn_activate
            : chatStyles.style_btn_desactivate
        }
        onClick={() =>
          changeStatus(isAdmin ? Sanction.DEMOTE : Sanction.PROMOTE)
        }
        title={isAdmin ? 'Demote' : 'Promote'}
      >
        {isAdmin ? <FaUser size="24px" /> : <FaUserShield size="24px" />}
      </button>
    </div>
  );
}

function GetMuteButton(asMuted: boolean, user: IChannelUser): ReactElement {
  const [showModal, setShowModal] = useState(false);
  const [isMuted, setIsMuted] = useState(asMuted);
  const [muteInMinutes, setMuteInMinutes] = useState<string>('');
  const { mutate: updateMute } = useChannelUpdate();
  const changeMute = (sanction: Sanction) => {
    updateMute(
      {
        sanction,
        userId: user.userId,
        channelId: user.channelId,
        minutesToMute: isMuted ? undefined : parseInt(muteInMinutes),
      },
      {
        onSuccess: () => setIsMuted(!isMuted),
        onSettled: isMuted ? undefined : () => setShowModal(false),
      }
    );
  };

  if (isMuted) {
    return (
      <div className={chatStyles.ctn_btn}>
        <button
          className={chatStyles.style_btn_activate}
          onClick={() => changeMute(Sanction.UNMUTE)}
          title="Unmute"
        >
          <FaMicrophone size="24px" />
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
            title="Mute"
          >
            <FaMicrophoneSlash size="24px" />
          </button>
        </div>
        <Modal
          user={user.user}
          isVisible={showModal}
          valueInMinutes={muteInMinutes}
          setMuteInMinutes={setMuteInMinutes}
          onClick={() => changeMute(Sanction.MUTE)}
          onClose={() => setShowModal(false)}
        />
      </Fragment>
    );
  }
}

function GetBanButton(asBanned: boolean, user: IChannelUser): ReactElement {
  const [isBanned, setIsBanned] = useState(asBanned);
  const { mutate: updateBan } = useChannelUpdate();
  const changeBan = (sanction: Sanction) => {
    updateBan(
      {
        sanction,
        userId: user.userId,
        channelId: user.channelId,
      },
      { onSuccess: () => setIsBanned(!isBanned) }
    );
  };

  return (
    <div className={chatStyles.ctn_btn}>
      <button
        className={
          isBanned
            ? chatStyles.style_btn_activate
            : chatStyles.style_btn_desactivate
        }
        onClick={() => changeBan(isBanned ? Sanction.UNBAN : Sanction.BAN)}
        title={isBanned ? 'Unban' : 'Ban'}
      >
        {isBanned ? (
          <LiaHandPeace size="24px" />
        ) : (
          <LiaHandMiddleFingerSolid size="24px" />
        )}
      </button>
    </div>
  );
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
        title="Kick"
      >
        <ImCross />
      </button>
    </div>
  );
}

function GetBlockButton(isBlocked: boolean, user: IChannelUser): ReactElement {
  const { mutate: blockUser } = useBlockUser();

  return (
    <div className={chatStyles.ctn_btn}>
      <button
        className={
          isBlocked
            ? chatStyles.style_btn_activate
            : chatStyles.style_btn_desactivate
        }
        onClick={(): void =>
          blockUser({ id: user.userId, toggleBlock: !isBlocked })
        }
        title={isBlocked ? 'Unblock' : 'Block'}
      >
        {isBlocked ? <CgUnblock size="24px" /> : <CgBlock size="24px" />}
      </button>
    </div>
  );
}

function GetMessageButton(): ReactElement {
  return (
    <div className={chatStyles.ctn_btn}>
      <button
        className={chatStyles.style_btn_desactivate}
        title="Private Message"
      >
        <AiFillMessage size="24px" />
      </button>
    </div>
  );
}

function GetAddButton(): ReactElement {
  return (
    <div className={chatStyles.ctn_btn}>
      <button
        className={chatStyles.style_btn_desactivate}
        title="Add in channel"
      >
        <TiUserAdd size="24px" />
      </button>
    </div>
  );
}

function GetPlayMatch(): ReactElement {
  return (
    <div className={chatStyles.ctn_btn}>
      <button
        className={chatStyles.style_btn_desactivate}
        title="Let's play a match"
      >
        <RiPingPongFill size="24px" />
      </button>
    </div>
  );
}

function Buttons({
  user,
  isInChannel,
  isBanned,
  isPrivateChannel,
}: ButtonsProps): ReactElement {
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
        {!isInChannel && isPrivateChannel && GetAddButton()}
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
