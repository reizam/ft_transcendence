import { useBlockUser, useUpdateMe } from '@/api/user/user.patch.api';
import ToggleSwitch from '@/components/app/toggle/ToggleSwitch';
import ProfileAvatar from '@/components/profile/avatar/ProfileAvatar';
import { default as EditButton } from '@/components/profile/cards/EditButton';
import UserInfo from '@/components/profile/sections/UserInfoSection';
import { ProfileData } from '@/components/profile/types/profile.type';
import { useAuth } from '@/providers/auth/auth.context';
import dashStyles from '@/styles/dash.module.css';
import React, { useState } from 'react';

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

  return (
    <div className={dashStyles.dash__profile}>
      <ProfileAvatar
        src={profileData.profilePicture}
        isEditing={isEditing}
        mutate={updateMe}
      />
      <UserInfo
        // TODO: Show the username update constraints in the input field
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
        <EditButton
          onClick={(): void => {
            setIsEditing((prevState) => !prevState);
          }}
          isEditing={isEditing}
        >
          {isEditing ? 'Save' : 'Edit'}
        </EditButton>
      ) : (
        profileData.id !== user?.id && (
          <EditButton
            onClick={(): void =>
              blockUser({ id: profileData.id, toggleBlock: !isBlocked })
            }
          >
            {isBlocked ? 'Unblock' : 'Block'}
          </EditButton>
        )
      )}
    </div>
  );
}

export default ProfileCard;
