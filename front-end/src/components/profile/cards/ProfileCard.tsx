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
            <div>
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
                className="bg-[var(--main-theme-color)] ring-[var(--container-color)] hover:ring-1 active:opacity-75
                  rounded-full min-w-[10vw] aspect-[7/2] mt-2 disabled:opacity-75"
                disabled={isFriendsLoading || isFriendsError}
              >
                {isFriend ? 'Remove friend' : 'Add friend'}
              </button>
            </div>
            <div>
              <button
                onClick={(): void =>
                  challengeUser({
                    id: profileData.id,
                    username: profileData.username,
                  })
                }
                className="bg-[var(--main-theme-color)] ring-[var(--container-color)] hover:ring-1 active:opacity-75
                  rounded-full min-w-[10vw] aspect-[7/2] mt-5 disabled:opacity-75"
                disabled={hasChallenged}
              >
                Challenge
              </button>
            </div>
            <div>
              <button
                onClick={(): void =>
                  watchUser({
                    id: profileData.id,
                    username: profileData.username,
                  })
                }
                className="bg-[var(--main-theme-color)] ring-[var(--container-color)] hover:ring-1 active:opacity-75
                  rounded-full min-w-[10vw] aspect-[7/2] mt-5"
              >
                Watch
              </button>
            </div>
            <div>
              <button
                onClick={(): void =>
                  blockUser({ id: profileData.id, toggleBlock: !isBlocked })
                }
                className="bg-[var(--main-theme-color)] ring-[var(--container-color)] hover:ring-1 active:opacity-75
                  rounded-full min-w-[10vw] aspect-[7/2] mt-5 mb-5"
              >
                {isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default ProfileCard;
