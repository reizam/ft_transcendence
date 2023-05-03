import { IUserData } from '@/api/profile/profile.type';
import Button from '@/components/app/button/Button';
import Avatar from '@/components/app/profile/Avatar';
import UserInfo from '@/components/app/profile/UserInfo';
import { ReactElement } from 'react';

type ProfileData = Pick<
  IUserData,
  'firstname' | 'lastname' | 'username' | 'profilePicture' | 'has2FA'
>;

interface ProfileDataProps {
  profileData: ProfileData;
  canEdit: boolean;
}

function ProfileCard({ profileData, canEdit }: ProfileDataProps): ReactElement {
  return (
    <>
      <Avatar src={profileData.profilePicture} canEdit={canEdit} />
      <UserInfo
        firstname={profileData.username}
        lastname={profileData.lastname}
        username={profileData.username}
        canEdit={canEdit}
      />
      {/* {canEdit && <TwoFASwitch checked={profileData.has2FA} />} */}
      <Button />
    </>
  );
}

export default ProfileCard;
