import { useGetMe } from '@/api/profile/profile.api';
import Profile from '@/components/app/profile/Profile';
import { ProfileEditContext } from '@/components/app/profile/ProfileEditContext';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import { withProtected } from '@/providers/auth/auth.routes';
import { ReactElement } from 'react';

function MyProfile(): ReactElement {
  const userQuery = useGetMe();

  console.log(userQuery.status, userQuery.fetchStatus);

  if (userQuery.isLoading) return <LoadingScreen />;
  if (!userQuery.data) return <p>No profile data</p>;

  return (
    <ProfileEditContext.Provider value={true}>
      <Profile userData={userQuery.data} />
    </ProfileEditContext.Provider>
  );
}

export default withProtected(MyProfile);
