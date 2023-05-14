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
    <div className="flex flex-col items-center w-1/4 h-full bg-dark-purple rounded-xl">
      <ProfileAvatar src={profileData.profilePicture} canEdit={canEdit} />
      <UserInfo
        firstName={profileData.firstName}
        lastName={profileData.lastName}
        username={profileData.username}
      />
      {/* {canEdit && <TwoFASwitch checked={profileData.has2FA} />} */}
      <Button />
    </div>
  );
}

export default ProfileCard;
