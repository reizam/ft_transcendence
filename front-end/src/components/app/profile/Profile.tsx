import { IUserData } from '@/api/profile/profile.type';
import Layout from '../layouts/Layout';
import ProfileCard from './ProfileCard';
import { ReactElement } from 'react';

interface UserDataProps {
  userData: IUserData;
}

function Profile({ userData }: UserDataProps): ReactElement {
  return (
    <>
      <Layout
        className="flex items-center justify-center h-screen bg-purple"
        title="Home"
      >
        <ProfileCard userData={userData} />
        {/* <Achievements /> */}
        {/* <MatchHistory /> */}
        {/* <Stats /> */}
      </Layout>
    </>
  );
}

export default Profile;
