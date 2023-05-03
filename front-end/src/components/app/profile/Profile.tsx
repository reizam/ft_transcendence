import { IUserData } from '@/api/user/user.type';
import Layout from '@/components/app/layouts/Layout';
import ProfileCard from '@/components/app/profile/ProfileCard';
import { ProfileData } from '@/components/app/profile/types/profile.type';
import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';

interface UserDataProps {
  userData: IUserData;
  canEdit: boolean;
}

function Profile({ userData, canEdit }: UserDataProps): ReactElement {
  const profileData: ProfileData = {
    username: userData.username,
    firstName: userData.firstName,
    lastName: userData.lastName,
    profilePicture: userData.profilePicture,
    has2FA: userData.has2FA,
  };
  return (
    <>
      <Layout title="Profile">
        <div className={dashStyles.ctn__dash}>
          <div className={dashStyles.dash__profile}>
            <ProfileCard profileData={profileData} canEdit={canEdit} />
            {/* <Achievements /> */}
            {/* <MatchHistory /> */}
            {/* <Stats /> */}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Profile;
