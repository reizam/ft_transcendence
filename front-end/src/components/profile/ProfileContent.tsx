import { IUserData } from '@/api/user/user.types';
import ProfileCard from '@/components/profile/cards/ProfileCard';
import Achievements from '@/components/profile/sections/Achievements';
import History from '@/components/profile/sections/History';
import Stats from '@/components/profile/sections/Stats';
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
  return (
    <div className={dashStyles.ctn__dash}>
      <ProfileCard
        profileData={{
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profilePicture: userData.profilePicture,
          has2FA: userData.has2FA,
        }}
        canEdit={canEdit}
      />
      <History matchHistory={userData.matchHistory} />
      <Stats stats={userData.statistics} rank={userData.rank} />
      <Achievements achievements={userData.achievements} />
    </div>
  );
}

export default ProfileContent;
