import { useGetUser } from '@/api/user/user.get.api';
import Layout from '@/components/app/layouts/Layout';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import ProfileContent from '@/components/profile/ProfileContent';
import { withProtected } from '@/providers/auth/auth.routes';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

function ViewProfile(): ReactElement {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, isError } = useGetUser(id as string | undefined);

  return (
    <Layout title="Dashboard">
      {isLoading ? (
        <LoadingScreen />
      ) : isError || !data ? (
        <p>No profile data</p>
      ) : (
        <ProfileContent canEdit={false} userData={data} />
      )}
    </Layout>
  );
}

export default withProtected(ViewProfile);
