import { ReactElement, useState } from 'react';
import friendsStyles from '@/styles/friends.module.css';
import Link from 'next/link';
import { IUserDataSummary } from '@/api/friends/friends.types';
import { useUpdateFriends } from '@/api/friends/friends.patch.api';
import { TiUserAdd, TiUserDelete } from 'react-icons/ti';
import { AiFillMessage } from 'react-icons/ai';
import { RiPingPongFill, RiMovieFill } from 'react-icons/ri';
import { useSocket } from '@/providers/socket/socket.context';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Status } from '@/api/user/user.types';
import { useDMJoin } from '@/api/channel/channel.api';

interface ButtonsProps {
  user: IUserDataSummary;
  status: string;
  isFriend: boolean;
}

function GetStatusButton(user: IUserDataSummary, status: string): ReactElement {
  const [hasChallenged, setHasChallenged] = useState(false);
  const { socket } = useSocket();
  const router = useRouter();

  const challengeUser = (challengedUser: {
    id: number;
    username: string;
  }): void => {
    setHasChallenged(true);
    socket?.volatile.emit(
      'createChallengeGame',
      challengedUser,
      (_ack: string) => {
        toast.info(
          "Let's see if " +
            user.username +
            ' is not too afraid to accept the challenge!',
          { pauseOnFocusLoss: false }
        );
      }
    );
    setTimeout(() => setHasChallenged(false), 15000);
  };

  const watchUser = (challengedUser: {
    id: number;
    username: string;
  }): void => {
    socket?.volatile.emit('watchGame', challengedUser, (gameId: string) =>
      router.push('/game/' + gameId)
    );
  };

  switch (status) {
    case Status.OFFLINE:
      return <div></div>;
    case Status.ONLINE:
      return (
        <div className={friendsStyles.button__ctn}>
          <button
            onClick={(): void =>
              challengeUser({
                id: user.id,
                username: user.username,
              })
            }
            className={friendsStyles.style__button__1}
            disabled={hasChallenged}
            title="Let's play a match"
          >
            <RiPingPongFill size="24px" />
          </button>
        </div>
      );
    case Status.IN_GAME:
      return (
        <div className={friendsStyles.button__ctn}>
          <button
            onClick={(): void =>
              watchUser({
                id: user.id,
                username: user.username,
              })
            }
            className={friendsStyles.style__button__1}
            title="Watch the game"
          >
            <RiMovieFill size="24px" />
          </button>
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
          title="Remove friend"
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
          title="Add friend"
        >
          <TiUserAdd size="24px" />
        </button>
      </div>
    );
}

function FriendButtons({ user, status, isFriend }: ButtonsProps): ReactElement {
  const { mutate: joinDM } = useDMJoin();
  const router = useRouter();
  const handleJoinDM = () => {
    joinDM(
      { otherUserId: user.id },
      {
        onSuccess: (channel) => {
          router.push('/chat/channel/' + channel.id);
        },
      }
    );
  };

  return (
    <div className={friendsStyles.buttons__ctn}>
      {GetSocialButton(user, isFriend)}
      <div className={friendsStyles.button__ctn}>
        <button
          className={friendsStyles.style__button__1}
          onClick={handleJoinDM}
          title="Chat in private"
        >
          <AiFillMessage size="24px" />
        </button>
      </div>
      {GetStatusButton(user, status)}
    </div>
  );
}

export default FriendButtons;
