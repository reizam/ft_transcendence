import { useGetUser } from '@/api/user/user.api';
import Profile from '@/components/app/profile/Profile';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import { withProtected } from '@/providers/auth/auth.routes';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

function UserProfile(): ReactElement {
  const router = useRouter();
  const { id } = router.query;
  const userQuery = useGetUser(id as string);

  if (userQuery.isLoading) return <LoadingScreen />;
  if (!userQuery.data) return <p>No profile data</p>;

  return <Profile userData={userQuery.data} canEdit={false} />;
}

export default withProtected(UserProfile);
