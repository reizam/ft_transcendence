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
  const [checked, setChecked] = useState(profileData.has2FA);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate, isLoading, isSuccess, isError, error, context } =
    useUpdateMe();
  const onToggle = (isChecked: boolean) => {
    mutate(
      { has2FA: isChecked },
      // or rather with context to use it in the same way with others
      { onError: () => setChecked(!isChecked) }
    );
    setChecked(isChecked);
  };
  const onClick = () => setIsEditing(!isEditing);

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
        username={profileData.username}
        // isEditing={isEditing}
      />
      <div className={dashStyles.dash__2FA}>
        <ToggleSwitch
          checked={checked}
          onToggle={!!isEditing ? onToggle : undefined}
        />
        Two-Factor Authentication
      </div>
      {!!canEdit && (
        <Button initialName="Edit" onClickName="Save" onClick={onClick} />
      )}
    </div>
  );
}

export default ProfileCard;
