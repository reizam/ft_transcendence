import React from 'react';
import Button from '@/components/app/button/Button';
import ProfileAvatar from '@/components/profile/avatar/ProfileAvatar';
import UserInfo from '@/components/profile/sections/UserInfoSection';
import { ProfileData } from '@/components/profile/types/profile.type';

interface ProfileDataProps {
  profileData: ProfileData;
  canEdit: boolean;
}

function ProfileCard({
  profileData,
  canEdit,
}: ProfileDataProps): React.ReactElement {
  return (
    <>
      <ProfileAvatar src={profileData.profilePicture} canEdit={canEdit} />
      <UserInfo
        firstName={profileData.firstName}
        lastName={profileData.lastName}
        username={profileData.username}
      />
      {/* {canEdit && <TwoFASwitch checked={profileData.has2FA} />} */}
      <Button />
    </>
  );
}

export default ProfileCard;
