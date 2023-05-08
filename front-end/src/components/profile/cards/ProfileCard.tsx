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
  const [username, setUsername] = useState(profileData.username);
  const updateUsername = (): void => {
    if (isEditing && username != profileData.username) {
      mutate(
        { username: username },
        { onError: () => setUsername(profileData.username) }
      );
    }
  };

  return (
    <div className={dashStyles.dash__profile}>
      <ProfileAvatar
        src={profileData.profilePicture}
        canEdit={canEdit}
        // isEditing={isEditing}
      />
      <UserInfo
        firstName={profileData.firstName}
        lastName={profileData.lastName}
        username={username}
        isEditing={isEditing}
        onChange={(e) => setUsername(e.currentTarget.value)}
        onSubmit={(e) => {
          e.preventDefault();
          updateUsername();
        }}
      />
      {canEdit && (
        <div className={dashStyles.dash__2FA}>
          <ToggleSwitch
            checked={profileData.has2FA}
            onToggle={
              isEditing
                ? () => mutate({ has2FA: !profileData.has2FA })
                : undefined
            }
          />
          Two-Factor Authentication
        </div>
      )}
      {canEdit && (
        <Button // add additionnal className property if isEditing to highlight the button
          name={isEditing ? 'Save' : 'Edit'}
          onClick={(): void => {
            setIsEditing((prevState) => !prevState);
            updateUsername();
          }}
        />
      )}
    </div>
  );
}

export default ProfileCard;
