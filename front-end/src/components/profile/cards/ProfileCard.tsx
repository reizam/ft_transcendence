import { useUpdateMe } from '@/api/user/user.patch.api';
import EditButton from '@/components/profile/cards/EditButton';
import ToggleSwitch from '@/components/app/toggle/ToggleSwitch';
import ProfileAvatar from '@/components/profile/avatar/ProfileAvatar';
import UserInfo from '@/components/profile/sections/UserInfoSection';
import { ProfileData } from '@/components/profile/types/profile.type';
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
  const { mutate } = useUpdateMe();

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
        mutate={mutate}
      />
      <UserInfo
        firstName={profileData.firstName}
        lastName={profileData.lastName}
        username_={profileData.username}
        isEditing={isEditing}
        mutate={mutate}
      />
      {canEdit && (
        <div className={dashStyles.dash__2FA}>
          <ToggleSwitch
            checked={profileData.has2FA}
            onToggle={
              isEditing
                ? (): void => mutate({ has2FA: !profileData.has2FA })
                : undefined
            }
            isEditing={isEditing}
          />
          Two-Factor Authentication
        </div>
      )}
      {canEdit && (
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
      )}
    </div>
  );
}

export default ProfileCard;
