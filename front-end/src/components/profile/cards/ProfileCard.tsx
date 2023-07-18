import { useBlockUser, useUpdateMe } from '@/api/user/user.patch.api';
import ToggleSwitch from '@/components/app/toggle/ToggleSwitch';
import ProfileAvatar from '@/components/profile/avatar/ProfileAvatar';
import EditButton from '@/components/profile/cards/EditButton';
import UserInfo from '@/components/profile/sections/UserInfoSection';
import { ProfileData } from '@/components/profile/types/profile.type';
import { useAuth } from '@/providers/auth/auth.context';
import dashStyles from '@/styles/dash.module.css';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteCookie, getCookie } from 'cookies-next';
import { useSocket } from '@/providers/socket/socket.context';
import { useRouter } from 'next/router';
import { useGetFriends } from '@/api/friends/friends.get.api';
import { useUpdateFriends } from '@/api/friends/friends.patch.api';
import { TiUserAdd, TiUserDelete } from 'react-icons/ti';
import { RiPingPongFill, RiMovieFill } from 'react-icons/ri';
import { CgUnblock, CgBlock } from 'react-icons/cg';
import { AiFillMessage } from 'react-icons/ai';
import StatusInfo from '@/components/friends/line/StatusInfo';
import { useDMJoin } from '@/api/channel/channel.api';

interface ProfileDataProps {
  profileData: ProfileData;
  canEdit: boolean;
}

function ProfileCard({
  profileData,
  canEdit,
}: ProfileDataProps): React.ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const [hasChallenged, setHasChallenged] = useState(false);
  const { mutate: updateMe } = useUpdateMe();
  const { mutate: blockUser } = useBlockUser();
  const {
    data: friendsData,
    isLoading: isFriendsLoading,
    isError: isFriendsError,
  } = useGetFriends();
  const { mutate: updateFriends } = useUpdateFriends();
  const { mutate: joinDM } = useDMJoin();
  const { user } = useAuth();
  const { socket } = useSocket();
  const router = useRouter();

  const isBlocked = React.useMemo(
    () => user?.blockedUsers.some((user) => user.id === profileData?.id),
    [user?.blockedUsers, profileData?.id]
  );

  const isFriend = React.useMemo(
    () => !!friendsData?.friends.find((f) => f.id === profileData?.id),
    [friendsData?.friends, profileData?.id]
  );

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
            profileData.username +
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

  const handleJoinDM = () => {
    joinDM(
      { otherUserId: profileData.id },
      {
        onSuccess: (channel) => {
          router.push('/chat/channel/' + channel.id);
        },
      }
    );
  };

  useEffect(() => {
    const toastId: string = 'newUserPrompt';
    const promptUser = () => {
      toast.info(
        <div>
          Welcome dear friend!
          <br />
          Start by choosing your username and avatar here, or just go with the
          default one ;)
        </div>,
        { autoClose: false, toastId: toastId }
      );
      setIsEditing(true);
      deleteCookie('newUser', {
        sameSite: 'strict',
      });
    };
    let promptTimer: NodeJS.Timeout = 0 as any;
    const isNewUserCookie = getCookie('newUser', {
      sameSite: 'strict',
    });

    if (isNewUserCookie) {
      promptTimer = setTimeout(promptUser, 500);
    }
    return () => {
      clearTimeout(promptTimer);
      toast.dismiss(toastId);
    };
  }, []);

  return (
    <div className={dashStyles.dash__profile}>
      <ProfileAvatar
        src={profileData.profilePicture}
        isEditing={isEditing}
        mutate={updateMe}
      />
      <UserInfo
        firstName={profileData.firstName}
        lastName={profileData.lastName}
        username_={profileData.username}
        isEditing={isEditing}
        mutate={updateMe}
      />
      <div className={dashStyles.dash__2FA}>
        {canEdit && (
          <>
            <ToggleSwitch
              checked={profileData.has2FA}
              onToggle={
                isEditing
                  ? (): void => updateMe({ has2FA: !profileData.has2FA })
                  : undefined
              }
              name="2FA switch"
              isEditing={isEditing}
            />
            Two-Factor Authentication
          </>
        )}
      </div>
      {canEdit ? (
        <div className={dashStyles.dash__ctn__button}>
          <EditButton
            onClick={(): void => {
              setIsEditing((prevState) => !prevState);
            }}
            isEditing={isEditing}
          >
            {isEditing ? 'Save' : 'Edit'}
          </EditButton>
        </div>
      ) : (
        profileData.id !== user?.id && (
          <div className={dashStyles.dash__profile__btns}>
            <div className={dashStyles.ctn__four_buttons}>
              <div className={dashStyles.ctn__one_long_button}>
                <StatusInfo status={profileData.status} />
              </div>
              <div className={dashStyles.ctn__two_buttons}>
                <div className={dashStyles.ctn__one_button}>
                  <button
                    onClick={(): void =>
                      isFriend
                        ? updateFriends({
                            operation: 'REMOVE',
                            friendId: profileData.id,
                          })
                        : updateFriends({
                            operation: 'ADD',
                            friendId: profileData.id,
                          })
                    }
                    className={dashStyles.style__button__pro}
                    disabled={isFriendsLoading || isFriendsError}
                    title="Add or Remove"
                  >
                    {isFriend ? (
                      <TiUserDelete size="24px" />
                    ) : (
                      <TiUserAdd size="24px" />
                    )}
                  </button>
                </div>
                <div className={dashStyles.ctn__one_button}>
                  <button
                    onClick={(): void =>
                      challengeUser({
                        id: profileData.id,
                        username: profileData.username,
                      })
                    }
                    className={dashStyles.style__button__pro}
                    disabled={hasChallenged}
                    title="Let's play a match"
                  >
                    <RiPingPongFill size="24px" />
                  </button>
                </div>
              </div>
              <div className={dashStyles.ctn__two_buttons}>
                <div className={dashStyles.ctn__one_button}>
                  <button
                    onClick={(): void =>
                      watchUser({
                        id: profileData.id,
                        username: profileData.username,
                      })
                    }
                    className={dashStyles.style__button__pro}
                    title="Watch the game"
                  >
                    <RiMovieFill size="24px" />
                  </button>
                </div>
                <div className={dashStyles.ctn__one_button}>
                  <button
                    onClick={(): void =>
                      blockUser({ id: profileData.id, toggleBlock: !isBlocked })
                    }
                    className={dashStyles.style__button__pro}
                    title="Block or Unblock"
                  >
                    {isBlocked ? (
                      <CgUnblock size="24px" />
                    ) : (
                      <CgBlock size="24px" />
                    )}
                  </button>
                </div>
              </div>
              <div className={dashStyles.ctn__one_long_button}>
                <button
                  onClick={handleJoinDM}
                  className={dashStyles.style__button__pro}
                  title="Chat in private"
                >
                  <AiFillMessage size="24px" />
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default ProfileCard;
