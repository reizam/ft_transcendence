import { IUserData } from '@/api/profile/profile.type';
import Layout from '@/components/app/layouts/Layout';
import ProfileCard from '@/components/app/profile/ProfileCard';
import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';

interface UserDataProps {
  userData: IUserData;
  canEdit: boolean;
}

function Profile({ userData, canEdit }: UserDataProps): ReactElement {
  return (
    <>
      <Layout title="Profile">
        <div className={dashStyles.ctn__dash}>
          <div className={dashStyles.dash__profile}>
            <ProfileCard profileData={userData} canEdit={canEdit} />
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
