import { useGetUser } from '@/api/user/user.api';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import { withProtected } from '@/providers/auth/auth.routes';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import Layout from '@/components/app/layouts/Layout';
import ProfileContent from '@/components/profile/ProfileContent';
import { IUserData } from '@/api/user/user.types';

function ViewProfile(): ReactElement {
  const router = useRouter();

  const { id } = router.query;

  const { data, isLoading } = useGetUser(id as string | undefined);

  if (isLoading) return <LoadingScreen />;

  if (!data) return <p>No profile data</p>;

  return (
    <Layout title="View Profile">
      <ProfileContent userData={data} canEdit={false} />;
    </Layout>
  );
}

export default withProtected(ViewProfile);
