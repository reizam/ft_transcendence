import { IUserData } from '@/api/user/user.type';
import ProfileCard from '@/components/profile/cards/ProfileCard';
import { ProfileData } from '@/components/profile/types/profile.type';
import { ReactElement } from 'react';

interface ProfileContentProps {
  userData: IUserData;
  canEdit: boolean;
}

function ProfileContent({
  userData,
  canEdit,
}: ProfileContentProps): ReactElement {
  const profileData: ProfileData = {
    username: userData.username,
    firstName: userData.firstName,
    lastName: userData.lastName,
    profilePicture: userData.profilePicture,
    has2FA: userData.has2FA,
  };
  return (
    <div className="flex flex-row w-full h-full p-16">
      <ProfileCard profileData={profileData} canEdit={canEdit} />
    </div>
  );
}

export default ProfileContent;
