import { useGetUser } from '@/api/profile/profile.api';
import Profile from '@/components/app/profile/Profile';
import { ProfileEditContext } from '@/components/app/profile/ProfileEditContext';
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

  return (
    <ProfileEditContext.Provider value={false}>
      <Profile userData={userQuery.data} />
    </ProfileEditContext.Provider>
  );
}

export default withProtected(UserProfile);
