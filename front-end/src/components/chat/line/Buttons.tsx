import React, { Fragment, ReactElement, useState } from 'react';
import chatStyles from '@/styles/chat.module.css';
import { IChannelUser, Sanction } from '@/api/channel/channel.types';
import Modal from '@/components/chat/mute/Mute';
import { useAuth } from '@/providers/auth/auth.context';
import { printChannelError, useChannelUpdate } from '@/api/channel/channel.api';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

interface ButtonsProps {
  user: IChannelUser;
  isInChannel: boolean;
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

function GetMuteButton(asMuted: boolean, user: IChannelUser): ReactElement {
  const [showModal, setShowModal] = useState(false);
  const [isMuted, setIsMuted] = useState(asMuted);
  const queryClient = useQueryClient();

  const { mutate: unmute } = useChannelUpdate({
    onSuccess: () => {
      void queryClient.invalidateQueries(['CHANNEL', 'GET', user.channelId]);
      setIsMuted(false);
    },
    onError: (err: unknown) => {
      toast.error(printChannelError(err));
    },
  });
  const handleUnmute = () => {
    unmute({
      sanction: Sanction.UNMUTE,
      userId: user.userId,
      channelId: user.channelId,
    });
  };

  const [muteInMinutes, setMuteInMinutes] = useState<string>('');
  const { mutate: mute } = useChannelUpdate({
    onMutate: () => {
      setShowModal(false);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries(['CHANNEL', 'GET', user.channelId]);
      setIsMuted(true);
    },
    onError: (err: unknown) => {
      toast.error(printChannelError(err));
    },
  });
  const handleMute = () => {
    mute({
      sanction: Sanction.MUTE,
      userId: user.userId,
      channelId: user.channelId,
      minutesToMute: parseInt(muteInMinutes),
    });
  };

  if (isMuted) {
    return (
      <div className={chatStyles.ctn_btn}>
        <button
          className={chatStyles.style_btn_activate}
          onClick={handleUnmute}
        >
          Unmute
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
          >
            Mute
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
        {GetBanButton(isBanned)}
        {GetBlockButton(!!isBlocked)}
      </div>
    );
  else
    return (
      <div className={chatStyles.ctn_list_btn}>
        {isInChannel && GetAdminButton(user.isAdmin)}
        {isInChannel && GetMuteButton(isMuted(user.mutedUntil), user)}
        {isInChannel && GetKickButton()}
        {GetBanButton(isBanned)}
        {GetBlockButton(!!isBlocked)}
      </div>
    );
}

export default Buttons;
