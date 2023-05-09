import { useUpdateMe } from '@/api/user/user.patch.api';
import Button from '@/components/app/button/Button';
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
      <ProfileAvatar src={profileData.profilePicture} isEditing={isEditing} />
      <UserInfo
        // TODO: Add constraints to the username update & specific error msg if already taken
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
        <Button
          name={isEditing ? 'Save' : 'Edit'}
          onClick={(): void => {
            setIsEditing((prevState) => !prevState);
          }}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}

export default ProfileCard;
