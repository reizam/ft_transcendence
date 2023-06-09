import { useGetMe } from '@/api/user/user.get.api';
import Layout from '@/components/app/layouts/Layout';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import ProfileContent from '@/components/profile/ProfileContent';
import { withProtected } from '@/providers/auth/auth.routes';
import { ReactElement } from 'react';

function Profile(): ReactElement {
  const { data, isLoading, isError } = useGetMe();

  return (
    <Layout title="Dashboard">
      {isLoading ? (
        <LoadingScreen />
      ) : isError || !data ? (
        <p>No profile data</p>
      ) : (
        <ProfileContent canEdit={true} userData={data} />
      )}
    </Layout>
  );
}

export default withProtected(Profile);
