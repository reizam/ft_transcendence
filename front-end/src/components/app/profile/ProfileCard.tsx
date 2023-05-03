import Button from '@/components/app/button/Button';
import Avatar from '@/components/app/profile/Avatar';
import UserInfo from '@/components/app/profile/UserInfo';
import { ProfileData } from '@/components/app/profile/types/profile.type';
import { ReactElement } from 'react';

interface ProfileDataProps {
  profileData: ProfileData;
  canEdit: boolean;
}

function ProfileCard({ profileData, canEdit }: ProfileDataProps): ReactElement {
  return (
    <>
      <Avatar src={profileData.profilePicture} canEdit={canEdit} />
      <UserInfo
        firstName={profileData.firstName}
        lastName={profileData.lastName}
        username={profileData.username}
        canEdit={canEdit}
      />
      {/* {canEdit && <TwoFASwitch checked={profileData.has2FA} />} */}
      <Button />
    </>
  );
}

export default ProfileCard;
