import { useGetMe } from '@/api/user/user.api';
import Profile from '@/components/app/profile/Profile';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import { withProtected } from '@/providers/auth/auth.routes';
import { ReactElement } from 'react';

function MyProfile(): ReactElement {
  const userQuery = useGetMe();

  if (userQuery.isLoading) return <LoadingScreen />;
  if (userQuery.isError) return <p>No profile data</p>;

  return <Profile userData={userQuery.data} canEdit={true} />;
}

export default withProtected(MyProfile);
