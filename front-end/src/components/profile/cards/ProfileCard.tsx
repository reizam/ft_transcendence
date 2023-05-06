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
  const [checked, setChecked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const onToggle = (isChecked: boolean) => {
    // ...;
    setChecked(isChecked);
  };
  const onClick = () => setIsEditing(!isEditing);

  console.log('isEditing =', isEditing);
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
        <div>Two-Factor Authentication</div>
      </div>
      {!!canEdit && (
        <Button initialName="Edit" onClickName="Save" onClick={onClick} />
      )}
    </div>
  );
}

export default ProfileCard;
