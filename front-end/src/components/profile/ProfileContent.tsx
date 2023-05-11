import { IUserData } from '@/api/user/user.type';
import ProfileCard from '@/components/profile/cards/ProfileCard';
import Achievements from '@/components/profile/sections/Achievements';
import History from '@/components/profile/sections/History';
import Stats from '@/components/profile/sections/Stats';
import { ProfileData } from '@/components/profile/types/profile.type';
import dashStyles from '@/styles/dash.module.css';
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
    <div className={dashStyles.ctn__dash}>
      <ProfileCard profileData={profileData} canEdit={canEdit} />
      <History matchHistory={userData.matchHistory} />
      <Stats />
      <Achievements />
    </div>
  );
}

export default ProfileContent;
