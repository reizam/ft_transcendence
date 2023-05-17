import { useUpdateMe } from '@/api/user/user.patch.api';
import EditButton from '@/components/profile/cards/EditButton';
import ToggleSwitch from '@/components/app/toggle/ToggleSwitch';
import ProfileAvatar from '@/components/profile/avatar/ProfileAvatar';
import UserInfo from '@/components/profile/sections/UserInfoSection';
import { ProfileData } from '@/components/profile/types/profile.type';
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
  const { mutate } = useUpdateMe();

  return (
    <div className={dashStyles.dash__profile}>
      <ProfileAvatar
        src={profileData.profilePicture}
        isEditing={isEditing}
        mutate={mutate}
      />
      <UserInfo
        // TODO: Show the username update constraints in the input field
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
            name={isEditing ? 'Save' : 'Edit'}
            onClick={(): void => {
              setIsEditing((prevState) => !prevState);
            }}
            isEditing={isEditing}
          />
          <div style={{ marginBottom: '15%' }}></div>
        </>
      )}
    </div>
  );
}

export default ProfileCard;
