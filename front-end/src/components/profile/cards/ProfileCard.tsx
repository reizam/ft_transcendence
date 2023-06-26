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

interface ProfileDataProps {
  profileData: ProfileData;
  canEdit: boolean;
}

function ProfileCard({
  profileData,
  canEdit,
}: ProfileDataProps): React.ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateMe } = useUpdateMe();
  const { mutate: blockUser } = useBlockUser();
  const { user } = useAuth();

  const isBlocked = React.useMemo(
    () => user?.blockedUsers.some((user) => user.id === profileData.id),
    [user?.blockedUsers, profileData.id]
  );

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
    let timer: NodeJS.Timeout = 0 as any;
    const isNewUserCookie = getCookie('newUser', {
      sameSite: 'strict',
    });

    if (isNewUserCookie) {
      timer = setTimeout(promptUser, 500);
    }
    return () => {
      clearTimeout(timer);
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
      {canEdit && (
        <div className={dashStyles.dash__2FA}>
          <ToggleSwitch
            checked={profileData.has2FA}
            onToggle={
              isEditing
                ? (): void => updateMe({ has2FA: !profileData.has2FA })
                : undefined
            }
            isEditing={isEditing}
          />
          Two-Factor Authentication
        </div>
      )}
      {canEdit ? (
        <>
          <EditButton
            onClick={(): void => {
              setIsEditing((prevState) => !prevState);
            }}
            isEditing={isEditing}
          >
            {isEditing ? 'Save' : 'Edit'}
          </EditButton>
          <div style={{ marginBottom: '15%' }}></div>
        </>
      ) : (
        profileData.id !== user?.id && (
          <button
            onClick={(): void =>
              blockUser({ id: profileData.id, toggleBlock: !isBlocked })
            }
            className="bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75 rounded-full text-white font-medium text-sm transition ease-in-out duration-200 px-4 py-2"
          >
            {isBlocked ? 'Unblock' : 'Block'}
          </button>
        )
      )}
    </div>
  );
}

export default ProfileCard;
