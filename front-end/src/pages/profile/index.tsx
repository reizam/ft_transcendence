import { useGetMe } from '@/api/user/user.api';
import Layout from '@/components/app/layouts/Layout';
import LoadingScreen from '@/components/app/screen/LoadingScreen';
import ProfileContent from '@/components/profile/ProfileContent';
import { withProtected } from '@/providers/auth/auth.routes';
import { ReactElement } from 'react';

function Profile(): ReactElement {
  const { data, isLoading } = useGetMe();

  return (
    <Layout title="Dashboard">
      {isLoading ? (
        <LoadingScreen />
      ) : data ? (
        <ProfileContent canEdit userData={data} />
      ) : (
        <p>No data</p>
      )}
    </Layout>
  );
}

export default withProtected(Profile);
