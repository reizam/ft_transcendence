import React, { useState } from 'react';
import Button from '@/components/app/button/Button';
import ToggleSwitch from '@/components/app/toggle/ToggleSwitch';
import ProfileAvatar from '@/components/profile/avatar/ProfileAvatar';
import UserInfo from '@/components/profile/sections/UserInfoSection';
import { ProfileData } from '@/components/profile/types/profile.type';
import dashStyles from '@/styles/dash.module.css';

interface ProfileDataProps {
  profileData: ProfileData;
  canEdit: boolean;
}

function ProfileCard({
  profileData,
  canEdit,
}: ProfileDataProps): React.ReactElement {
  const [isEditing, setIsEditing] = useState(false);
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
      {canEdit} &&{' '}
      <ToggleSwitch checked={profileData.has2FA} /* isEditing={isEditing}*/ />
      <Button initialName="Edit" onClickName="Save" onClick={onClick} />
    </div>
  );
}

export default ProfileCard;
