import { IUserData } from '@/api/user/user.type';
import ProfileCard from '@/components/profile/cards/ProfileCard';
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
      <div className={dashStyles.dash__profile}>
        <ProfileCard profileData={profileData} canEdit={canEdit} />
        {/* <Achievements /> */}
        {/* <MatchHistory /> */}
        {/* <Stats /> */}
      </div>
    </div>
  );
}

export default ProfileContent;
